"use client";

import { useMemo, useState } from "react";

import { CommanderDamageModal } from "@/components/game/CommanderDamageModal";
import { PlayerCard } from "@/components/game/PlayerCard";
import { StatusBar } from "@/components/game/StatusBar";
import { Header } from "@/components/layout/Header";
import { PlayerSetupForm } from "@/components/setup/PlayerSetupForm";
import { useGameState } from "@/hooks/useGameState";

export default function HomePage() {
  const tracker = useGameState();
  const [showSetup, setShowSetup] = useState(false);
  const [commanderTargetId, setCommanderTargetId] = useState<string | null>(null);

  const commanderTarget = useMemo(
    () =>
      tracker.game?.players.find((player) => player.id === commanderTargetId) ?? null,
    [commanderTargetId, tracker.game?.players],
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#020617_45%,_#020617_100%)] pb-10">
      <Header
        hasGame={tracker.hasActiveGame}
        canUndo={tracker.canUndo}
        onUndo={tracker.undoLastAction}
        onNewGame={() => setShowSetup(true)}
        onReset={() => {
          tracker.resetGame();
          setCommanderTargetId(null);
          setShowSetup(false);
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-6">
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
              setCommanderTargetId(null);
            }}
          />
        ) : null}

        {tracker.game ? (
          <div className="space-y-5">
            <StatusBar
              players={tracker.game.players}
              monarchPlayerId={tracker.game.monarchPlayerId}
              initiativePlayerId={tracker.game.initiativePlayerId}
              startingPlayerId={tracker.game.startingPlayerId}
              onSetStatusOwner={tracker.setStatusOwner}
              onRandomizeStartingPlayer={tracker.randomizeStartingPlayer}
            />

            <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {tracker.game.players.map((player) => {
                const incomingCommanderDamage = tracker.game!.commanderDamage
                  .filter((entry) => entry.targetPlayerId === player.id)
                  .reduce((total, entry) => total + entry.amount, 0);

                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    incomingCommanderDamage={incomingCommanderDamage}
                    isMonarch={tracker.game?.monarchPlayerId === player.id}
                    isInitiative={tracker.game?.initiativePlayerId === player.id}
                    isStartingPlayer={tracker.game?.startingPlayerId === player.id}
                    onChangeLife={(delta) => tracker.changeLife(player.id, delta)}
                    onChangeCounter={(counterKey, delta) =>
                      tracker.changeCounter(player.id, counterKey, delta)
                    }
                    onAddExtraCounter={(name) =>
                      tracker.addExtraCounter(player.id, name)
                    }
                    onChangeExtraCounter={(extraCounterId, delta) =>
                      tracker.changeExtraCounter(player.id, extraCounterId, delta)
                    }
                    onOpenCommanderDamage={() => setCommanderTargetId(player.id)}
                  />
                );
              })}
            </section>
          </div>
        ) : null}
      </div>

      {tracker.game && commanderTarget ? (
        <CommanderDamageModal
          game={tracker.game}
          targetPlayer={commanderTarget}
          onClose={() => setCommanderTargetId(null)}
          onChangeCommanderDamage={tracker.changeCommanderDamage}
        />
      ) : null}
    </main>
  );
}
