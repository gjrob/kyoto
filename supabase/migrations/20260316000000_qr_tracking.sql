-- QR Tracking System
-- Tables: qr_codes, qr_scans

CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug text NOT NULL DEFAULT 'western-n-third',
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  destination_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id)
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_listing_id ON qr_codes(listing_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_client_slug ON qr_codes(client_slug);

CREATE TABLE IF NOT EXISTS qr_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  client_slug text NOT NULL DEFAULT 'western-n-third',
  listing_id uuid NOT NULL,
  scanned_at timestamptz DEFAULT now(),
  device_type text,
  user_agent text,
  referrer text,
  converted boolean DEFAULT false,
  conversion_value_cents integer,
  converted_at timestamptz,
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_listing_id ON qr_scans(listing_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_client_slug ON qr_scans(client_slug);

-- RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Anyone can read qr_codes (landing page needs this unauthenticated)
CREATE POLICY "Public can read qr_codes"
  ON qr_codes FOR SELECT USING (true);

-- Authenticated vendors can insert qr_codes for their own listings
CREATE POLICY "Vendors can insert own qr_codes"
  ON qr_codes FOR INSERT WITH CHECK (
    listing_id IN (
      SELECT l.id FROM listings l
      JOIN vendors v ON l.vendor_id = v.id
      WHERE v.user_id = auth.uid()
    )
  );

-- Anyone can insert qr_scans (scan logging, no auth required)
CREATE POLICY "Public can insert qr_scans"
  ON qr_scans FOR INSERT WITH CHECK (true);

-- Vendors can read scans for their own listings
CREATE POLICY "Vendors can read own qr_scans"
  ON qr_scans FOR SELECT USING (
    listing_id IN (
      SELECT l.id FROM listings l
      JOIN vendors v ON l.vendor_id = v.id
      WHERE v.user_id = auth.uid()
    )
  );

-- Vendors can update scans (for conversion tracking)
CREATE POLICY "Vendors can update own qr_scans"
  ON qr_scans FOR UPDATE USING (
    listing_id IN (
      SELECT l.id FROM listings l
      JOIN vendors v ON l.vendor_id = v.id
      WHERE v.user_id = auth.uid()
    )
  );
