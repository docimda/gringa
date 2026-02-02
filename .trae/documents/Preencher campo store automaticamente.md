O campo `store` no formulário de criação de produtos (`AdminProducts.tsx`) não está sendo inicializado com o valor padrão `docimdagringa`.

Para corrigir isso, precisamos alterar a função `openCreateModal` para definir o valor inicial de `store` como `'docimdagringa'`.

O código atual está assim:
```typescript
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      store: '', // <-- Está vazio aqui
      description: '',
      // ...
```

O plano é alterar para:
```typescript
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      store: 'docimdagringa', // <-- Alterar para o valor padrão
      description: '',
      // ...
```

Isso garantirá que, ao abrir o modal para criar um novo produto, o campo já venha preenchido.

Para a edição de produtos (`openEditModal`), o código já está correto, pois ele pega o valor do produto existente:
```typescript
      store: product.store || '',
```

Vou aplicar essa alteração no arquivo `src/components/AdminProducts.tsx`.
