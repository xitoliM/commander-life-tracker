export type HistoryType = "life" | "counter" | "commanderDamage" | "status";

export type StatusKey =
  | "monarchPlayerId"
  | "initiativePlayerId"
  | "startingPlayerId";

export type BuiltInCounterKey =
  | "poison"
  | "commanderTax"
  | "energy"
  | "experience";

export type CounterKey = BuiltInCounterKey | "extra";

export type ExtraCounter = {
  id: string;
  name: string;
  value: number;
};

export type Player = {
  id: string;
  name: string;
  color: string;
  life: number;
  poison: number;
  commanderTax: number;
  energy: number;
  experience: number;
  extraCounters: ExtraCounter[];
  eliminated: boolean;
};

export type CommanderDamage = {
  sourcePlayerId: string;
  targetPlayerId: string;
  amount: number;
};

export type HistoryEntry = {
  id: string;
  type: HistoryType;
  payload: Record<string, unknown>;
  timestamp: number;
};

export type Game = {
  id: string;
  players: Player[];
  startingLife: number;
  monarchPlayerId?: string;
  initiativePlayerId?: string;
  startingPlayerId?: string;
  commanderDamage: CommanderDamage[];
  history: HistoryEntry[];
};

export type PlayerSetup = {
  name: string;
  color: string;
};

export type CreateGameInput = {
  playerCount: number;
  startingLife: number;
  players: PlayerSetup[];
  randomizeStartingPlayer: boolean;
};
