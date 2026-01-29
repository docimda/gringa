
-- Adicionar coluna SKU na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Recarregar o cache do schema
NOTIFY pgrst, 'reload schema';
