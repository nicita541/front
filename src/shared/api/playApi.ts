import { http } from './http';
import type { PlayStatus } from './playTypes';

export type PlayerActionRequest = {
  characterId?: string;
  action: string;
};

export async function getPlayStatus(gameStateId: string) {
  const { data } = await http.get<PlayStatus>(`/api/play/${gameStateId}/status`);
  return data;
}

export async function sendPlayerAction(gameStateId: string, payload: PlayerActionRequest) {
  const { data } = await http.post<PlayStatus>(`/api/play/${gameStateId}/actions`, payload);
  return data;
}
