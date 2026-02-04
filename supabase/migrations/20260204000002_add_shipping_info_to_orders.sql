ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_neighborhood text,
ADD COLUMN IF NOT EXISTS shipping_cost numeric(10,2) DEFAULT 0.00;
