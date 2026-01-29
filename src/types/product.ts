
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  image_url_2?: string;
  image_url_3?: string;
  description?: string;
  active: boolean;
  stock: number;
  sku?: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber?: number;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  createdAt: string;
  status: 'pending' | 'processing' | 'sent' | 'delivered' | 'cancelled';
  comments?: string;
  external_comments?: string;
}

export interface CustomerInfo {
  responsibleName: string;
  barbershopName: string;
  address: string;
  phone: string;
  email: string;
}

export type ProductCategory = 
  | 'gels-pomadas'
  | 'maquinas'
  | 'laminas'
  | 'tesouras'
  | 'capas'
  | 'higiene'
  | 'acessorios';

export const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'gels-pomadas', label: 'Géis e Pomadas' },
  { id: 'maquinas', label: 'Máquinas de Corte' },
  { id: 'laminas', label: 'Lâminas' },
  { id: 'tesouras', label: 'Tesouras' },
  { id: 'capas', label: 'Capas' },
  { id: 'higiene', label: 'Produtos de Higiene' },
  { id: 'acessorios', label: 'Acessórios' },
];
