import type {
  BuiltInCounterKey,
  CommanderDamage,
  CreateGameInput,
  ExtraCounter,
  Game,
  HistoryEntry,
  Player,
  StatusKey,
} from "@/types/game";

const MAX_HISTORY = 40;

export const PLAYER_COLORS = [
  "#f97316",
  "#22c55e",
  "#06b6d4",
  "#eab308",
  "#ec4899",
  "#8b5cf6",
] as const;

export const PLAYER_COLOR_NAMES: Record<string, string> = {
  "#f97316": "Orange",
  "#22c55e": "Green",
  "#06b6d4": "Cyan",
  "#eab308": "Yellow",
  "#ec4899": "Pink",
  "#8b5cf6": "Purple",
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function clampToZero(value: number) {
  return Math.max(0, value);
}

function updateHistory(game: Game, entry: HistoryEntry): Game {
  return {
    ...game,
    history: [...game.history, entry].slice(-MAX_HISTORY),
  };
}

function isPlayerEliminated(game: Game, playerId: string) {
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return false;
  }

  if (player.life <= 0 || player.poison >= 10) {
    return true;
  }

  return game.commanderDamage.some(
    (entry) => entry.targetPlayerId === playerId && entry.amount >= 21,
  );
}

function refreshEliminations(game: Game): Game {
  return {
    ...game,
    players: game.players.map((player) => ({
      ...player,
      eliminated: isPlayerEliminated(game, player.id),
    })),
  };
}

function setPlayerValue(
  player: Player,
  counterKey: BuiltInCounterKey,
  nextValue: number,
): Player {
  return {
    ...player,
    [counterKey]: clampToZero(nextValue),
  };
}

function replaceCommanderDamage(
  commanderDamage: CommanderDamage[],
  sourcePlayerId: string,
  targetPlayerId: string,
  amount: number,
) {
  const nextAmount = clampToZero(amount);
  const filtered = commanderDamage.filter(
    (entry) =>
      !(
        entry.sourcePlayerId === sourcePlayerId &&
        entry.targetPlayerId === targetPlayerId
      ),
  );

  if (nextAmount === 0) {
    return filtered;
  }

  return [...filtered, { sourcePlayerId, targetPlayerId, amount: nextAmount }];
}

export function getCommanderDamageAmount(
  game: Game,
  sourcePlayerId: string,
  targetPlayerId: string,
) {
  return (
    game.commanderDamage.find(
      (entry) =>
        entry.sourcePlayerId === sourcePlayerId &&
        entry.targetPlayerId === targetPlayerId,
    )?.amount ?? 0
  );
}

export function createGame(input: CreateGameInput): Game {
  const players = input.players.slice(0, input.playerCount).map((player, index) => ({
    id: createId("player"),
    name: player.name.trim() || `Player ${index + 1}`,
    color: player.color,
    life: input.startingLife,
    poison: 0,
    commanderTax: 0,
    energy: 0,
    experience: 0,
    extraCounters: [],
    eliminated: false,
  }));

  const randomPlayer =
    input.randomizeStartingPlayer && players.length > 0
      ? players[Math.floor(Math.random() * players.length)]?.id
      : undefined;

  return refreshEliminations({
    id: createId("game"),
    players,
    startingLife: input.startingLife,
    monarchPlayerId: undefined,
    initiativePlayerId: undefined,
    startingPlayerId: randomPlayer,
    commanderDamage: [],
    history: [],
  });
}

export function updateLife(game: Game, playerId: string, delta: number): Game {
  const currentPlayer = game.players.find((player) => player.id === playerId);
  if (!currentPlayer || delta === 0) {
    return game;
  }

  const nextLife = currentPlayer.life + delta;
  const nextGame = refreshEliminations({
    ...game,
    players: game.players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            life: nextLife,
          }
        : player,
    ),
  });

  return updateHistory(nextGame, {
    id: createId("history"),
    type: "life",
    payload: {
      playerId,
      previousLife: currentPlayer.life,
      nextLife,
    },
    timestamp: Date.now(),
  });
}

export function updateCounter(
  game: Game,
  playerId: string,
  counterKey: BuiltInCounterKey,
  delta: number,
): Game {
  const currentPlayer = game.players.find((player) => player.id === playerId);
  if (!currentPlayer || delta === 0) {
    return game;
  }

  const previousValue = currentPlayer[counterKey];
  const nextValue = clampToZero(previousValue + delta);
  const nextGame = refreshEliminations({
    ...game,
    players: game.players.map((player) =>
      player.id === playerId ? setPlayerValue(player, counterKey, nextValue) : player,
    ),
  });

  return updateHistory(nextGame, {
    id: createId("history"),
    type: "counter",
    payload: {
      playerId,
      counterKey,
      previousValue,
      nextValue,
    },
    timestamp: Date.now(),
  });
}

export function addExtraCounter(game: Game, playerId: string, name: string): Game {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return game;
  }

  const extraCounter: ExtraCounter = {
    id: createId("extra"),
    name: trimmedName,
    value: 0,
  };

  return {
    ...game,
    players: game.players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            extraCounters: [...player.extraCounters, extraCounter],
          }
        : player,
    ),
  };
}

export function removeExtraCounter(
  game: Game,
  playerId: string,
  extraCounterId: string,
): Game {
  return {
    ...game,
    players: game.players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            extraCounters: player.extraCounters.filter(
              (counter) => counter.id !== extraCounterId,
            ),
          }
        : player,
    ),
  };
}

export function updateExtraCounter(
  game: Game,
  playerId: string,
  extraCounterId: string,
  delta: number,
): Game {
  const currentPlayer = game.players.find((player) => player.id === playerId);
  const currentCounter = currentPlayer?.extraCounters.find(
    (counter) => counter.id === extraCounterId,
  );

  if (!currentPlayer || !currentCounter || delta === 0) {
    return game;
  }

  const previousValue = currentCounter.value;
  const nextValue = clampToZero(previousValue + delta);
  const nextGame = refreshEliminations({
    ...game,
    players: game.players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            extraCounters: player.extraCounters.map((counter) =>
              counter.id === extraCounterId
                ? { ...counter, value: nextValue }
                : counter,
            ),
          }
        : player,
    ),
  });

  return updateHistory(nextGame, {
    id: createId("history"),
    type: "counter",
    payload: {
      playerId,
      counterKey: "extra",
      extraCounterId,
      previousValue,
      nextValue,
    },
    timestamp: Date.now(),
  });
}

export function updateCommanderDamage(
  game: Game,
  sourcePlayerId: string,
  targetPlayerId: string,
  delta: number,
): Game {
  if (sourcePlayerId === targetPlayerId || delta === 0) {
    return game;
  }

  const previousAmount = getCommanderDamageAmount(
    game,
    sourcePlayerId,
    targetPlayerId,
  );
  const nextAmount = clampToZero(previousAmount + delta);
  const targetPlayer = game.players.find((player) => player.id === targetPlayerId);
  if (!targetPlayer) {
    return game;
  }

  const previousLife = targetPlayer.life;
  const appliedDelta = nextAmount - previousAmount;
  const nextLife = previousLife - appliedDelta;
  const nextGame = refreshEliminations({
    ...game,
    players: game.players.map((player) =>
      player.id === targetPlayerId
        ? {
            ...player,
            life: nextLife,
          }
        : player,
    ),
    commanderDamage: replaceCommanderDamage(
      game.commanderDamage,
      sourcePlayerId,
      targetPlayerId,
      nextAmount,
    ),
  });

  return updateHistory(nextGame, {
    id: createId("history"),
    type: "commanderDamage",
    payload: {
      sourcePlayerId,
      targetPlayerId,
      previousAmount,
      nextAmount,
      previousLife,
      nextLife,
    },
    timestamp: Date.now(),
  });
}

export function setStatusOwner(
  game: Game,
  statusKey: StatusKey,
  playerId?: string,
): Game {
  const previousPlayerId = game[statusKey];
  if (previousPlayerId === playerId) {
    return game;
  }

  const nextGame = {
    ...game,
    [statusKey]: playerId,
  };

  return updateHistory(nextGame, {
    id: createId("history"),
    type: "status",
    payload: {
      statusKey,
      previousPlayerId,
      nextPlayerId: playerId,
    },
    timestamp: Date.now(),
  });
}

export function randomizeStartingPlayer(game: Game): Game {
  if (game.players.length === 0) {
    return game;
  }

  const randomPlayerId =
    game.players[Math.floor(Math.random() * game.players.length)]?.id;
  return setStatusOwner(game, "startingPlayerId", randomPlayerId);
}

export function undoLastAction(game: Game): Game {
  const lastEntry = game.history.at(-1);
  if (!lastEntry) {
    return game;
  }

  const remainingHistory = game.history.slice(0, -1);

  if (lastEntry.type === "life") {
    const playerId = String(lastEntry.payload.playerId);
    const previousLife = Number(lastEntry.payload.previousLife);

    return refreshEliminations({
      ...game,
      history: remainingHistory,
      players: game.players.map((player) =>
        player.id === playerId
          ? {
              ...player,
              life: previousLife,
            }
          : player,
      ),
    });
  }

  if (lastEntry.type === "counter") {
    const playerId = String(lastEntry.payload.playerId);
    const previousValue = Number(lastEntry.payload.previousValue);
    const counterKey = String(lastEntry.payload.counterKey);

    if (counterKey === "extra") {
      const extraCounterId = String(lastEntry.payload.extraCounterId);
      return refreshEliminations({
        ...game,
        history: remainingHistory,
        players: game.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                extraCounters: player.extraCounters.map((counter) =>
                  counter.id === extraCounterId
                    ? { ...counter, value: previousValue }
                    : counter,
                ),
              }
            : player,
        ),
      });
    }

    return refreshEliminations({
      ...game,
      history: remainingHistory,
      players: game.players.map((player) =>
        player.id === playerId
          ? setPlayerValue(player, counterKey as BuiltInCounterKey, previousValue)
          : player,
      ),
    });
  }

  if (lastEntry.type === "commanderDamage") {
    const sourcePlayerId = String(lastEntry.payload.sourcePlayerId);
    const targetPlayerId = String(lastEntry.payload.targetPlayerId);
    const previousAmount = Number(lastEntry.payload.previousAmount);
    const previousLife = Number(lastEntry.payload.previousLife);

    return refreshEliminations({
      ...game,
      history: remainingHistory,
      players: game.players.map((player) =>
        player.id === targetPlayerId
          ? {
              ...player,
              life: previousLife,
            }
          : player,
      ),
      commanderDamage: replaceCommanderDamage(
        game.commanderDamage,
        sourcePlayerId,
        targetPlayerId,
        previousAmount,
      ),
    });
  }

  if (lastEntry.type === "status") {
    const statusKey = String(lastEntry.payload.statusKey) as StatusKey;
    const previousPlayerId =
      typeof lastEntry.payload.previousPlayerId === "string"
        ? String(lastEntry.payload.previousPlayerId)
        : undefined;

    return {
      ...game,
      history: remainingHistory,
      [statusKey]: previousPlayerId,
    };
  }

  return {
    ...game,
    history: remainingHistory,
  };
}
