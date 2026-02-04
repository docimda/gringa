-- Permitir que usuários autenticados (admin) gerenciem as taxas de frete
CREATE POLICY "Admin pode gerenciar taxas de frete" ON public.shipping_rates
    FOR ALL
    TO authenticated
    USING (true);
