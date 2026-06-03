import type { Character, GameState } from './gameTypes';

export type JournalEntry = {
  id?: string;
  type?: string;
  source?: string;
  message?: string;
  text?: string;
  createdAt?: string;
};

export type LocationView = {
  id?: string;
  name?: string;
  description?: string;
};

export type InventoryItem = {
  id?: string;
  name: string;
  quantity?: number;
  description?: string;
};

export type PlayStatus = {
  gameState?: GameState;
  character?: Character;
  location?: LocationView;
  journal?: JournalEntry[];
  log?: JournalEntry[];
  inventory?: InventoryItem[];
};
