import { useMemo } from "react";

import {
  addExtraCounter,
  createGame,
  randomizeStartingPlayer,
  setStatusOwner,
  undoLastAction,
  updateCommanderDamage,
  updateCounter,
  updateExtraCounter,
  updateLife,
} from "@/lib/gameLogic";
import { GAME_STORAGE_KEY } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { CreateGameInput, Game, StatusKey } from "@/types/game";

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
  const storage = useLocalStorage<Game | null>(
    GAME_STORAGE_KEY,
    null,
    parseGame,
    serializeGame,
  );

  const hasActiveGame = Boolean(storage.value);
  const canUndo = Boolean(storage.value?.history.length);

  return useMemo(
    () => ({
      game: storage.value,
      hydrated: storage.hydrated,
      hasActiveGame,
      canUndo,
      startGame: (input: CreateGameInput) => {
        storage.setValue(createGame(input));
      },
      resetGame: () => {
        storage.clearValue();
      },
      changeLife: (playerId: string, delta: number) => {
        storage.setValue((current) =>
          current ? updateLife(current, playerId, delta) : current,
        );
      },
      changeCounter: (
        playerId: string,
        counterKey: "poison" | "commanderTax" | "energy" | "experience",
        delta: number,
      ) => {
        storage.setValue((current) =>
          current ? updateCounter(current, playerId, counterKey, delta) : current,
        );
      },
      addExtraCounter: (playerId: string, name: string) => {
        storage.setValue((current) =>
          current ? addExtraCounter(current, playerId, name) : current,
        );
      },
      changeExtraCounter: (
        playerId: string,
        extraCounterId: string,
        delta: number,
      ) => {
        storage.setValue((current) =>
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
        storage.setValue((current) =>
          current
            ? updateCommanderDamage(current, sourcePlayerId, targetPlayerId, delta)
            : current,
        );
      },
      setStatusOwner: (statusKey: StatusKey, playerId?: string) => {
        storage.setValue((current) =>
          current ? setStatusOwner(current, statusKey, playerId) : current,
        );
      },
      randomizeStartingPlayer: () => {
        storage.setValue((current) =>
          current ? randomizeStartingPlayer(current) : current,
        );
      },
      undoLastAction: () => {
        storage.setValue((current) =>
          current ? undoLastAction(current) : current,
        );
      },
    }),
    [canUndo, hasActiveGame, storage],
  );
}
