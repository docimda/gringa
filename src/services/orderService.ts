
import { supabase } from '@/lib/supabase';
import { CartItem, CustomerInfo, Order, Product, ShippingRate } from '@/types/product';

export interface CreateOrderParams {
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  whatsappMessage?: string;
  shippingRate?: ShippingRate;
}

export const createOrder = async ({ items, total, customerInfo, whatsappMessage, shippingRate }: CreateOrderParams) => {
  try {
    // 1. Insert Order Header
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerInfo.responsibleName,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_email: customerInfo.email,
        barbershop_name: customerInfo.barbershopName,
        total_amount: total,
        status: 'pending',
        whatsapp_message: whatsappMessage || '',
        shipping_city: shippingRate?.city || null,
        shipping_neighborhood: shippingRate?.neighborhood || null,
        shipping_cost: shippingRate?.price || 0,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Detalhes do erro ao criar pedido (header):', {
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code
      });
      throw orderError;
    }

    if (!orderData) throw new Error('Falha ao criar pedido: Retorno vazio do banco');

    // 2. Insert Order Items
    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      subtotal: item.product.price * item.quantity,
      order_total_amount: total,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Detalhes do erro ao criar itens do pedido:', {
        message: itemsError.message,
        details: itemsError.details,
        hint: itemsError.hint,
        code: itemsError.code
      });
      throw itemsError;
    }

    return orderData;
  } catch (error) {
    console.error('Erro geral ao criar pedido no Supabase:', error);
    throw error;
  }
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          *
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform Supabase response to Order type
  return data.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    items: order.order_items.map((item: any) => ({
      product: item.products as Product,
      quantity: item.quantity,
    })),
    total: order.total_amount,
    customerInfo: {
      responsibleName: order.customer_name,
      barbershopName: order.barbershop_name || '',
      address: order.customer_address,
      phone: order.customer_phone,
      email: order.customer_email || '',
    },
    shippingRate: order.shipping_city ? {
      id: 'stored-rate',
      store_name: '',
      state: 'SP',
      city: order.shipping_city,
      neighborhood: order.shipping_neighborhood || '',
      price: Number(order.shipping_cost || 0),
    } : undefined,
    createdAt: order.created_at,
    status: order.status,
    comments: order.comments,
    external_comments: order.external_comments,
  })) as Order[];
};

export const getOrdersByIds = async (ids: string[]) => {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          *
        )
      )
    `)
    .in('id', ids)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pedidos por IDs:', error);
    return [];
  }

  // Transform Supabase response to Order type
  return data.map((order: any) => ({
    id: order.id,
    items: order.order_items.map((item: any) => ({
      product: item.products as Product,
      quantity: item.quantity,
    })),
    total: order.total_amount,
    orderNumber: order.order_number,
    customerInfo: {
      responsibleName: order.customer_name,
      barbershopName: order.barbershop_name || '',
      address: order.customer_address,
      phone: order.customer_phone,
      email: order.customer_email || '',
    },
    shippingRate: order.shipping_city ? {
      id: 'stored-rate',
      store_name: '',
      state: 'SP',
      city: order.shipping_city,
      neighborhood: order.shipping_neighborhood || '',
      price: Number(order.shipping_cost || 0),
    } : undefined,
    createdAt: order.created_at,
    status: order.status,
    comments: order.comments,
    external_comments: order.external_comments,
  })) as Order[];
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Erro ao atualizar status do pedido:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      statusAttempted: status
    });
    throw error;
  }
};

export const updateOrderComment = async (orderId: string, comments: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ comments })
    .eq('id', orderId);

  if (error) throw error;
};

export const updateOrderExternalComment = async (orderId: string, external_comments: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ external_comments })
    .eq('id', orderId);

  if (error) throw error;
};

export const deleteOrder = async (orderId: string) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) throw error;
};
