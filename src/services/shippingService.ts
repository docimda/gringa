import { supabase } from '@/lib/supabase';
import { ShippingRate } from '@/types/product';

export const getShippingRates = async () => {
  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .order('city')
    .order('neighborhood');

  if (error) {
    console.error('Erro ao buscar taxas de frete:', error);
    throw error;
  }

  return data as ShippingRate[];
};

export const createShippingRate = async (rate: Omit<ShippingRate, 'id'>) => {
  const { data, error } = await supabase
    .from('shipping_rates')
    .insert(rate)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar taxa de frete:', error);
    throw error;
  }

  return data as ShippingRate;
};

export const updateShippingRate = async (id: string, updates: Partial<ShippingRate>) => {
  const { data, error } = await supabase
    .from('shipping_rates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar taxa de frete:', error);
    throw error;
  }

  return data as ShippingRate;
};

export const deleteShippingRate = async (id: string) => {
  const { error } = await supabase
    .from('shipping_rates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir taxa de frete:', error);
    throw error;
  }
};
