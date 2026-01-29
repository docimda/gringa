
-- Renomear coluna display_id para order_number
ALTER TABLE orders RENAME COLUMN display_id TO order_number;

-- Recarregar o cache do schema
NOTIFY pgrst, 'reload schema';
