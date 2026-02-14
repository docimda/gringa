import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, ShoppingBag } from 'lucide-react';
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
import pixIcon from '@/assets/pixicon.png';
import creditCardIcon from '@/assets/creditcardicon.png';
import shopIcon from '@/assets/loja.png';
import truckIcon from '@/assets/caminhao.png';
import { supabase } from '@/lib/supabase';

const DEFAULT_WHATSAPP_NUMBER = '5535991154125';

const formSchema = z.object({
  responsibleName: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  address: z.string().trim().min(5, 'Endereço deve ter pelo menos 5 caracteres').max(200, 'Endereço muito longo'),
  complement: z.string().trim().max(100, 'Complemento muito longo').optional(),
  phone: z.string().trim().min(9, 'Telefone inválido').max(20, 'Telefone muito longo'),
  email: z.string().trim().email('E-mail inválido').max(100, 'E-mail muito longo'),
  orderNotes: z.string().trim().max(500, 'Observação muito longa').optional(),
});

import { createOrder } from '@/services/orderService';

import { PaymentModal } from '@/components/PaymentModal';
import { ChangeModal } from '@/components/ChangeModal';
import { gerarPix } from '@/services/pixService';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, customerInfo, setCustomerInfo, addOrder, shippingRate } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState('');

  const total = getTotal();
  const itemsSubtotal = items.reduce((acc, item) => {
    const hasDiscount = !!(item.product.discount_percentage && item.product.discount_percentage > 0 && (!item.product.discount_expires_at || new Date(item.product.discount_expires_at) > new Date()));
    const price = hasDiscount ? item.product.price * (1 - (item.product.discount_percentage! / 100)) : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handlePayment = () => {
    // Exemplo: Dados da sua empresa
    // IMPORTANTE: Idealmente viria de uma config no banco
    const chavePix = '63813434000120'; // CNPJ sem pontuação
    const nome = 'GRINGA STORE';
    const cidade = 'SAO PAULO';

    const code = gerarPix({
      chave: chavePix,
      nome,
      cidade,
      valor: total,
      txid: `GRINGA${Date.now().toString().slice(-4)}` // Exemplo de ID único curto
    });

    setPixCode(code);
    setIsPaymentModalOpen(true);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleName: customerInfo?.responsibleName || '',
      address: customerInfo?.address || '',
      complement: customerInfo?.complement || '',
      phone: customerInfo?.phone || '',
      email: customerInfo?.email || '',
      orderNotes: customerInfo?.orderNotes || '',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setCustomerInfo(value as CustomerInfo);
    });
    return () => subscription.unsubscribe();
  }, [form, setCustomerInfo]);

  const generateWhatsAppMessage = (data: CustomerInfo, paymentMethod: string, changeInfo?: string) => {
    const itemsList = items
      .map((item) => {
        const hasDiscount = !!(item.product.discount_percentage && item.product.discount_percentage > 0 && (!item.product.discount_expires_at || new Date(item.product.discount_expires_at) > new Date()));
        const price = hasDiscount ? item.product.price * (1 - (item.product.discount_percentage! / 100)) : item.product.price;

        let itemString = `- ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(price * item.quantity).toFixed(2)}`;
        if (hasDiscount) {
          itemString += ` (Desconto de ${item.product.discount_percentage}%)`;
        }
        return itemString;
      })
      .join('\n');

    let paymentText = paymentMethod;
    if (paymentMethod === 'PIX') {
      paymentText += ' (Cliente enviará o comprovante)';
    } else if (changeInfo) {
      paymentText += ` (${changeInfo})`;
    }

    return `Olá, segue meu pedido:

*Nome do responsável:* ${data.responsibleName}
*Endereço:* ${data.address} ${data.complement ? `- ${data.complement}` : ''}
*Telefone:* ${data.phone}
*E-mail:* ${data.email}
${data.orderNotes ? `*Observações:* ${data.orderNotes}\n` : ''}
*Forma de Pagamento:* ${paymentText}
${paymentMethod === 'PIX' ? '\n_O pagamento foi feito via PIX, o cliente precisa enviar o comprovante de pagamento._\n' : ''}
*Itens do pedido:*
${itemsList}

*Frete (${shippingRate?.neighborhood || 'N/A'}):* R$ ${(shippingRate?.price || 0).toFixed(2)}
*Valor total do pedido:* R$ ${total.toFixed(2)}`;
  };

  const handlePaymentMethodClick = (method: string) => {
    form.handleSubmit((data) => {
      setPendingPaymentMethod(method);
      setIsChangeModalOpen(true);
    })();
  };

  const handleConfirmChange = (paymentType: 'card' | 'cash_exact' | 'cash_change', changeAmount?: number) => {
    if (!pendingPaymentMethod) return;

    const isDelivery = pendingPaymentMethod.includes('Entrega');
    const location = isDelivery ? 'na entrega' : 'na loja';
    let whatsappPaymentText = '';

    switch (paymentType) {
      case 'card':
        whatsappPaymentText = `Cliente vai pagar ${location} com cartão`;
        break;
      case 'cash_exact':
        whatsappPaymentText = `Cliente vai pagar ${location} com dinheiro, não precisa de troco`;
        break;
      case 'cash_change':
        if (changeAmount) {
          whatsappPaymentText = `Cliente vai pagar ${location} com dinheiro, precisa de troco para R$ ${changeAmount.toFixed(2)}`;
        } else {
          // Fallback safe state
          whatsappPaymentText = `Cliente vai pagar ${location} com dinheiro`;
        }
        break;
    }

    onSubmit(form.getValues(), whatsappPaymentText);
    setPendingPaymentMethod(null);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>, paymentMethod: string) => {
    setIsSubmitting(true);

    try {
      const customerData: CustomerInfo = {
        responsibleName: data.responsibleName,
        address: data.address,
        complement: data.complement,
        phone: data.phone,
        email: data.email,
        orderNotes: data.orderNotes,
      };

      // Generate WhatsApp URL
      // paymentMethod here is already the full formatted string for non-PIX methods
      // For PIX, it is just 'PIX', so we handle it inside generateWhatsAppMessage
      const message = generateWhatsAppMessage(customerData, paymentMethod);

      // Create order in Supabase
      let createdOrder = null;
      try {
        createdOrder = await createOrder({
          items,
          total,
          customerInfo: customerData,
          whatsappMessage: message, // Pass message to service
          shippingRate: shippingRate || undefined,
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
        shippingRate: shippingRate || undefined,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };
      addOrder(order);

      const { data: storeSettings } = await supabase
        .from('store_settings')
        .select('whatsapp_number')
        .eq('store', 'docimdagringa')
        .single();

      const whatsappNumber = storeSettings?.whatsapp_number || DEFAULT_WHATSAPP_NUMBER;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

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
    <div className="h-screen overflow-y-auto bg-background pb-32">
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
            {items.map((item) => {
              const hasDiscount = !!(item.product.discount_percentage && item.product.discount_percentage > 0 && (!item.product.discount_expires_at || new Date(item.product.discount_expires_at) > new Date()));
              const price = hasDiscount ? item.product.price * (1 - (item.product.discount_percentage! / 100)) : item.product.price;

              return (
                <div key={item.product.id} className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product.name}
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] text-green-600 font-medium">
                        Desconto de {item.product.discount_percentage}% aplicado
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    )}
                    <span className={cn("text-foreground", hasDiscount && "text-green-600 font-medium")}>
                      R$ {(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-border pt-2 mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">R$ {itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete ({shippingRate?.neighborhood || 'N/A'})</span>
                <span className="text-foreground">R$ {(shippingRate?.price || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <div className="mb-2 text-xs text-muted-foreground flex items-center gap-1 pl-1">
          <span>*</span>
          <p>Os dados abaixo ficarão salvos para os próximos pedidos</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4">Seus Dados</h2>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <FormField
                control={form.control}
                name="responsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 91234-5678" {...field} />
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

              <FormField
                control={form.control}
                name="orderNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações do Pedido (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Deixar na portaria, campainha quebrada..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6">
          <Button
            type="button"
            onClick={handlePayment}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white shadow-md text-lg font-semibold flex items-center justify-start px-6 gap-4"
          >
            <img src={pixIcon} alt="PIX" className="h-8 w-8 brightness-0 invert flex-shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span>Fazer Pagamento via</span>
              <span className="text-sm opacity-90 italic font-normal">(PIX)</span>
            </div>
          </Button>

          {shippingRate && (
            <Button
              type="button"
              onClick={() => handlePaymentMethodClick('Entrega')}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white shadow-md text-lg font-semibold flex items-center justify-start px-6 gap-4"
            >
              <img src={truckIcon} alt="Entrega" className="h-8 w-8 brightness-0 invert flex-shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <span>Pagar na Entrega</span>
                <span className="text-sm opacity-90 italic font-normal">(Cartão ou Dinheiro)</span>
              </div>
            </Button>
          )}

          {!shippingRate && (
            <Button
              type="button"
              onClick={() => handlePaymentMethodClick('Loja')}
              className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white shadow-md text-lg font-semibold flex items-center justify-start px-6 gap-4"
            >
              <img src={shopIcon} alt="Loja" className="h-8 w-8 brightness-0 invert flex-shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <span>Buscar e Pagar na Loja</span>
                <span className="text-sm opacity-90 italic font-normal">(Cartão ou Dinheiro)</span>
              </div>
            </Button>
          )}
        </div>
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        pixCode={pixCode}
        total={total}
        onConfirm={() => {
          setIsPaymentModalOpen(false);
          form.handleSubmit((data) => onSubmit(data, 'PIX'))();
        }}
        isSubmitting={isSubmitting}
      />

      <ChangeModal
        isOpen={isChangeModalOpen}
        onClose={() => {
          setIsChangeModalOpen(false);
          setPendingPaymentMethod(null);
        }}
        onConfirm={handleConfirmChange}
        isStorePickup={pendingPaymentMethod === 'Loja'}
      />

      <BottomNav />
    </div>
  );
};

export default CheckoutPage;
