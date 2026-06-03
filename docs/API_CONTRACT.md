# API contract

Frontend ожидает backend по адресу из переменной:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Auth

### POST /api/auth/login

Request:

```json
{
  "email": "test1@example.com",
  "password": "Password123!"
}
```

Expected response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "account": {
    "id": "...",
    "email": "test1@example.com",
    "username": "test1",
    "displayName": "Test User 1",
    "role": "user"
  }
}
```

### POST /api/auth/register

Request:

```json
{
  "email": "test1@example.com",
  "username": "test1",
  "password": "Password123!",
  "displayName": "Test User 1"
}
```

### GET /api/auth/me

Requires Bearer token.

## Game states

### GET /api/game-states

Expected response:

```json
[
  {
    "id": "...",
    "name": "Новая кампания",
    "currentLocationId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### POST /api/game-states

Request:

```json
{
  "name": "Новая кампания"
}
```

## Characters

### GET /api/game-states/{gameStateId}/characters

Expected response:

```json
[
  {
    "id": "...",
    "gameStateId": "...",
    "name": "Торвен",
    "className": "Воин",
    "level": 1,
    "experience": 0,
    "experienceToNextLevel": 300,
    "levelUpAvailable": false,
    "proficiencyBonus": 2,
    "hitPoints": 10,
    "maxHitPoints": 10,
    "gold": 0
  }
]
```

### POST /api/game-states/{gameStateId}/characters

Request:

```json
{
  "name": "Торвен",
  "className": "Воин",
  "background": "Бывший стражник пограничной заставы."
}
```

## Play

### GET /api/play/{gameStateId}/status

Expected response:

```json
{
  "gameState": {},
  "character": {},
  "location": {
    "id": "...",
    "name": "...",
    "description": "..."
  },
  "journal": [
    {
      "id": "...",
      "type": "master",
      "message": "...",
      "createdAt": "..."
    }
  ],
  "inventory": [
    {
      "id": "...",
      "name": "Факел",
      "quantity": 1,
      "description": "..."
    }
  ]
}
```

### POST /api/play/{gameStateId}/actions

Request:

```json
{
  "characterId": "...",
  "action": "Осмотреться вокруг и поискать опасность."
}
```

Expected response: same shape as play status, or updated play status.

## Where to change endpoints

All routes are centralized here:

```txt
src/shared/api/endpoints.ts
```

If Swagger uses different play routes, change only that file.
