import { ClipboardList, Calendar, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { orders } = useCart();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'sent':
        return <Badge className="bg-primary text-primary-foreground">Enviado</Badge>;
      case 'completed':
        return <Badge className="bg-accent text-accent-foreground border border-primary">Concluído</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="container px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground mb-6">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Nenhum pedido ainda
            </h2>
            <p className="text-muted-foreground text-center">
              Seus pedidos aparecerão aqui após enviar via WhatsApp
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Pedido #{order.id.slice(-6)}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.product.id} className="flex items-center gap-2 text-sm">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      + {order.items.length - 3} outros itens
                    </span>
                  )}
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {order.customerInfo.barbershopName}
                  </span>
                  <span className="font-bold text-primary">
                    €{order.total.toFixed(2)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
