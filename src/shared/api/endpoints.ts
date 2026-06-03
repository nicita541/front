export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
  },
  gameStates: {
    list: '/api/game-states',
    create: '/api/game-states',
    characters: (gameStateId: string) => `/api/game-states/${gameStateId}/characters`,
  },
  play: {
    status: (gameStateId: string) => `/api/play/${gameStateId}/status`,
    action: (gameStateId: string) => `/api/play/${gameStateId}/actions`,
  },
};
