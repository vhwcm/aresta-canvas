# Design Técnico: Navbar Unificada, Favicon Oficial e Sistema de Pastas & Tags (Samsung Notes)

## 1. Arquitetura e Visão Geral

```
                    ┌──────────────────────────────────────────────┐
                    │               aresta-canvas front            │
                    │               (Nuxt 3 / SPA / Tauri)         │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│   BottomNavbar   │             │ FolderTagSidebar │             │ Favicon & Assets │
│  & ArestaLogo    │             │  (Samsung Notes) │             │ (SVG/PNG/ICO)    │
│  (Floating Dock) │             │  Pastas + Tags   │             │ 100% Brand Pure  │
└────────┬─────────┘             └────────┬─────────┘             └──────────────────┘
         │                                │
         │                                ▼
         │                     ┌──────────────────────┐
         │                     │ useCanvas / useNotes │
         │                     └──────────┬───────────┘
         │                                │
         ▼                                ▼
┌──────────────────┐             ┌──────────────────────────────────────────────────┐
│ Ecosystem Links  │             │              aresta-canvas backend               │
│ (Reader :3010,   │             │   CanvasService / NoteService (SQLite Prisma)    │
│  Memory :3005)   │             └──────────────────────────────────────────────────┘
└──────────────────┘
```

---

## 2. Contratos e Modelo de Dados

### 2.1. Alteração no Prisma Schema (`aresta-canvas/backend/prisma/schema.prisma`)
Adicionamos `folder` e `tags` no modelo `Canvas`:
```prisma
model Canvas {
  id          String   @id @default(uuid())
  user_id     Int      // external ref — aresta-auth User.id
  title       String   @default("Quadro sem título")
  description String?
  folder      String?  // Nome da pasta (ex: "Faculdade", "Projetos")
  tags        String   @default("[]") // JSON string array (ex: '["matematica", "estudo"]')
  data        String   // JSON Canvas Spec (nodes, edges, viewport)
  created_at  DateTime @default(now())
  updated_at  DateTime @default(now()) @updatedAt

  @@index([user_id, updated_at])
  @@index([user_id, folder])
  @@map("canvases")
}
```

### 2.2. Endpoints da API

#### Canvases (`/api/canvases`):
- `GET /api/canvases`:
  - Query params: `folder?: string`, `tag?: string`, `search?: string`
  - Retorna `CanvasSummary[]` contendo `id`, `title`, `description`, `folder`, `tags`, `nodeCount`, `edgeCount`, `createdAt`, `updatedAt`.
- `GET /api/canvases/folders`:
  - Retorna lista de pastas distintas do usuário: `{ folders: string[] }`.
- `POST /api/canvases`:
  - Body: `{ title?, description?, folder?, tags?, data? }`.
- `PUT /api/canvases/:id`:
  - Body: `{ title?, description?, folder?, tags?, data? }`.
- `POST /api/canvases/:id/duplicate`:
  - Clona o quadro preservando pasta e tags.

#### Notes (`/api/notes`):
- `GET /api/notes`:
  - Query params: `folder?: string`, `tag?: string`, `search?: string`, `page?: number`, `limit?: number`.
- `GET /api/notes/folders`:
  - Retorna `{ folders: string[] }`.
- `POST /api/notes` e `PUT /api/notes/:id`:
  - Suporte total a `folder` e `tags`.

---

## 3. Componentes Frontend

### 3.1. `ArestaLogoGraph.vue`
- Componente SVG animado com vértices laranjas oscilando e arestas formando o "A" de Aresta.
- Modos: com link (`NuxtLink`) ou estático (em botões de colapso).

### 3.2. `BottomNavbar.vue`
- Dock flutuante inferior com design system idêntico ao `aresta-reader`:
  - `bg-bgPanel/95 backdrop-blur border border-divider shadow-2xl rounded-2xl`.
  - Itens:
    1. **Quadros** (`/canvas`): Ícone de LayoutGrid / Quadro.
    2. **Notas** (`/notes`): Ícone de Caderno / FileText.
    3. **Dropdown Ecossistema**:
       - Estante de Livros (`http://localhost:3010/library`)
       - Grafo de Conhecimento (`http://localhost:3010/grafo`)
       - Conversor de PDF (`http://localhost:3010/conversor`)
       - Loja (`http://localhost:3010/loja`)
    4. **Logo Central**: `ArestaLogoGraph` (vai para a tela inicial `/canvas`).
    5. **Revisão**: (`http://localhost:3010/revisao`).
    6. **Conta**: (`http://localhost:3010/conta`).
    7. **Theme Toggle**: Alterna entre Dark, Sepia e Light.
    8. **Botão de Colapso**: Recolhe para o botão circular com o logo.
- Auto-recolhimento no editor `/canvas/[id]` e em telas mobile.

### 3.3. `FolderTagSidebar.vue` (Samsung Notes UI)
- Componente modular reutilizável para `/canvas` e `/notes`:
  - **Pastas**:
    - "Todas" com contagem total.
    - "Sem Pasta" com contagem de itens desorganizados.
    - Lista de pastas com contagem de cada uma.
    - Ações de pasta: Botão "+ Nova pasta", Menu de contexto (Renomear / Excluir).
  - **Tags**:
    - Nuvem/lista de chips de tags com contagem de ocorrências.
    - Filtro ativo com destaque visual (laranja Aresta).
  - **Diálogos Modais**:
    - Modal de Nova Pasta / Renomear Pasta.
    - Modal de Mover para Pasta e Editar Tags do item.

---

## 4. Estratégia de Favicon
- Inserir `link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }, ...]` em `front/nuxt.config.ts`.
- O navegador usará imediatamente o SVG de alta definição com as cores exatas da marca.
