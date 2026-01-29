
-- Adicionar coluna de comentários externos na tabela orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_comments TEXT;

-- Recarregar o cache do schema
NOTIFY pgrst, 'reload schema';
