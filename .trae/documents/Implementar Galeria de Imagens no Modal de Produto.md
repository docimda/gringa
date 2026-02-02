Para adicionar a funcionalidade de galeria de imagens no modal de detalhes do produto, vou implementar um sistema de carrossel simples dentro do componente `ProductCard`.

O plano é:

1.  **Identificar as Imagens**: Criar um array com todas as imagens disponíveis (`image_url`, `image_url_2`, `image_url_3`), filtrando as que estão vazias.
2.  **Estado do Índice Atual**: Adicionar um estado `currentImageIndex` para controlar qual imagem está sendo exibida.
3.  **Navegação**:
    *   Adicionar botões de "Anterior" (`<`) e "Próximo" (`>`) sobre a imagem principal no modal.
    *   Esses botões só aparecerão se houver mais de uma imagem.
    *   Ao clicar, atualizaremos o `currentImageIndex` (com lógica circular: da última para a primeira e vice-versa).
4.  **Indicadores (Bolinhas)**: Adicionar indicadores na parte inferior da imagem para mostrar quantas imagens existem e qual está ativa.

Vou modificar o arquivo `src/components/ProductCard.tsx` para incluir essa lógica.

**Exemplo da lógica de imagens:**
```typescript
const images = [
  product.image_url,
  product.image_url_2,
  product.image_url_3
].filter(Boolean); // Remove null/undefined/strings vazias
```

Se `images.length > 1`, exibo os controles de navegação.

Vou iniciar a implementação agora.
