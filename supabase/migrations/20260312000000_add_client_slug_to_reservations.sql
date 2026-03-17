-- Migration: add client_slug to kyoto_reservations
-- Added because API routes expect a `client_slug` column

ALTER TABLE kyoto_reservations
  ADD COLUMN IF NOT EXISTS client_slug text;

-- Ensure defaults or constraints could be added later if needed
