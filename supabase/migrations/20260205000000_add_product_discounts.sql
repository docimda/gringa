-- Add discount fields to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_expires_at TIMESTAMPTZ;

-- Add discount tracking to order items (to record the discount at time of purchase)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 0;

-- Add total discount tracking to orders (to record total savings)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS total_discount NUMERIC DEFAULT 0;
