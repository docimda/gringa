
-- Adicionar coluna de ID sequencial para exibição amigável
ALTER TABLE orders ADD COLUMN IF NOT EXISTS display_id SERIAL;

-- Recarregar o cache do schema
NOTIFY pgrst, 'reload schema';
