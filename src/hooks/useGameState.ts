import { useMemo } from "react";

import {
  addExtraCounter,
  createGame,
  randomizeStartingPlayer,
  removeExtraCounter,
  setStatusOwner,
  undoLastAction,
  updateCommanderDamage,
  updateCounter,
  updateExtraCounter,
  updateLife,
} from "@/lib/gameLogic";
import { GAME_STORAGE_KEY } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { BuiltInCounterKey, CreateGameInput, Game, StatusKey } from "@/types/game";

function parseGame(raw: string) {
  try {
    return JSON.parse(raw) as Game | null;
  } catch {
    return null;
  }
}

function serializeGame(game: Game | null) {
  return JSON.stringify(game);
}

export function useGameState() {
  const { value, setValue, clearValue, hydrated } = useLocalStorage<Game | null>(
    GAME_STORAGE_KEY,
    null,
    parseGame,
    serializeGame,
  );

  const hasActiveGame = Boolean(value);
  const canUndo = Boolean(value?.history.length);

  return useMemo(
    () => ({
      game: value,
      hydrated,
      hasActiveGame,
      canUndo,
      startGame: (input: CreateGameInput) => {
        setValue(createGame(input));
      },
      resetGame: () => {
        clearValue();
      },
      changeLife: (playerId: string, delta: number) => {
        setValue((current) =>
          current ? updateLife(current, playerId, delta) : current,
        );
      },
      changeCounter: (playerId: string, counterKey: BuiltInCounterKey, delta: number) => {
        setValue((current) =>
          current ? updateCounter(current, playerId, counterKey, delta) : current,
        );
      },
      addExtraCounter: (playerId: string, name: string) => {
        setValue((current) =>
          current ? addExtraCounter(current, playerId, name) : current,
        );
      },
      removeExtraCounter: (playerId: string, extraCounterId: string) => {
        setValue((current) =>
          current ? removeExtraCounter(current, playerId, extraCounterId) : current,
        );
      },
      changeExtraCounter: (playerId: string, extraCounterId: string, delta: number) => {
        setValue((current) =>
          current
            ? updateExtraCounter(current, playerId, extraCounterId, delta)
            : current,
        );
      },
      changeCommanderDamage: (
        sourcePlayerId: string,
        targetPlayerId: string,
        delta: number,
      ) => {
        setValue((current) =>
          current
            ? updateCommanderDamage(current, sourcePlayerId, targetPlayerId, delta)
            : current,
        );
      },
      setStatusOwner: (statusKey: StatusKey, playerId?: string) => {
        setValue((current) =>
          current ? setStatusOwner(current, statusKey, playerId) : current,
        );
      },
      randomizeStartingPlayer: () => {
        setValue((current) =>
          current ? randomizeStartingPlayer(current) : current,
        );
      },
      undoLastAction: () => {
        setValue((current) =>
          current ? undoLastAction(current) : current,
        );
      },
    }),
    [value, hydrated, setValue, clearValue, hasActiveGame, canUndo],
  );
}
