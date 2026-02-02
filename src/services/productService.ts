
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store', 'docimdagringa')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateCategoryName = async (oldName: string, newName: string) => {
  const { error } = await supabase
    .from('products')
    .update({ category: newName })
    .eq('category', oldName);

  if (error) throw error;
};
