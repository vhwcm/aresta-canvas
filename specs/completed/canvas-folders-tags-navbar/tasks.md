# Checklist de Tarefas: Navbar, Favicon e Pastas/Tags no Canvas

## Fase 1: Favicon e Identidade Visual da Aba
- [x] 1.1 Atualizar `front/nuxt.config.ts` no `aresta-canvas` para incluir `{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }` prioritário.
- [x] 1.2 Validar que os arquivos `favicon.svg`, `favicon.ico`, `favicon-32x32.png` e `apple-touch-icon.png` em `front/public/` estão atualizados com a marca oficial.

## Fase 2: Backend — Suporte a Pastas e Tags em Canvases
- [x] 2.1 Atualizar `backend/prisma/schema.prisma` com campos `folder String?` e `tags String @default("[]")` no modelo `Canvas`.
- [x] 2.2 Executar `npx prisma migrate dev` ou `npx prisma db push` e `npx prisma generate` no `aresta-canvas/backend`.
- [x] 2.3 Atualizar `backend/src/services/canvas.service.ts`:
  - Tipos `CreateCanvasInput` e `UpdateCanvasInput` com `folder` e `tags`.
  - Mapeamento de `folder` e `tags` (parse de JSON) em `getAllByUser` e `getById`.
  - Filtro por `folder`, `tag` e `search` em `getAllByUser`.
  - Método `getFolders(userId: number)`.
- [x] 2.4 Atualizar `backend/src/controllers/canvas.controller.ts` e `backend/src/routes/canvas.routes.ts`:
  - Rota `GET /folders` para retornar `{ folders: string[] }`.
  - Passagem de `req.query.folder` e `req.query.tag` para o service.
- [x] 2.5 Rodar testes do backend para garantir regressão zero (`npm test` no backend).

## Fase 3: Frontend — Interfaces e Composables
- [x] 3.1 Atualizar `front/app/interfaces/canvas.ts` com `folder?: string | null` e `tags: string[]`.
- [x] 3.2 Atualizar `front/app/composables/useCanvas.ts`:
  - Suportar parâmetros `folder`, `tag`, `search` em `fetchCanvases`.
  - Adicionar `fetchCanvasFolders()`.
  - Suportar `folder` e `tags` em `createCanvas`, `updateCanvasMetadata`, `duplicateCanvas`.
- [x] 3.3 Revisar `front/app/composables/useNotes.ts` para garantir sincronia de pastas e tags.

## Fase 4: Frontend — Navbar Unificada do Ecossistema
- [x] 4.1 Criar componente `front/app/components/ArestaLogoGraph.vue` idêntico ao do Reader.
- [x] 4.2 Criar componente `front/app/components/BottomNavbar.vue` no Canvas:
  - Estilização flutuante, docking, animação de colapso, ArestaLogoGraph.
  - Links para Quadros (`/canvas`), Notas (`/notes`), Dropdown da Estante/Grafo/Conversor/Loja, Revisão, Conta, Toggle de Tema.
  - Comportamento de auto-colapso na rota `/canvas/[id]` e mobile.
- [x] 4.3 Injetar `BottomNavbar.vue` em `front/app/app.vue`.

## Fase 5: Frontend — Sistema de Pastas e Tags (Samsung Notes Style)
- [x] 5.1 Criar componente `front/app/components/FolderTagSidebar.vue`:
  - Seletor de "Todas as notas/quadros" e "Sem pasta".
  - Lista de pastas customizadas com badge de contagem.
  - Ação "+ Nova Pasta", Renomear Pasta e Excluir Pasta.
  - Seção de Tags com nuvem/chips clicáveis e contagem de itens por tag.
- [x] 5.2 Integrar o sistema na tela de Quadros (`front/app/pages/canvas/index.vue`):
  - Sidebar lateral expansível/responsiva com pastas e tags.
  - Exibição de chips de tags e pasta nos cards de quadros.
  - Modais de criação de quadro (com pasta e tags), mover para pasta e editar tags (`CanvasActionModals.vue`).
- [x] 5.3 Integrar o sistema na tela de Notas (`front/app/pages/notes.vue`):
  - Sidebar com pastas e tags estilo Samsung Notes.
  - Edição de tags e pasta no editor de notas.
- [x] 5.4 Atualizar `front/app/pages/index.vue` para redirecionar diretamente para `/canvas`.

## Fase 6: Testes, Quality Gates e Conclusão
- [x] 6.1 Rodar suíte de testes do backend (`npm test`: 3/3 passando).
- [x] 6.2 Rodar suíte de testes do frontend (`npm test`: 24/24 passando, lint: 0 erros, typecheck: 0 erros).
- [x] 6.3 Atualizar documentação e mover spec para `specs/completed/`.
- [x] 6.4 Fazer commits atômicos descritivos.
