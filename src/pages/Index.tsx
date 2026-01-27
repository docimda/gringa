import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getLastOrder, repeatLastOrder } = useCart();
  
  const lastOrder = getLastOrder();

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRepeatOrder = () => {
    repeatLastOrder();
    toast.success('Último pedido adicionado ao carrinho!');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main className="container px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Quick Actions */}
        {lastOrder && (
          <Button
            variant="outline"
            className="w-full mb-4 h-12 border-primary/30 hover:bg-primary/10"
            onClick={handleRepeatOrder}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Repetir último pedido
          </Button>
        )}

        {/* Categories */}
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum produto encontrado
            </p>
          </div>
        )}
      </main>

      <FloatingCartButton />
      <BottomNav />
    </div>
  );
};

export default Index;
