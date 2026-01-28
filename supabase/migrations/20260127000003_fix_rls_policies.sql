
-- Garantir que a Role Anon pode criar pedidos
DO $$
BEGIN
  -- Se a política já existir, dropamos para recriar garantindo a correção
  DROP POLICY IF EXISTS "Clientes podem criar pedidos" ON orders;
  DROP POLICY IF EXISTS "Clientes podem criar itens" ON order_items;
END $$;

-- Política para orders: Permitir INSERT para 'anon' e 'authenticated' (caso o user logue no futuro)
CREATE POLICY "Clientes podem criar pedidos" ON orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política para order_items: Permitir INSERT para 'anon' e 'authenticated'
CREATE POLICY "Clientes podem criar itens" ON order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Garantir que as tabelas têm RLS ativado
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
