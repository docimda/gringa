import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-3 p-3 bg-card rounded-xl border border-border">
      <img
        src={product.image_url}
        alt={product.name}
        className="h-20 w-20 rounded-lg object-cover bg-muted"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          €{product.price.toFixed(2)} cada
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-muted"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-bold w-5 text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-muted"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">
              €{subtotal.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={() => removeItem(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
