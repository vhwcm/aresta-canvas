# Especificação: Navbar Unificada, Favicon Oficial e Sistema de Pastas & Tags (Samsung Notes)

## 1. Contexto e Motivação
O **Aresta Canvas** é o módulo de anotações visuais e quadros infinitos do ecossistema Aresta. Para garantir paridade de experiência, coerência de marca e usabilidade avançada na gestão de conhecimento:
1. O ícone da aba do navegador (favicon) deve exibir a marca oficial e atualizada do Aresta, com suporte a SVG vetorial e múltiplos tamanhos PNG/ICO.
2. A barra de navegação principal (Navbar) deve seguir a identidade visual unificada do ecossistema estabelecida no `aresta-reader`, com dock flutuante inferior, animação orgânica do grafo (`ArestaLogoGraph`), alternância de tema, modo colapsável e links de navegação entre serviços.
3. A gestão de **Quadros Infinitos (Canvas)** e **Anotações Livres (Notes)** deve incorporar uma estrutura robusta e intuitiva de **Pastas e Tags** inspirada no modelo do **Samsung Notes**, permitindo categorização por pastas, criação/edição/exclusão de pastas, etiquetagem por tags com badges e filtragem combinada (por pasta, tag e busca textual).

---

## 2. Requisitos Funcionais

### RF-01: Identidade Visual e Favicon da Aba
- **R1.1**: O `nuxt.config.ts` do frontend do Canvas deve apontar para `/favicon.svg` com `type="image/svg+xml"`, além dos tamanhos de contingência `/favicon-32x32.png`, `/favicon-16x16.png`, `/favicon.ico` e `/apple-touch-icon.png`.
- **R1.2**: Todos os arquivos de favicon em `front/public/` devem estar sincronizados com o logo oficial mais recente gerado no ecossistema.
- **R1.3**: O título e meta tags do documento devem refletir com clareza o módulo Aresta Canvas.

### RF-02: Barra de Navegação Inferior Unificada (`BottomNavbar`)
- **R2.1**: Implementar o componente `BottomNavbar.vue` e o logo animado `ArestaLogoGraph.vue` no Canvas com o mesmo padrão estético (dock flutuante arredondado, backdrop blur, sombras, animação dos nós do grafo vivo em laranja `#E57B55`).
- **R2.2**: A navbar deve conter os itens essenciais:
  - **Quadros & Canvas**: atalho para `/canvas`.
  - **Anotações Livres**: atalho para `/notes`.
  - **Estante de Livros**: atalho para o `aresta-reader` (:3010).
  - **Revisão / Flashcards**: atalho para revisão de retenção (:3010/revisao).
  - **Conta**: atalho para o perfil / conta (:3010/conta).
  - **Logo Central**: Grafo vivo animado centralizado com retorno ao início.
  - **Alternador de Temas**: toggle rápido entre escuro (Dark), claro (Light) e sépia (Livro).
  - **Botão de Colapso/Expansão**: permite retrair a navbar em um botão circular flutuante mínimo com o ícone do grafo para não atrapalhar o espaço visual.
- **R2.3**: Em telas menores (mobile) ou ao adentrar a tela de edição do canvas (`/canvas/[id]`), a navbar deve iniciar retraída ou permitir colapso instantâneo para maximizar a área de trabalho e desenho.
- **R2.4**: A `BottomNavbar` deve ser injetada globalmente via `app.vue`.

### RF-03: Modelo de Dados de Pastas e Tags para Quadros e Notas
- **R3.1**: O modelo `Canvas` no Prisma (`backend/prisma/schema.prisma`) deve possuir os campos `folder String?` e `tags String @default("[]")`.
- **R3.2**: O backend deve fornecer migração SQLite e atualização no client Prisma para persistir `folder` e `tags` em `canvases`.
- **R3.3**: A API de Canvas (`canvas.service.ts` e `canvas.controller.ts`) deve aceitar `folder` e `tags` na criação e atualização de quadros, além de permitir filtrar por `folder`, `tag` e listar todas as pastas distintas do usuário via `GET /api/canvases/folders`.
- **R3.4**: A API de Notas (`note.service.ts` e `note.controller.ts`) deve continuar fornecendo o suporte completo a `folder`, `tags` e `GET /api/notes/folders`.

### RF-04: Estrutura de Pastas e Filtro por Tags (Samsung Notes Style)
- **R4.1 (Painel Lateral de Organização)**: Tanto a página de Quadros (`/canvas`) quanto a de Notas (`/notes`) devem dispor de uma visualização clara em painel/sidebar com:
  - Seletor "Todos os itens" (All).
  - Seletor "Sem pasta" (itens não categorizados).
  - Lista de Pastas customizadas pelo usuário, exibindo a contagem de itens em cada uma.
  - Botão de ação "+ Nova Pasta" para criar pasta rapidamente.
  - Ações de renomear e excluir pasta (ao excluir uma pasta, os itens contidos nela passam para "Sem pasta", sem serem deletados).
  - Seção de Tags com nuvem/chips clicáveis, exibindo as tags cadastradas e a contagem de itens associados a cada tag.
  - Clicar em uma tag ativa ou desativa o filtro por tag.
- **R4.2 (Gestão no Item)**:
  - Na visualização em lista/grid dos quadros e notas, cada card deve exibir as tags associadas em forma de chips e o nome da pasta.
  - Cada item deve ter atalho de menu rápido para "Mover para pasta" e "Gerenciar tags".
  - Ao criar um novo quadro ou nova nota, o usuário pode definir imediatamente a pasta e inserir tags (com tags auto-completadas das existentes).

---

## 3. Critérios de Aceite
1. O favicon na aba do navegador carrega o SVG vetorial nítido do Aresta no Chrome, Edge e Firefox sem resquícios do logo antigo.
2. A `BottomNavbar` é exibida no rodapé, flutuante, translúcida, idêntica ao design system do `aresta-reader`, com interatividade total (links, dropdowns, toggle de tema, colapso suave).
3. Usuário pode criar uma pasta, mover quadros e notas para essa pasta e ver os itens filtrados ao clicar na pasta.
4. Usuário pode adicionar tags a quadros e notas (ex: `#estudo`, `#ideias`) e filtrar a listagem clicando na tag.
5. Todos os testes automatizados do backend e do frontend passam sem regressões.
