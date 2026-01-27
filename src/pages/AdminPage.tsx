import { useState } from 'react';
import { Lock, Package, Settings } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Simple admin placeholder - in production this would use proper auth
const ADMIN_PASSWORD = 'trezentos2024';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Senha incorreta');
    }
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
                    Senha de Acesso
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    className="bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-gold text-primary-foreground"
                >
                  Entrar
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
            onClick={() => setIsAuthenticated(false)}
          >
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
          Para funcionalidades completas de administração,<br />
          ative a integração com banco de dados.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminPage;
