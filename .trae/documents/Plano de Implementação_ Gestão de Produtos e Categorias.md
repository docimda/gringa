Entendido. Foco em flexibilidade de categorias e economia de storage.

### 1. Banco de Dados
*   Adicionar apenas a coluna `sku` na tabela `products`.

### 2. Frontend (AdminProducts.tsx)
*   **Gestão de Categorias Flexível:**
    *   O campo de categoria será um **Combobox (Select editável)**.
    *   Ele virá pré-carregado com as categorias padrão (`Géis`, `Máquinas`, etc.) e categorias já existentes no banco.
    *   Permitirá que o admin digite uma **nova categoria** livremente ("Criar 'Nova Categoria'").
*   **Imagens via URL:**
    *   Remover qualquer lógica de upload de arquivo.
    *   Campo de texto simples: "URL da Imagem" (com preview ao lado para validar se o link funciona).
*   **Funcionalidades CRUD:**
    *   Listagem, Criação, Edição e Exclusão (Soft delete ou inativação).

### 3. Backend (Service)
*   `productService.ts`: Funções padrão de CRUD. Sem função de upload.

### 4. Integração
*   Atualizar `types/product.ts` com o campo `sku`.
*   Implementar na aba "Produtos" do Admin.
