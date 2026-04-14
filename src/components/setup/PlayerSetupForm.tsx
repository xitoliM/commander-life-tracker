import { useEffect, useState } from "react";

import { PLAYER_COLORS } from "@/lib/gameLogic";
import type { CreateGameInput, PlayerSetup } from "@/types/game";

type PlayerSetupFormProps = {
  onStart: (input: CreateGameInput) => void;
  onCancel: () => void;
};

function createDefaultPlayers(count: number): PlayerSetup[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `Player ${index + 1}`,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  }));
}

export function PlayerSetupForm({ onStart, onCancel }: PlayerSetupFormProps) {
  const [playerCount, setPlayerCount] = useState(4);
  const [startingLife, setStartingLife] = useState(40);
  const [randomizeStartingPlayer, setRandomizeStartingPlayer] = useState(true);
  const [players, setPlayers] = useState<PlayerSetup[]>(createDefaultPlayers(4));

  useEffect(() => {
    setPlayers((current) => {
      const next = current.slice(0, playerCount);

      while (next.length < playerCount) {
        next.push({
          name: `Player ${next.length + 1}`,
          color: PLAYER_COLORS[next.length % PLAYER_COLORS.length],
        });
      }

      return next;
    });
  }, [playerCount]);

  return (
    <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900/85 p-5 shadow-2xl shadow-slate-950/40">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">
            Setup
          </p>
          <h2 className="text-2xl font-semibold text-white">Start a new commander game</h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <label className="rounded-[1.5rem] border border-white/8 bg-slate-950/40 p-4">
          <span className="mb-2 block text-sm font-medium text-slate-200">Players</span>
          <select
            value={playerCount}
            onChange={(event) => setPlayerCount(Number(event.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
          >
            {[2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-[1.5rem] border border-white/8 bg-slate-950/40 p-4">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Starting life
          </span>
          <input
            type="number"
            min={1}
            value={startingLife}
            onChange={(event) => setStartingLife(Number(event.target.value) || 1)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
          />
        </label>
      </div>

      <div className="mb-6 space-y-3">
        {players.map((player, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-[1.5rem] border border-white/8 bg-slate-950/40 p-4 sm:grid-cols-[1fr_180px]"
          >
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Name
              </span>
              <input
                value={player.name}
                onChange={(event) =>
                  setPlayers((current) =>
                    current.map((entry, playerIndex) =>
                      playerIndex === index
                        ? { ...entry, name: event.target.value }
                        : entry,
                    ),
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Accent color
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={player.color}
                  onChange={(event) =>
                    setPlayers((current) =>
                      current.map((entry, playerIndex) =>
                        playerIndex === index
                          ? { ...entry, color: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                >
                  {PLAYER_COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <span
                  className="h-10 w-10 rounded-full border border-white/10"
                  style={{ backgroundColor: player.color }}
                />
              </div>
            </label>
          </div>
        ))}
      </div>

      <label className="mb-6 flex items-center gap-3 rounded-[1.5rem] border border-white/8 bg-slate-950/40 p-4">
        <input
          type="checkbox"
          checked={randomizeStartingPlayer}
          onChange={(event) => setRandomizeStartingPlayer(event.target.checked)}
          className="h-5 w-5 rounded border-white/10 bg-slate-950 text-cyan-300"
        />
        <span className="text-sm text-slate-200">Pick a random starting player</span>
      </label>

      <button
        type="button"
        onClick={() =>
          onStart({
            playerCount,
            startingLife,
            players,
            randomizeStartingPlayer,
          })
        }
        className="w-full rounded-[1.5rem] bg-cyan-300 px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-200"
      >
        Start Game
      </button>
    </section>
  );
}
