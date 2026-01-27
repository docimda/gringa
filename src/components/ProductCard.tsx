import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!product.inStock) {
      toast.error('Produto fora de estoque');
      return;
    }
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleIncrease = () => {
    if (quantity >= product.stockQuantity) {
      toast.error('Quantidade máxima em estoque');
      return;
    }
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeItem(product.id);
      toast.info(`${product.name} removido do carrinho`);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <Card className={cn(
      'group overflow-hidden transition-all duration-300',
      'hover:shadow-gold hover:border-primary/30',
      !product.inStock && 'opacity-60'
    )}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-sm font-semibold text-destructive">
              Fora de Estoque
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 space-y-2">
        <div className="min-h-[2.5rem]">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            €{product.price.toFixed(2)}
          </span>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-muted"
                onClick={handleDecrease}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-bold w-5 text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-muted"
                onClick={handleIncrease}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="h-8 gap-1 gradient-gold text-primary-foreground shadow-gold"
              onClick={handleAdd}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-3 w-3" />
              <span className="text-xs">Adicionar</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
