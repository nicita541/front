# D&D AI Master Frontend

Браузерный frontend для backend из `nicita541/D-D`.

## Стек

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios

## Запуск

```bash
npm install
npm run dev
```

По умолчанию frontend ждёт backend здесь:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Можно скопировать `.env.example` в `.env` и поменять адрес API.

## Основные маршруты

- `/login` — вход и регистрация
- `/games` — список game states и создание игры
- `/games/:gameStateId/character` — создание персонажа
- `/play/:gameStateId` — игровой экран

## Backend endpoints, которые использует frontend

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/game-states`
- `POST /api/game-states`
- `GET /api/game-states/{gameStateId}/characters`
- `POST /api/game-states/{gameStateId}/characters`
- `GET /api/play/{gameStateId}/status`
- `POST /api/play/{gameStateId}/actions`

Если в Swagger фактический путь действия игрока отличается, нужно поправить только `src/shared/api/playApi.ts`.
