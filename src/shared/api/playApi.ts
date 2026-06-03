import { endpoints } from './endpoints';
import { http } from './http';
import type { PlayStatus } from './playTypes';

export type PlayerActionRequest = {
  characterId?: string;
  action: string;
};

export async function getPlayStatus(gameStateId: string) {
  const { data } = await http.get<PlayStatus>(endpoints.play.status(gameStateId));
  return data;
}

export async function sendPlayerAction(gameStateId: string, payload: PlayerActionRequest) {
  const { data } = await http.post<PlayStatus>(endpoints.play.action(gameStateId), payload);
  return data;
}
