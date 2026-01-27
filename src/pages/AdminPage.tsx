
import { useState, useEffect } from 'react';
import { Lock, Package, Settings, LogOut } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Erro ao fazer login: ' + error.message);
      } else {
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao sair');
    }
  };

  if (!session) {
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
                    required
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
                    placeholder="Digite a senha"
                    className="bg-background"
                    required
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
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Produtos</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie o catálogo de produtos, preços e estoque.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Em breve
            </Button>
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

        <p className="text-center text-sm text-muted-foreground mt-8">
          Você está logado como: <br/>
          <span className="font-medium text-foreground">{session.user.email}</span>
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminPage;
