
-- 1. Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    barbershop_name TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'delivered', 'cancelled')),
    comments TEXT,
    whatsapp_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS (Segurança)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acesso

-- Produtos: Qualquer um pode ler, apenas autenticados (admin) podem editar
-- Drop policy if exists to avoid error on re-run
DROP POLICY IF EXISTS "Produtos públicos para leitura" ON products;
CREATE POLICY "Produtos públicos para leitura" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gerencia produtos" ON products;
CREATE POLICY "Admin gerencia produtos" ON products FOR ALL TO authenticated USING (true);

-- Pedidos: Qualquer um (cliente) pode criar, apenas autenticados (admin) podem ver tudo/editar
DROP POLICY IF EXISTS "Clientes podem criar pedidos" ON orders;
CREATE POLICY "Clientes podem criar pedidos" ON orders FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admin gerencia pedidos" ON orders;
CREATE POLICY "Admin gerencia pedidos" ON orders FOR ALL TO authenticated USING (true);

-- Itens: Qualquer um pode criar (se tiver criando pedido), admin gerencia
DROP POLICY IF EXISTS "Clientes podem criar itens" ON order_items;
CREATE POLICY "Clientes podem criar itens" ON order_items FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admin gerencia itens" ON order_items;
CREATE POLICY "Admin gerencia itens" ON order_items FOR ALL TO authenticated USING (true);
