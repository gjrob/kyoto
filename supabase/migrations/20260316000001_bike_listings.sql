-- DUSTDEVIL: bike_listings table
-- Multi-tenant: client_slug = 'dustdevil'
-- Column names aligned with page.tsx PostModal insert

CREATE TABLE IF NOT EXISTS bike_listings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug          text NOT NULL DEFAULT 'dustdevil',
  status               text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),

  -- Bike details (matches page.tsx PostModal)
  brand                text NOT NULL,
  model                text NOT NULL,
  year                 integer NOT NULL,
  condition            text NOT NULL DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'parts')),
  hours_ridden         integer,
  description          text,
  image_urls           text[] DEFAULT '{}',

  -- Pricing (matches page.tsx: price_cents)
  price_cents          integer NOT NULL,

  -- Seller contact (matches page.tsx PostModal fields)
  seller_name          text,
  seller_phone         text,
  seller_email         text,
  location             text,

  -- Timestamps
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  sold_at              timestamptz,

  -- Analytics counters
  views                integer NOT NULL DEFAULT 0,
  inquiries            integer NOT NULL DEFAULT 0
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_bike_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bike_listings_updated_at ON bike_listings;
CREATE TRIGGER bike_listings_updated_at
  BEFORE UPDATE ON bike_listings
  FOR EACH ROW EXECUTE FUNCTION update_bike_listings_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS bike_listings_client_slug_idx ON bike_listings(client_slug);
CREATE INDEX IF NOT EXISTS bike_listings_status_idx ON bike_listings(status);
CREATE INDEX IF NOT EXISTS bike_listings_brand_idx ON bike_listings(brand);
CREATE INDEX IF NOT EXISTS bike_listings_created_at_idx ON bike_listings(created_at DESC);

-- RLS
ALTER TABLE bike_listings ENABLE ROW LEVEL SECURITY;

-- Public can read active listings
CREATE POLICY "public can view active dustdevil listings"
  ON bike_listings FOR SELECT
  USING (status = 'active' AND client_slug = 'dustdevil');

-- Anyone can post a listing (free marketplace, no auth required)
CREATE POLICY "public can post dustdevil listings"
  ON bike_listings FOR INSERT
  WITH CHECK (client_slug = 'dustdevil');
