-- Create shipping_rates table
CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_name TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.shipping_rates
    FOR SELECT USING (true);

-- Seed data
INSERT INTO public.shipping_rates (store_name, state, city, neighborhood, price) VALUES
('docimdagringa', 'MG', 'Extrema', 'Agenor', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Bela vista', 7.00),
('docimdagringa', 'MG', 'Extrema', 'Cachoeira 1', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Cachoeira 2', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Cachoeira 3', 9.00),
('docimdagringa', 'MG', 'Extrema', 'Campos olivotti', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Centro', 6.00),
('docimdagringa', 'MG', 'Extrema', 'Condomínio vista da Mantiqueira', 13.00),
('docimdagringa', 'MG', 'Extrema', 'Fisgao', 13.00),
('docimdagringa', 'MG', 'Extrema', 'Itamaraty', 15.00),
('docimdagringa', 'MG', 'Extrema', 'Jardim europa', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Juruoca', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Manacás', 9.00),
('docimdagringa', 'MG', 'Extrema', 'Mantiqueira', 20.00),
('docimdagringa', 'MG', 'Extrema', 'Morbidelli', 8.00),
('docimdagringa', 'MG', 'Extrema', 'Parque dos pássaros', 9.00),
('docimdagringa', 'MG', 'Extrema', 'Ponte alta', 9.00),
('docimdagringa', 'MG', 'Extrema', 'Ponte nova', 2.00),
('docimdagringa', 'MG', 'Extrema', 'Portal', 10.00),
('docimdagringa', 'MG', 'Extrema', 'Praça do japao', 8.00),
('docimdagringa', 'MG', 'Extrema', 'São cristovao', 7.00),
('docimdagringa', 'MG', 'Extrema', 'Vila esperança', 9.00),
('docimdagringa', 'MG', 'Extrema', 'Vila Garden', 9.00),
('docimdagringa', 'MG', 'Extrema', 'Vila rica', 8.00);
