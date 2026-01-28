
-- Garantir que Admin pode excluir pedidos e itens
DROP POLICY IF EXISTS "Admin gerencia pedidos" ON orders;
CREATE POLICY "Admin gerencia pedidos" ON orders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin gerencia itens" ON order_items;
CREATE POLICY "Admin gerencia itens" ON order_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Nota: Como o Admin (authenticated) tem acesso ALL (que inclui DELETE), isso já deve funcionar.
-- Mas garantimos com este script que a política cobre todas as operações.
