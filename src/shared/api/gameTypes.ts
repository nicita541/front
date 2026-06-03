export type GameState = {
  id: string;
  name: string;
  currentLocationId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Character = {
  id: string;
  gameStateId?: string;
  name: string;
  className?: string;
  level?: number;
  experience?: number;
  hitPoints?: number;
  maxHitPoints?: number;
  gold?: number;
};
