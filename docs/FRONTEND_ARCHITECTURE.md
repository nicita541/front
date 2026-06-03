# Frontend architecture

## Stack

React, TypeScript, Vite, React Router, TanStack Query, Axios.

## Main folders

- `src/app` — route composition.
- `src/pages` — page-level screens.
- `src/shared/api` — axios client, endpoint constants and DTO types.
- `src/shared/ui` — reusable loading, error and empty states.
- `src/widgets` — layout-level components such as AppShell.

## Main routes

- `/login`
- `/dashboard`
- `/games`
- `/games/:gameStateId/character`
- `/play/:gameStateId`
- `/profile`
- `/diagnostics`

## API layer rules

- Endpoint paths live in `src/shared/api/endpoints.ts`.
- Axios instance lives in `src/shared/api/http.ts`.
- JWT is read from `localStorage.accessToken`.
- 401 responses clear tokens and redirect to `/login`.
- Backend DTOs live in `authTypes.ts`, `gameTypes.ts`, `playTypes.ts`.

## UI flow

1. User logs in or registers on `/login`.
2. JWT is saved in localStorage.
3. User lands in the app shell.
4. `/dashboard` shows profile summary and recent games.
5. `/games` creates or opens game states.
6. `/games/:gameStateId/character` creates characters explicitly.
7. `/play/:gameStateId` is the game table.
8. `/diagnostics` checks API connectivity.

## Current limitations

- Endpoint contract must be verified against backend Swagger.
- Play action route may need adjustment.
- Character creation payload may need adjustment if backend expects different field names.
- No refresh-token rotation is implemented yet.
- No role-based UI yet.
- No generated API client yet.

## Recommended next refactor

When backend contract stabilizes, split code into feature folders: auth, games, characters, play, account.

For now the structure is intentionally simple and MVP-friendly.
