# aresta-canvas — Canvas Annotation App

Aplicativo de canvas de anotação visual do ecossistema Aresta.
Disponível como app web, desktop (Tauri) e APK Android.

## Estrutura
- `backend/` — Express API (porta 3004) com **SQLite 3** via Prisma (sem container de DB)
- `front/` — Nuxt/Vue (porta 3011 em dev) + Tauri (desktop + APK Android)

## Portas
- Backend API: 3004
- Frontend dev: 3011

## Banco: SQLite 3 (`aresta_canvas.db`)
Sem container de banco dedicado. O arquivo `.db` é mantido em volume Docker.

## Banco Local (Offline-First)
O frontend Tauri usa `@tauri-apps/plugin-sql` com `sqlite:aresta-canvas.db`
para armazenar canvases localmente e sincronizar com o backend quando online.

## Dependências de Runtime
- aresta-auth (:3001) — valida JWT
- aresta-memory (:3005) — consultar grafo e anotações
- aresta-ai (:3002) — recursos de IA no canvas

## Quality Gates
```bash
# Backend
cd backend && npm run build && npm run test
# Frontend
cd front && npm run lint && npm run typecheck && npm run test
```
