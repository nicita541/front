import { endpoints } from './endpoints';
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
  const { data } = await http.get<GameState[]>(endpoints.gameStates.list);
  return data;
}

export async function createGameState(payload: CreateGameRequest) {
  const { data } = await http.post<GameState>(endpoints.gameStates.create, payload);
  return data;
}

export async function createCharacter(gameStateId: string, payload: CreateCharacterRequest) {
  const { data } = await http.post<Character>(endpoints.gameStates.characters(gameStateId), payload);
  return data;
}

export async function getCharacters(gameStateId: string) {
  const { data } = await http.get<Character[]>(endpoints.gameStates.characters(gameStateId));
  return data;
}
