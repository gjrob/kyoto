-- DIRTBIKZ: Change commission from 15% to 5%
-- Recalculate platform_fee_cents and seller_payout_cents on existing orders

-- Recalculate all orders that had the old 15% split
UPDATE orders
SET platform_fee_cents  = ROUND(total_cents * 0.05),
    seller_payout_cents = total_cents - ROUND(total_cents * 0.05)
WHERE client_slug = 'dirtbikz'
  AND seller_id IS NOT NULL
  AND platform_fee_cents IS NOT NULL;
