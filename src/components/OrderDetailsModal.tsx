
import { useState, useEffect } from 'react';
import { Order } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onSaveInternalComment?: (orderId: string, comment: string) => void;
  onSaveExternalComment?: (orderId: string, comment: string) => void;
  isSaving?: boolean;
}

export const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
  isAdmin = false,
  onSaveInternalComment,
  onSaveExternalComment,
  isSaving = false,
}: OrderDetailsModalProps) => {
  const [internalComment, setInternalComment] = useState('');
  const [externalComment, setExternalComment] = useState('');

  useEffect(() => {
    if (order) {
      setInternalComment(order.comments || '');
      setExternalComment(order.external_comments || '');
    }
  }, [order]);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Pedido #{order.orderNumber ? order.orderNumber : order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Cliente</h3>
              <p className="text-sm">Nome: {order.customerInfo.responsibleName}</p>
              <p className="text-sm">Barbearia: {order.customerInfo.barbershopName}</p>
              <p className="text-sm">Email: {order.customerInfo.email}</p>
              <p className="text-sm">Telefone: {order.customerInfo.phone}</p>
              <p className="text-sm">Endereço: {order.customerInfo.address}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resumo</h3>
              <p className="text-sm">Data: {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
              <p className="text-sm font-bold mt-2">Total: R$ {order.total.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Itens</h3>
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comentários para o cliente */}
          <div>
            <h3 className="font-semibold mb-2">Comentários para o cliente</h3>
            <div className="flex gap-2">
              <Textarea
                value={externalComment}
                onChange={(e) => setExternalComment(e.target.value)}
                placeholder={isAdmin ? "Escreva uma mensagem para o cliente..." : "Nenhum comentário do administrador."}
                className="min-h-[80px]"
                disabled={!isAdmin}
                readOnly={!isAdmin}
              />
            </div>
            {isAdmin && onSaveExternalComment && (
              <Button 
                className="mt-2 w-full" 
                onClick={() => onSaveExternalComment(order.id, externalComment)}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Comentário Cliente
              </Button>
            )}
          </div>

          {/* Comentários internos (Apenas Admin) */}
          {isAdmin && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                Comentários internos
              </h3>
              <div className="flex gap-2">
                <Textarea
                  value={internalComment}
                  onChange={(e) => setInternalComment(e.target.value)}
                  placeholder="Adicione observações internas sobre este pedido..."
                  className="min-h-[80px]"
                />
              </div>
              {onSaveInternalComment && (
                <Button 
                  variant="secondary"
                  className="mt-2 w-full" 
                  onClick={() => onSaveInternalComment(order.id, internalComment)}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Comentário Interno
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
