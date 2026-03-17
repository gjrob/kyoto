-- ============================================
-- Western N Third — CRM + Buy/Sell Marketplace
-- ============================================

-- 1. VENDORS TABLE (Business Accounts)
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Wilmington',
  state TEXT DEFAULT 'NC',
  zip TEXT,
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  auto_accept_offers BOOLEAN DEFAULT false,
  shipping_available BOOLEAN DEFAULT true,
  total_listings INTEGER DEFAULT 0,
  total_sold INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  response_rate_pct INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT vendor_email_unique UNIQUE(email)
);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_verified ON vendors(verified);

-- 2. LISTINGS TABLE (Inventory)
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  asking_price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  negotiable BOOLEAN DEFAULT true,
  quantity_available INTEGER DEFAULT 1,
  quantity_sold INTEGER DEFAULT 0,
  location_city TEXT,
  location_state TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold-out', 'inactive', 'archived')),
  posted_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  search_vector tsvector,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  offer_count INTEGER DEFAULT 0,
  CONSTRAINT valid_price CHECK (asking_price_cents >= 0),
  CONSTRAINT valid_quantities CHECK (quantity_available >= 0 AND quantity_sold >= 0)
);

CREATE INDEX idx_listings_vendor_id ON listings(vendor_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_updated_at ON listings(updated_at DESC);
CREATE INDEX idx_listings_price ON listings(asking_price_cents);
CREATE INDEX idx_listings_search ON listings USING GIN(search_vector);

-- 3. ORDERS TABLE (Transactions)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  CONSTRAINT valid_quantities CHECK (quantity > 0),
  CONSTRAINT valid_pricing CHECK (unit_price_cents >= 0)
);

CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_listing_id ON orders(listing_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 4. INQUIRIES TABLE (Leads)
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  inquirer_name TEXT NOT NULL,
  inquirer_email TEXT NOT NULL,
  inquirer_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'converted', 'closed')),
  created_at TIMESTAMP DEFAULT now(),
  responded_at TIMESTAMP,
  closed_at TIMESTAMP
);

CREATE INDEX idx_inquiries_vendor_id ON inquiries(vendor_id);
CREATE INDEX idx_inquiries_listing_id ON inquiries(listing_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- 5. VENDOR_STATS TABLE
CREATE TABLE public.vendor_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
  total_listings INTEGER DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  total_sold INTEGER DEFAULT 0,
  total_revenue_cents BIGINT DEFAULT 0,
  month_revenue_cents BIGINT DEFAULT 0,
  total_inquiries INTEGER DEFAULT 0,
  responded_inquiries INTEGER DEFAULT 0,
  response_rate_pct NUMERIC DEFAULT 0,
  avg_response_time_hours NUMERIC,
  repeat_buyer_count INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 5.0,
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_vendor_stats_vendor_id ON vendor_stats(vendor_id);

-- 6. OFFERS TABLE
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  offered_price_cents INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  message TEXT,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP DEFAULT (now() + interval '7 days'),
  responded_at TIMESTAMP,
  CONSTRAINT valid_offer_price CHECK (offered_price_cents > 0)
);

CREATE INDEX idx_offers_vendor_id ON offers(vendor_id);
CREATE INDEX idx_offers_listing_id ON offers(listing_id);
CREATE INDEX idx_offers_status ON offers(status);

-- 7. REVIEWS TABLE
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(order_id, reviewer_email)
);

CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);

-- TRIGGER: Update vendor stats on order completion
CREATE OR REPLACE FUNCTION update_vendor_stats_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendor_stats
  SET
    total_sold = total_sold + NEW.quantity,
    total_revenue_cents = total_revenue_cents + NEW.total_price_cents,
    month_revenue_cents = month_revenue_cents + NEW.total_price_cents,
    updated_at = now()
  WHERE vendor_id = NEW.vendor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vendor_stats_on_order
AFTER UPDATE OF status ON orders
FOR EACH ROW
WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
EXECUTE FUNCTION update_vendor_stats_on_order();

-- TRIGGER: Full-text search vector on listings
CREATE OR REPLACE FUNCTION update_listing_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.category, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_listing_search_vector
BEFORE INSERT OR UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_listing_search_vector();

-- RPC: Increment listing inquiry count
CREATE OR REPLACE FUNCTION increment_listing_inquiries(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE listings SET inquiry_count = inquiry_count + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;
