import { http } from './http';
import type { Character, GameState } from './gameTypes';

export type CreateGameRequest = {
  name: string;
};

export type CreateCharacterRequest = {
  name: string;
  className?: string;
  background?: string;
};

export async function getGameStates() {
  const { data } = await http.get<GameState[]>('/api/game-states');
  return data;
}

export async function createGameState(payload: CreateGameRequest) {
  const { data } = await http.post<GameState>('/api/game-states', payload);
  return data;
}

export async function createCharacter(gameStateId: string, payload: CreateCharacterRequest) {
  const { data } = await http.post<Character>(`/api/game-states/${gameStateId}/characters`, payload);
  return data;
}

export async function getCharacters(gameStateId: string) {
  const { data } = await http.get<Character[]>(`/api/game-states/${gameStateId}/characters`);
  return data;
}
