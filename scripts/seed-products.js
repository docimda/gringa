
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const products = [
  {
    name: 'Pomada Modeladora Premium',
    category: 'gels-pomadas',
    price: 24.90,
    image_url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80',
    description: 'Pomada de alta fixação com acabamento matte',
    active: true,
    stock: 50,
  },
  {
    name: 'Gel Fixador Extra Forte',
    category: 'gels-pomadas',
    price: 18.90,
    image_url: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=400&q=80',
    description: 'Gel com fixação duradoura',
    active: true,
    stock: 35,
  },
  {
    name: 'Máquina de Corte Pro',
    category: 'maquinas',
    price: 289.90,
    image_url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&q=80',
    description: 'Máquina profissional com lâminas de aço',
    active: true,
    stock: 12,
  },
  {
    name: 'Máquina Acabamento Precision',
    category: 'maquinas',
    price: 199.90,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
    description: 'Perfeita para contornos e acabamentos',
    active: true,
    stock: 8,
  },
  {
    name: 'Lâminas Descartáveis (50un)',
    category: 'laminas',
    price: 32.90,
    image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80',
    description: 'Pacote com 50 lâminas de aço inox',
    active: true,
    stock: 100,
  },
  {
    name: 'Navalha Profissional',
    category: 'laminas',
    price: 45.90,
    image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80',
    description: 'Navalha com cabo ergonômico',
    active: true,
    stock: 25,
  },
  {
    name: 'Tesoura Fio Laser 6"',
    category: 'tesouras',
    price: 159.90,
    image_url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=400&q=80',
    description: 'Tesoura profissional com fio permanente',
    active: true,
    stock: 15,
  },
  {
    name: 'Tesoura Desbaste 5.5"',
    category: 'tesouras',
    price: 129.90,
    image_url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=80',
    description: 'Ideal para texturização',
    active: false,
    stock: 0,
  },
  {
    name: 'Capa Corte Premium',
    category: 'capas',
    price: 49.90,
    image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80',
    description: 'Capa impermeável com fechamento ajustável',
    active: true,
    stock: 40,
  },
  {
    name: 'Shampoo Barba e Cabelo',
    category: 'higiene',
    price: 34.90,
    image_url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
    description: '2 em 1 para barba e cabelo',
    active: true,
    stock: 60,
  },
  {
    name: 'Óleo para Barba',
    category: 'higiene',
    price: 42.90,
    image_url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&q=80',
    description: 'Hidratação e brilho natural',
    active: true,
    stock: 45,
  },
  {
    name: 'Pente de Madeira Antiestático',
    category: 'acessorios',
    price: 19.90,
    image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=80',
    description: 'Pente artesanal de madeira',
    active: true,
    stock: 30,
  },
];

async function seed() {
  console.log('Seeding products...');
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select();
  
  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log(`Successfully seeded ${data.length} products.`);
  }
}

seed();
