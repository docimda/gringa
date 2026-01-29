import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/components/CartItem';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CartPage = () => {
  const { items, getTotal, clearCart } = useCart();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const total = getTotal();

  const handleClearCart = () => {
    clearCart();
    setIsClearDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main className="container px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Carrinho</h1>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => setIsClearDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Carrinho vazio
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Adicione produtos para fazer seu pedido
            </p>
            <Link to="/">
              <Button className="gradient-gold text-primary-foreground shadow-gold">
                Ver Produtos
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entrega</span>
                <span className="text-primary">A combinar</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-xl text-primary">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="block mt-6">
              <Button className="w-full h-14 gradient-gold text-primary-foreground shadow-gold text-lg font-semibold">
                Finalizar Pedido
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </>
        )}
      </main>

      <BottomNav />
      
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Carrinho</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja remover todos os itens do carrinho? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCart} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar Limpeza
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CartPage;
