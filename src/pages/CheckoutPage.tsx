import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { CustomerInfo, Order } from '@/types/product';

const WHATSAPP_NUMBER = '5511947197497';

const formSchema = z.object({
  responsibleName: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  barbershopName: z.string().trim().min(2, 'Nome da barbearia deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  address: z.string().trim().min(5, 'Endereço deve ter pelo menos 5 caracteres').max(200, 'Endereço muito longo'),
  phone: z.string().trim().min(9, 'Telefone inválido').max(20, 'Telefone muito longo'),
  email: z.string().trim().email('E-mail inválido').max(100, 'E-mail muito longo'),
});

import { createOrder } from '@/services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, customerInfo, setCustomerInfo, addOrder } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = getTotal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleName: customerInfo?.responsibleName || '',
      barbershopName: customerInfo?.barbershopName || '',
      address: customerInfo?.address || '',
      phone: customerInfo?.phone || '',
      email: customerInfo?.email || '',
    },
  });

  const generateWhatsAppMessage = (data: CustomerInfo) => {
    const itemsList = items
      .map((item) => `- ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(item.product.price * item.quantity).toFixed(2)}`)
      .join('\n');

    return `Olá, segue pedido de reabastecimento da barbearia:

*Responsável:* ${data.responsibleName}
*Barbearia:* ${data.barbershopName}
*Endereço:* ${data.address}
*Telefone:* ${data.phone}
*E-mail:* ${data.email}

*Itens do pedido:*
${itemsList}

*Valor total do pedido:* R$ ${total.toFixed(2)}`;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const customerData: CustomerInfo = {
        responsibleName: data.responsibleName,
        barbershopName: data.barbershopName,
        address: data.address,
        phone: data.phone,
        email: data.email,
      };

      // Generate WhatsApp URL
      const message = generateWhatsAppMessage(customerData);
      
      // Create order in Supabase
      let createdOrder = null;
      try {
        createdOrder = await createOrder({
          items,
          total,
          customerInfo: customerData,
          whatsappMessage: message, // Pass message to service
        });
      } catch (dbError) {
        console.error('Erro ao salvar pedido no banco:', dbError);
        // Não bloqueamos o fluxo se o banco falhar, pois o principal é o WhatsApp
        // Mas idealmente deveríamos avisar ou tentar novamente.
        // Vamos apenas logar por enquanto para não impedir a venda.
        toast.error('Aviso: Pedido gerado, mas houve um erro ao salvar histórico.');
      }

      // Create local order record (legacy/cache)
      // Use the ID from Supabase if available, otherwise fallback to timestamp
      const orderId = createdOrder?.id || Date.now().toString();
      
      const order: Order = {
        id: orderId,
        orderNumber: createdOrder?.order_number, // Store the friendly ID
        items: [...items],
        total,
        customerInfo: customerData,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };
      addOrder(order);

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Clear cart and redirect
      clearCart();
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      toast.success('Pedido enviado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      toast.error('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main className="container px-4 py-4">
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Finalizar Pedido</h1>

        {/* Order Summary */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <h2 className="font-semibold text-foreground mb-3">Resumo do Pedido</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-foreground">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4">Dados da Barbearia</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="responsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barbershopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Barbearia</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sua barbearia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="+353 XX XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 gradient-gold text-primary-foreground shadow-gold text-lg font-semibold mt-6"
                disabled={isSubmitting}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Enviar Pedido via WhatsApp
              </Button>
            </form>
          </Form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CheckoutPage;
