-- Limpar todos os pedidos e itens de pedido
TRUNCATE TABLE orders CASCADE;

-- Reiniciar a sequência de numeração de pedidos (order_number)
-- O false indica que o próximo valor será 1
SELECT setval(pg_get_serial_sequence('orders', 'order_number'), 1, false);
