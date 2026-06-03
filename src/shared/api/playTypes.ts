export type JournalEntry = {
  id?: string;
  type?: string;
  source?: string;
  message?: string;
  text?: string;
  createdAt?: string;
};

export type PlayStatus = {
  gameState?: unknown;
  character?: unknown;
  location?: {
    id?: string;
    name?: string;
    description?: string;
  };
  journal?: JournalEntry[];
  log?: JournalEntry[];
  inventory?: Array<{ id?: string; name: string; quantity?: number }>;
};
