
import { useState } from 'react';
import { Lock, Package, Settings, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { AdminOrders } from '@/components/AdminOrders';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Erro ao fazer login: ' + error.message);
    } else {
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        
        <main className="container px-4 py-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Área Administrativa
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Acesso restrito para administradores
            </p>

            <Card className="w-full max-w-sm p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@exemplo.com"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Senha
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-gold text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Card>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="container px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }}
          >
            Sair
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </Button>
          <Button 
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
          >
            Produtos
          </Button>
        </div>

        {activeTab === 'orders' && <AdminOrders />}

        {activeTab === 'dashboard' && (
          <div className="grid gap-4">
            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('products')}>
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Produtos</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Gerencie o catálogo de produtos, preços e estoque.
              </p>
            </Card>

            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('orders')}>
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Pedidos</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie pedidos recebidos.
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Configurações</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Configure informações da loja e integrações.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Em breve
              </Button>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
           <div className="text-center py-12">
             <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <h3 className="text-lg font-medium">Gestão de Produtos</h3>
             <p className="text-muted-foreground">Em desenvolvimento...</p>
           </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminPage;
