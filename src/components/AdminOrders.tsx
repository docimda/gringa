
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus, updateOrderComment, deleteOrder } from '@/services/orderService';
import { Order } from '@/types/product';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [comment, setComment] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Status atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ orderId, comment }: { orderId: string; comment: string }) =>
      updateOrderComment(orderId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Comentário salvo com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar comentário');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Pedido excluído com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir pedido');
    },
  });

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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    statusMutation.mutate({ orderId, status: newStatus });
  };

  const handleSaveComment = (orderId: string) => {
    commentMutation.mutate({ orderId, comment });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      deleteMutation.mutate(orderId);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setComment(order.comments || '');
  };

  if (isLoading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Gestão de Pedidos</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customerInfo.responsibleName}</span>
                    <span className="text-xs text-muted-foreground">{order.customerInfo.barbershopName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>€{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue>
                        {getStatusBadge(order.status)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Andamento</SelectItem>
                      <SelectItem value="sent">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">Cliente</h3>
                              <p className="text-sm">Nome: {selectedOrder?.customerInfo.responsibleName}</p>
                              <p className="text-sm">Barbearia: {selectedOrder?.customerInfo.barbershopName}</p>
                              <p className="text-sm">Email: {selectedOrder?.customerInfo.email}</p>
                              <p className="text-sm">Telefone: {selectedOrder?.customerInfo.phone}</p>
                              <p className="text-sm">Endereço: {selectedOrder?.customerInfo.address}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Resumo</h3>
                              <p className="text-sm">Data: {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}</p>
                              <p className="text-sm font-bold mt-2">Total: €{selectedOrder?.total.toFixed(2)}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Itens</h3>
                            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                              {selectedOrder?.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                                  <span>{item.quantity}x {item.product.name}</span>
                                  <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Comentários Internos</h3>
                            <div className="flex gap-2">
                              <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Adicione observações sobre este pedido..."
                                className="min-h-[100px]"
                              />
                            </div>
                            <Button 
                              className="mt-2 w-full" 
                              onClick={() => selectedOrder && handleSaveComment(selectedOrder.id)}
                              disabled={commentMutation.isPending}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Comentário
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
