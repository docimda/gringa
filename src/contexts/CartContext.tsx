import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CustomerInfo, Order, ShippingRate } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  syncLocalOrders: (validOrders: Order[]) => void;
  getLastOrder: () => Order | null;
  repeatLastOrder: (currentProducts: Product[]) => Promise<boolean>;
  shippingRate: ShippingRate | null;
  setShippingRate: (rate: ShippingRate | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'trezentos_cart';
const CUSTOMER_STORAGE_KEY = 'trezentos_customer';
const ORDERS_STORAGE_KEY = 'trezentos_orders';
const SHIPPING_STORAGE_KEY = 'trezentos_shipping';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [customerInfo, setCustomerInfoState] = useState<CustomerInfo | null>(() => {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(() => {
    const stored = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (customerInfo) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerInfo));
    }
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (shippingRate) {
      localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(shippingRate));
    } else {
      localStorage.removeItem(SHIPPING_STORAGE_KEY);
    }
  }, [shippingRate]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setShippingRate(null);
  };

  const getTotal = () => {
    const itemsTotal = items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    return itemsTotal + (shippingRate?.price || 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const setCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfoState(info);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const removeOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const syncLocalOrders = (validOrders: Order[]) => {
    // Apenas atualiza se houver diferença para evitar re-renderizações desnecessárias
    if (JSON.stringify(validOrders) !== JSON.stringify(orders)) {
      console.log('Sincronizando cache de pedidos com o banco de dados. Pedidos anteriores:', orders.length, 'Pedidos atuais:', validOrders.length);
      setOrders(validOrders);
    }
  };

  const getLastOrder = () => {
    return orders.length > 0 ? orders[0] : null;
  };

  const repeatLastOrder = async (currentProducts: Product[]) => {
    const lastOrder = getLastOrder();
    if (lastOrder) {
      // Filtrar apenas itens que ainda estão ativos e existem na lista atual de produtos
      const activeItems = lastOrder.items.filter(item => {
        const currentProduct = currentProducts.find(p => p.id === item.product.id);
        return currentProduct && currentProduct.active;
      }).map(item => {
        // Atualizar informações do produto com os dados mais recentes (preço, nome, etc)
        const currentProduct = currentProducts.find(p => p.id === item.product.id)!;
        return {
          ...item,
          product: currentProduct
        };
      });

      if (activeItems.length === 0) {
        return false; // Nenhum item pôde ser adicionado
      }

      setItems(activeItems);
      return true; // Sucesso (pelo menos um item adicionado)
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        customerInfo,
        setCustomerInfo,
        orders,
        addOrder,
        removeOrder,
        syncLocalOrders,
        getLastOrder,
        repeatLastOrder,
        shippingRate,
        setShippingRate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
