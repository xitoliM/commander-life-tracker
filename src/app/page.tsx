"use client";

import { useMemo, useState } from "react";

import { PlayerDetailModal } from "@/components/game/PlayerDetailModal";
import { PlayerTile } from "@/components/game/PlayerTile";
import { Modal } from "@/components/layout/Modal";
import { PlayerSetupForm } from "@/components/setup/PlayerSetupForm";
import { useGameState } from "@/hooks/useGameState";

function getBoardLayout(playerCount: number) {
  if (playerCount <= 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }

  if (playerCount === 4) {
    return "grid-cols-2";
  }

  if (playerCount <= 4) {
    return "grid-cols-2";
  }

  return "grid-cols-2 2xl:grid-cols-3";
}

function getSeatClass(playerCount: number, index: number) {
  if (playerCount !== 4) {
    return "";
  }

  const seatMap = ["seat-top-left", "seat-top-right", "seat-bottom-left", "seat-bottom-right"];

  return seatMap[index] ?? "";
}

export default function HomePage() {
  const tracker = useGameState();
  const [showSetup, setShowSetup] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const selectedPlayerIndex = tracker.game?.players.findIndex(
    (player) => player.id === selectedPlayerId,
  );

  const selectedPlayer = useMemo(
    () =>
      tracker.game?.players.find((player) => player.id === selectedPlayerId) ?? null,
    [selectedPlayerId, tracker.game?.players],
  );

  if (!tracker.hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 px-6 py-8 text-center text-slate-200">
          Loading saved table state...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#020617_45%,_#020617_100%)]">
      <div className="portrait-blocker">
        <div className="mx-4 rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 text-center shadow-2xl shadow-slate-950/50">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/70">
            Landscape only
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Rotate your phone
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            This table layout is optimized for landscape play so every player panel
            stays large and easy to tap.
          </p>
        </div>
      </div>

      <div className="landscape-only-mobile">
        <div className="board-shell mx-auto max-w-[100rem] px-2 py-2">
          {!tracker.game && !showSetup ? (
            <section className="mx-auto mt-12 max-w-3xl rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-6 text-center shadow-2xl shadow-slate-950/40">
              <p className="text-xs uppercase tracking-[0.38em] text-cyan-300/70">
                Static Next.js app
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">
                Fast commander tracking for the whole table
              </h2>
              <p className="mt-4 text-balance text-base text-slate-300">
                Track life, commander damage, poison, tax, monarch and initiative.
                Everything stays local in the browser and survives a reload.
              </p>
              <button
                type="button"
                onClick={() => setShowSetup(true)}
                className="mt-8 rounded-full bg-cyan-300 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                New Game
              </button>
            </section>
          ) : null}

          {showSetup ? (
            <PlayerSetupForm
              onCancel={() => setShowSetup(false)}
              onStart={(input) => {
                tracker.startGame(input);
                setShowSetup(false);
                setShowMenu(false);
                setSelectedPlayerId(null);
              }}
            />
          ) : null}

          {tracker.game && !showSetup ? (
            <div className="relative">
              <section
                className={`grid auto-rows-fr gap-4 ${getBoardLayout(
                  tracker.game.players.length,
                )} ${
                  tracker.game.players.length === 4 ? "board-grid-4" : ""
                } board-surface min-h-[calc(100dvh-1rem)]`}
              >
                {tracker.game.players.map((player, index) => {
                  return (
                    <PlayerTile
                      key={player.id}
                      className={getSeatClass(tracker.game!.players.length, index)}
                      player={player}
                      isMonarch={tracker.game?.monarchPlayerId === player.id}
                      isInitiative={tracker.game?.initiativePlayerId === player.id}
                      isStartingPlayer={tracker.game?.startingPlayerId === player.id}
                      onOpen={() => setSelectedPlayerId(player.id)}
                    />
                  );
                })}
              </section>

              <button
                type="button"
                onClick={() => setShowMenu(true)}
                className={`game-menu-button rounded-full border border-white/12 bg-slate-900/92 px-5 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-white shadow-2xl shadow-slate-950/60 transition hover:border-cyan-300/40 hover:text-cyan-100 ${
                  tracker.game.players.length === 4 ? "game-menu-button-center" : ""
                }`}
              >
                Menu
              </button>
            </div>
          ) : null}
        </div>

        {tracker.game && selectedPlayer ? (
          <PlayerDetailModal
            game={tracker.game}
            player={selectedPlayer}
            upsideDown={tracker.game.players.length === 4 && (selectedPlayerIndex ?? -1) < 2}
            onClose={() => setSelectedPlayerId(null)}
            onChangeLife={(delta) => tracker.changeLife(selectedPlayer.id, delta)}
            onChangeCounter={(counterKey, delta) =>
              tracker.changeCounter(selectedPlayer.id, counterKey, delta)
            }
            onAddExtraCounter={(name) => tracker.addExtraCounter(selectedPlayer.id, name)}
            onChangeExtraCounter={(extraCounterId, delta) =>
              tracker.changeExtraCounter(selectedPlayer.id, extraCounterId, delta)
            }
            onChangeCommanderDamage={tracker.changeCommanderDamage}
          />
        ) : null}

        {tracker.game && showMenu ? (
          <Modal title="Game Menu" onClose={() => setShowMenu(false)}>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => {
                  tracker.undoLastAction();
                  setShowMenu(false);
                }}
                disabled={!tracker.canUndo}
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-base font-semibold text-white transition hover:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Undo last action
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setShowSetup(true);
                  setSelectedPlayerId(null);
                }}
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-base font-semibold text-white transition hover:border-white/25"
              >
                New game
              </button>
              <button
                type="button"
                onClick={() => {
                  tracker.resetGame();
                  setSelectedPlayerId(null);
                  setShowSetup(false);
                  setShowMenu(false);
                }}
                className="min-h-14 rounded-2xl bg-rose-500 px-4 py-3 text-left text-base font-semibold text-slate-950 transition hover:bg-rose-400"
              >
                Reset current game
              </button>
            </div>
          </Modal>
        ) : null}
      </div>
    </main>
  );
}
