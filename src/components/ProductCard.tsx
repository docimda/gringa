
import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!product.active) {
      toast.error('Produto fora de estoque');
      return;
    }
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleIncrease = () => {
    if (quantity >= product.stock) {
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
    <>
      <Card className={cn(
        'group overflow-hidden transition-all duration-300',
        'hover:shadow-gold hover:border-primary/30',
        !product.active && 'opacity-60'
      )}>
        <div 
          className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.active && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-semibold text-destructive">
                Fora de Estoque
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 space-y-2 flex flex-col h-full">
          <div>
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-2 mt-auto pt-2">
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              €{product.price.toFixed(2)}
            </span>
            
            {quantity > 0 ? (
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
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
                className="h-8 px-3 gap-1 gradient-gold text-primary-foreground shadow-gold flex-shrink-0"
                onClick={handleAdd}
                disabled={!product.active}
              >
                <ShoppingCart className="h-3 w-3" />
                <span className="text-xs hidden xs:inline">Adicionar</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  €{product.price.toFixed(2)}
                </span>
                {product.sku && (
                  <span className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
              {product.description && (
                <div className="bg-muted/30 p-3 rounded-md">
                  <h4 className="text-sm font-semibold mb-1">Descrição</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
            <div className="pt-2">
              {quantity > 0 ? (
                <div className="flex justify-center items-center gap-4 bg-secondary/50 rounded-xl p-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleDecrease}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleIncrease}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full h-12 text-lg gradient-gold text-primary-foreground shadow-gold"
                  onClick={() => {
                    handleAdd();
                    setIsImageModalOpen(false);
                  }}
                  disabled={!product.active}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
