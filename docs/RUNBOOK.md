# Runbook

## Local frontend

1. Install dependencies.
2. Start Vite dev server.
3. Open the browser on port 5173.

Commands:

```bash
npm install
npm run dev
```

Default API URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Local backend expectation

Frontend expects backend Swagger here:

```txt
http://localhost:8080/swagger
```

Backend should allow CORS from Vite dev server:

```txt
http://localhost:5173
```

## Docker frontend

Use:

```bash
docker compose -f compose.frontend.yml up -d --build
```

Vite embeds `VITE_API_BASE_URL` during build. Change `compose.frontend.yml` build args and rebuild if backend URL changes.

## Useful screens

- `/login` — auth.
- `/dashboard` — main app dashboard.
- `/games` — campaign list and creation.
- `/profile` — account and session.
- `/diagnostics` — API checks.

## Common problems

### Login works but game list fails

Check Bearer token, CORS, and `GET /api/game-states` authorization.

### Docker build uses wrong backend URL

Check `compose.frontend.yml` build args. Runtime environment variables do not change already built Vite assets.

### Play screen does not update

Check actual backend route for player actions. Frontend currently uses `POST /api/play/{gameStateId}/actions`.

### Character creation fails

Check if backend expects `className`, `class`, or another field name.
