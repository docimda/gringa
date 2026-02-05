-- Rename comments to internal_comments
ALTER TABLE orders RENAME COLUMN comments TO internal_comments;

-- Remove barbershop_name
ALTER TABLE orders DROP COLUMN IF EXISTS barbershop_name;

-- Add new fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS complement TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
