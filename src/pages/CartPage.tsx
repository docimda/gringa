import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, MessageCircle, Pencil, Truck, ShoppingCart } from 'lucide-react';
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

import { ShippingSelectionModal } from '@/components/ShippingSelectionModal';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, shippingRate, setShippingRate } = useCart();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const total = getTotal();
  const itemsSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

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
            <ShoppingCart className="h-6 w-6 text-primary" />
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
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                  R$ {itemsSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Entrega</span>
                  <Button
                    variant="link"
                    className={`h-auto p-0 font-normal text-right flex items-center gap-1 ${shippingRate
                      ? 'px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors'
                      : 'text-primary'
                      }`}
                    onClick={() => setIsShippingModalOpen(true)}
                  >
                    {shippingRate
                      ? `${shippingRate.neighborhood} - R$ ${shippingRate.price.toFixed(2)}`
                      : "Selecionar Local de Entrega"}
                  </Button>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Cupom de Desconto</span>
                  <span className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                    Em Breve ...
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1">
                    Em breve mais pontos de entrega! <Truck className="h-3.5 w-3.5" />
                  </p>
                  <p>
                    <a
                      href="https://wa.me/5511947197497?text=Olá%2C%20gostaria%20de%20ver%20a%20possibilidade%20de%20um%20novo%20ponto%20de%20entrega."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline transition-colors"
                    >
                      Entre em contato para ver a possibilidade de um novo local de entrega.
                    </a>
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-xl text-primary">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-14 gradient-gold text-primary-foreground shadow-gold text-lg font-semibold mt-6"
              onClick={() => {
                if (!shippingRate) {
                  toast.error('Por favor selecione um local de entrega!');
                  return;
                }
                navigate('/checkout');
              }}
            >
              Finalizar Pedido
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
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

      <ShippingSelectionModal
        open={isShippingModalOpen}
        onOpenChange={setIsShippingModalOpen}
        onSelectRate={setShippingRate}
        currentRate={shippingRate}
      />
    </div>
  );
};

export default CartPage;
