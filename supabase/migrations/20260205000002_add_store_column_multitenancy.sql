-- Rename store_name to store in shipping_rates
ALTER TABLE shipping_rates RENAME COLUMN store_name TO store;

-- Add store column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS store TEXT DEFAULT 'docimdagringa';

-- Add store column to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS store TEXT DEFAULT 'docimdagringa';

-- Add store column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS store TEXT DEFAULT 'docimdagringa';

-- Add store column to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS store TEXT DEFAULT 'docimdagringa';

-- Add store column to order_items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS store TEXT DEFAULT 'docimdagringa';

-- Create index on store column for all tables to improve query performance
CREATE INDEX IF NOT EXISTS idx_shipping_rates_store ON shipping_rates(store);
CREATE INDEX IF NOT EXISTS idx_profiles_store ON profiles(store);
CREATE INDEX IF NOT EXISTS idx_store_settings_store ON store_settings(store);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store);
CREATE INDEX IF NOT EXISTS idx_order_items_store ON order_items(store);

-- Update RLS policies to filter by store (Example for products, repeat for others as needed)
-- Note: Existing policies might need adjustment if multi-tenancy is strictly enforced.
-- For now, we just add the column.
