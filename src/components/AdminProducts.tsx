
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { Product } from '@/types/product';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelectionModal } from './CategorySelectionModal';

export const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Product> & { stockInput: string; priceInput: string }>({
    name: '',
    description: '',
    price: 0,
    priceInput: '0',
    sku: '',
    stock: 0,
    stockInput: '0',
    category: '',
    image_url: '',
    image_url_2: '',
    image_url_3: '',
    active: true,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getProducts,
  });

  // Obter lista única de categorias existentes
  const availableCategories = useMemo(() => {
    if (!products) return [];
    
    // Apenas categorias que realmente têm produtos
    const productCategories = new Set(products.map(p => p.category));
    
    // Converter para array e ordenar
    return Array.from(productCategories).sort();
  }, [products]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produto criado com sucesso');
      closeModal();
    },
    onError: (error: any) => {
      toast.error('Erro ao criar produto: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produto atualizado com sucesso');
      closeModal();
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar produto: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produto excluído com sucesso');
      setProductToDelete(null);
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir produto: ' + error.message);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateProduct(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Status atualizado');
    },
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      store: 'docimdagringa',
      description: '',   price: 0,
      priceInput: '',
      sku: '',
      stock: 0,
      stockInput: '',
      category: '',
      image_url: '',
      image_url_2: '',
      image_url_3: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      store: product.store || '',
      description: product.description || '',
      price: product.price,
      priceInput: product.price.toString(),
      sku: product.sku || '',
      stock: product.stock,
      stockInput: product.stock.toString(),
      category: product.category,
      image_url: product.image_url,
      image_url_2: product.image_url_2 || '',
      image_url_3: product.image_url_3 || '',
      active: product.active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.price || !formData.category || !formData.image_url) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    // Prepare payload by removing helper fields
    const { priceInput, stockInput, ...payload } = formData;

    // Convert empty SKU to null to avoid unique constraint violation
    if (payload.sku === '') {
      payload.sku = null as any; // Cast to any to allow null if type is strict string
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload as Omit<Product, 'id' | 'created_at'>);
    }
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Carregando produtos...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openCreateModal} className="gradient-gold text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Nome / SKU</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    {product.sku && <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Switch
                    checked={product.active}
                    onCheckedChange={(checked) => toggleStatusMutation.mutate({ id: product.id, active: checked })}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setProductToDelete(product.id)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Pomada Modeladora"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store">Loja *</Label>
                <Input
                  id="store"
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  placeholder="Nome da Loja"
                  required
                  disabled
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Código)</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ex: POM-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <div 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-accent/50 items-center justify-between"
                  onClick={() => setIsCategoryModalOpen(true)}
                >
                  <span className={formData.category ? '' : 'text-muted-foreground'}>
                    {formData.category || "Selecione uma categoria"}
                  </span>
                  <Pencil className="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stockInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ 
                      ...formData, 
                      stockInput: value,
                      stock: value === '' ? 0 : parseInt(value) || 0 
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ 
                    ...formData, 
                    priceInput: value,
                    price: value === '' ? 0 : parseFloat(value) || 0 
                  });
                }}
                required
              />
            </div>

            <div className="space-y-4">
              {/* Imagem Principal */}
              <div className="space-y-2">
                <Label htmlFor="image_url">URL - Imagem Principal *</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://exemplo.com/imagem-principal.jpg"
                      required
                    />
                  </div>
                  {formData.image_url && (
                    <div className="h-16 w-16 rounded border bg-muted flex-shrink-0 overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Preview Principal" 
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Imagem 2 */}
              <div className="space-y-2">
                <Label htmlFor="image_url_2">URL - Imagem 2</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      id="image_url_2"
                      value={formData.image_url_2}
                      onChange={(e) => setFormData({ ...formData, image_url_2: e.target.value })}
                      placeholder="https://exemplo.com/imagem-2.jpg"
                    />
                  </div>
                  {formData.image_url_2 && (
                    <div className="h-16 w-16 rounded border bg-muted flex-shrink-0 overflow-hidden">
                      <img 
                        src={formData.image_url_2} 
                        alt="Preview 2" 
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Imagem 3 */}
              <div className="space-y-2">
                <Label htmlFor="image_url_3">URL - Imagem 3</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      id="image_url_3"
                      value={formData.image_url_3}
                      onChange={(e) => setFormData({ ...formData, image_url_3: e.target.value })}
                      placeholder="https://exemplo.com/imagem-3.jpg"
                    />
                  </div>
                  {formData.image_url_3 && (
                    <div className="h-16 w-16 rounded border bg-muted flex-shrink-0 overflow-hidden">
                      <img 
                        src={formData.image_url_3} 
                        alt="Preview 3" 
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Cole o link direto da imagem (hospedada externamente).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes do produto..."
                className="h-24"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Produto Ativo</Label>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CategorySelectionModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={(category) => setFormData({ ...formData, category })}
        categories={availableCategories}
      />
    </div>
  );
};
