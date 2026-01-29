import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Package, Trash2, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import { getOrdersByIds } from '@/services/orderService';
import { Order } from '@/types/product';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';

const OrdersPage = () => {
  const { orders: localOrders, removeOrder, addOrder } = useCart();
  const [syncedOrders, setSyncedOrders] = useState<Order[]>(localOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Sincronizar pedidos com o backend
  useEffect(() => {
    const syncOrders = async () => {
      if (localOrders.length === 0) return;

      const orderIds = localOrders.map(o => o.id);
      try {
        const updatedOrders = await getOrdersByIds(orderIds);
        
        // Se encontrou pedidos no banco, mescla com os locais
        if (updatedOrders.length > 0) {
          // Cria um mapa para acesso rápido
          const updatedMap = new Map(updatedOrders.map(o => [o.id, o]));
          
          const newOrdersList = localOrders.map(local => {
            const remote = updatedMap.get(local.id);
            if (remote) {
              // Atualiza status e comentários, mantém o resto
              return {
                ...local,
                status: remote.status,
                external_comments: remote.external_comments,
                // Garantir que outros campos críticos também estejam atualizados se necessário
              };
            }
            return local;
          });

          setSyncedOrders(newOrdersList);
        }
      } catch (error) {
        console.error("Erro ao sincronizar pedidos:", error);
      }
    };

    syncOrders();
    
    // Configurar polling simples para manter atualizado (a cada 30s)
    const interval = setInterval(syncOrders, 30000);
    return () => clearInterval(interval);
  }, [localOrders]);

  const confirmRemoveOrder = () => {
    if (orderToDelete) {
      removeOrder(orderToDelete);
      toast.success('Pedido removido do histórico.');
      setOrderToDelete(null);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 text-white">Andamento</Badge>;
      case 'sent':
        return <Badge className="bg-primary text-primary-foreground">Enviado</Badge>;
      case 'delivered':
        return <Badge className="bg-green-600 text-white">Entregue</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

        {syncedOrders.length === 0 ? (
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
            {syncedOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">
                      Pedido #{order.orderNumber ? order.orderNumber : order.id.slice(0, 8)}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => setOrderToDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={false} // Cliente não é admin
      />

      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este pedido do histórico local? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
