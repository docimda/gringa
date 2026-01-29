Vou implementar a funcionalidade completa de comentários externos e sincronização, refatorando o código para reutilizar o modal de detalhes.

### 1. Banco de Dados
*   Criar a coluna `external_comments` na tabela `orders`.

### 2. Refatoração e Componentização (Frontend)
*   **Criar `components/OrderDetailsModal.tsx`:** Extrair o modal de detalhes que hoje está fixo no `AdminOrders.tsx`.
*   **Lógica Condicional:** O novo componente aceitará propriedades como `isAdmin` (para mostrar/ocultar comentários internos e permitir edição).
*   **Campos:**
    *   *Comentários Internos:* Visível/Editável apenas se `isAdmin=true`.
    *   *Comentários para o Cliente:* Visível sempre. Editável apenas se `isAdmin=true`.

### 3. Backend e Serviços (`orderService.ts`)
*   Atualizar tipos para incluir `external_comments`.
*   Criar função `updateOrderExternalComment` para o admin salvar.
*   **Sincronização:** Criar função `getOrdersByIds(ids)` que busca no Supabase os dados atualizados (status, comentários) dos pedidos que estão no histórico do celular do cliente.

### 4. Implementação nas Páginas
*   **Admin (`AdminOrders.tsx`):** Substituir o modal antigo pelo novo componente reutilizável, habilitando modo de edição e visualização completa.
*   **Cliente (`OrdersPage.tsx`):**
    *   Implementar a busca automática (`useQuery`) para atualizar os pedidos locais com os dados do servidor (garantindo que o cliente veja o que o admin escreveu).
    *   Adicionar o botão de "olho" em cada pedido.
    *   Integrar o `OrderDetailsModal` em modo de leitura (sem comentários internos).

### 5. Resultado Final
*   Admin pode escrever "Comentários para o Cliente".
*   Cliente vê esses comentários ao clicar no "olho" em "Meus Pedidos".
*   Status e comentários são atualizados sempre que o cliente acessa a página, garantindo sincronização.
