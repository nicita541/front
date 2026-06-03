# D&D AI Master Frontend

Браузерный frontend для backend из `nicita541/D-D`.

## Стек

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios

## Локальный запуск

```bash
npm install
npm run dev
```

По умолчанию frontend ждёт backend здесь:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Можно скопировать `.env.example` в `.env` и поменять адрес API.

## Проверка качества

```bash
npm run lint
npm run build
```

## Docker

```bash
docker compose -f compose.frontend.yml up -d --build
```

Важно: `VITE_API_BASE_URL` в Vite подставляется во время сборки frontend. В Docker это передаётся через `build.args` в `compose.frontend.yml`. Если адрес backend меняется, поменяй build arg и пересобери контейнер.

## Основные маршруты

- `/login` — вход и регистрация
- `/dashboard` — главная страница приложения
- `/games` — список game states и создание игры
- `/games/:gameStateId/character` — создание персонажа
- `/play/:gameStateId` — игровой экран
- `/profile` — профиль и данные сессии
- `/diagnostics` — проверка подключения к backend

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

Если в Swagger фактический путь действия игрока отличается, нужно поправить `src/shared/api/endpoints.ts`.

## Что уже есть в UI

- Авторизация с сохранением JWT
- Dashboard после входа
- Профиль пользователя
- Список кампаний
- Создание game state
- Создание персонажа
- Игровой экран
- Быстрые действия игрока
- Вкладки игрового стола: журнал, инвентарь, прогресс
- Журнал событий в стиле чата мастера
- Карточка персонажа
- XP progress и level-up indicator
- Инвентарь
- Диагностика API

## Документация

- `docs/API_CONTRACT.md` — ожидаемый контракт backend API
- `docs/FRONTEND_ARCHITECTURE.md` — структура frontend
- `docs/RUNBOOK.md` — запуск, Docker и частые проблемы
