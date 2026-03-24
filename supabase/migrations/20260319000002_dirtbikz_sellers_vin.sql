-- DIRTBIKZ: Stripe Connect sellers + VIN verification
-- Enables multi-seller marketplace with 85/15 commission split
-- Annual fee: $10,299 (first 6 sellers get $10,000 coupon)
-- 3-day payout wait, any payout amount

-- Ensure the shared updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Ensure products table exists (created in 20260316000002_dirtbikz.sql)
-- This DO block prevents failure if migrations run out of order
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
    CREATE TABLE products (
      id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_slug           text NOT NULL DEFAULT 'dirtbikz',
      name                  text NOT NULL,
      category              text NOT NULL,
      brand                 text,
      model                 text,
      year                  integer,
      description           text,
      specs                 jsonb DEFAULT '{}',
      primary_image_url     text,
      images                jsonb DEFAULT '[]',
      price_cents           integer NOT NULL,
      original_price_cents  integer,
      location              text,
      in_stock              boolean NOT NULL DEFAULT true,
      featured              boolean NOT NULL DEFAULT false,
      created_at            timestamptz NOT NULL DEFAULT now(),
      updated_at            timestamptz NOT NULL DEFAULT now()
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    CREATE TABLE orders (
      id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_slug               text NOT NULL DEFAULT 'dirtbikz',
      customer_name             text NOT NULL,
      customer_email            text NOT NULL,
      customer_phone            text,
      items                     jsonb NOT NULL DEFAULT '[]',
      total_cents               integer NOT NULL,
      shipping_address          text,
      shipping_city             text,
      shipping_state            text,
      shipping_zip              text,
      stripe_payment_intent_id  text,
      stripe_session_id         text,
      payment_status            text NOT NULL DEFAULT 'pending',
      order_status              text NOT NULL DEFAULT 'new',
      created_at                timestamptz NOT NULL DEFAULT now(),
      updated_at                timestamptz NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- ── sellers ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sellers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug           text NOT NULL DEFAULT 'dirtbikz',

  -- Identity
  email                 text NOT NULL UNIQUE,
  business_name         text NOT NULL,
  contact_name          text NOT NULL,
  phone                 text,
  password_hash         text NOT NULL,

  -- Stripe Connect
  stripe_account_id     text,          -- acct_xxx from Stripe Connect
  stripe_onboarding_complete boolean NOT NULL DEFAULT false,
  stripe_payouts_enabled     boolean NOT NULL DEFAULT false,

  -- Annual fee ($10,299 upfront)
  stripe_subscription_id     text,     -- sub_xxx for annual fee
  annual_fee_status          text NOT NULL DEFAULT 'unpaid'
                              CHECK (annual_fee_status IN ('unpaid', 'paid', 'past_due', 'cancelled')),
  annual_fee_paid_at         timestamptz,
  coupon_code                text,     -- e.g. 'EARLY6' for $10,000 off
  annual_fee_amount_cents    integer NOT NULL DEFAULT 1029900,  -- $10,299

  -- Status
  status                text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  approved_at           timestamptz,
  suspended_at          timestamptz,
  suspension_reason     text,

  -- Profile
  bio                   text,
  logo_url              text,
  location              text,

  -- Stats (denormalized for dashboard)
  total_sales_cents     bigint NOT NULL DEFAULT 0,
  total_orders          integer NOT NULL DEFAULT 0,
  rating                numeric(3,2) DEFAULT 0,

  -- Timestamps
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER sellers_updated_at
  BEFORE UPDATE ON sellers
  FOR EACH ROW EXECUTE FUNCTION update_products_updated_at();

CREATE INDEX IF NOT EXISTS sellers_client_slug_idx ON sellers(client_slug);
CREATE INDEX IF NOT EXISTS sellers_email_idx ON sellers(email);
CREATE INDEX IF NOT EXISTS sellers_stripe_account_idx ON sellers(stripe_account_id);
CREATE INDEX IF NOT EXISTS sellers_status_idx ON sellers(status);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages sellers"
  ON sellers FOR ALL
  USING (client_slug = 'dirtbikz');

-- ── Add seller_id to products ───────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES sellers(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS vin text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vin_verified boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vin_data jsonb;

CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products(seller_id);
CREATE INDEX IF NOT EXISTS products_vin_idx ON products(vin);

-- ── Add seller_id to orders ─────────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES sellers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS platform_fee_cents integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_payout_cents integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_transfer_id text;

CREATE INDEX IF NOT EXISTS orders_seller_id_idx ON orders(seller_id);

-- ── seller_payouts — track payout history ───────────────────────────────────
CREATE TABLE IF NOT EXISTS seller_payouts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id             uuid NOT NULL REFERENCES sellers(id),
  client_slug           text NOT NULL DEFAULT 'dirtbikz',
  stripe_payout_id      text,
  amount_cents          integer NOT NULL,
  status                text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'in_transit', 'paid', 'failed', 'cancelled')),
  arrival_date          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS seller_payouts_seller_idx ON seller_payouts(seller_id);
CREATE INDEX IF NOT EXISTS seller_payouts_status_idx ON seller_payouts(status);

ALTER TABLE seller_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages seller_payouts"
  ON seller_payouts FOR ALL
  USING (client_slug = 'dirtbikz');

-- ── vin_lookups — VIN verification audit trail ──────────────────────────────
CREATE TABLE IF NOT EXISTS vin_lookups (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug           text NOT NULL DEFAULT 'dirtbikz',
  vin                   text NOT NULL,
  seller_id             uuid REFERENCES sellers(id),
  product_id            uuid REFERENCES products(id),

  -- NHTSA data
  valid                 boolean NOT NULL,
  make                  text,
  model                 text,
  year                  integer,
  vehicle_type          text,
  body_class            text,
  engine_info           text,
  raw_response          jsonb,

  -- Price verification
  msrp_cents            integer,
  listed_price_cents    integer,
  price_flag            text CHECK (price_flag IN ('normal', 'underpriced', 'overpriced', 'suspicious')),
  price_deviation_pct   numeric(5,2),

  -- Admin review
  reviewed_by           text,
  reviewed_at           timestamptz,
  override_reason       text,

  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vin_lookups_vin_idx ON vin_lookups(vin);
CREATE INDEX IF NOT EXISTS vin_lookups_seller_idx ON vin_lookups(seller_id);
CREATE INDEX IF NOT EXISTS vin_lookups_flag_idx ON vin_lookups(price_flag);

ALTER TABLE vin_lookups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages vin_lookups"
  ON vin_lookups FOR ALL
  USING (client_slug = 'dirtbikz');

-- ── seller_disputes — chargeback/dispute tracking ───────────────────────────
CREATE TABLE IF NOT EXISTS seller_disputes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id             uuid NOT NULL REFERENCES sellers(id),
  order_id              uuid REFERENCES orders(id),
  client_slug           text NOT NULL DEFAULT 'dirtbikz',
  stripe_dispute_id     text NOT NULL,
  stripe_charge_id      text,
  amount_cents          integer NOT NULL,
  reason                text,         -- e.g. 'fraudulent', 'product_not_received'
  status                text NOT NULL DEFAULT 'needs_response'
                         CHECK (status IN (
                           'needs_response', 'under_review', 'won', 'lost',
                           'warning_needs_response', 'warning_under_review', 'warning_closed'
                         )),
  evidence_due_by       timestamptz,
  resolved_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS seller_disputes_seller_idx ON seller_disputes(seller_id);
CREATE INDEX IF NOT EXISTS seller_disputes_status_idx ON seller_disputes(status);
CREATE INDEX IF NOT EXISTS seller_disputes_stripe_idx ON seller_disputes(stripe_dispute_id);

ALTER TABLE seller_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages seller_disputes"
  ON seller_disputes FOR ALL
  USING (client_slug = 'dirtbikz');

-- ── RPC: increment seller stats atomically ──────────────────────────────────
CREATE OR REPLACE FUNCTION increment_seller_stats(
  p_seller_id uuid,
  p_amount_cents bigint
) RETURNS void AS $$
BEGIN
  UPDATE sellers
  SET total_sales_cents = total_sales_cents + p_amount_cents,
      total_orders = total_orders + 1
  WHERE id = p_seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── RPC: count paid sellers (for early bird coupon validation) ──────────────
CREATE OR REPLACE FUNCTION count_paid_sellers()
RETURNS integer AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM sellers WHERE annual_fee_status = 'paid' AND client_slug = 'dirtbikz');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
