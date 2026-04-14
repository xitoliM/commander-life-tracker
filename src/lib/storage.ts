import type { Game } from "@/types/game";

export const GAME_STORAGE_KEY = "commander-life-tracker.game";

export function loadStoredGame(): Game | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(GAME_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Game;
  } catch {
    window.localStorage.removeItem(GAME_STORAGE_KEY);
    return null;
  }
}

export function saveStoredGame(game: Game | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!game) {
    window.localStorage.removeItem(GAME_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(game));
}

export function clearStoredGame() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GAME_STORAGE_KEY);
}
