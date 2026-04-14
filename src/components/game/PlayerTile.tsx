import type { Player } from "@/types/game";

type PlayerTileProps = {
  player: Player;
  isMonarch: boolean;
  isInitiative: boolean;
  isStartingPlayer: boolean;
  onOpen: () => void;
};

export function PlayerTile({
  player,
  isMonarch,
  isInitiative,
  isStartingPlayer,
  onOpen,
}: PlayerTileProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`player-tile relative flex min-h-40 flex-col justify-between overflow-hidden rounded-[2rem] border p-4 text-left shadow-2xl shadow-slate-950/30 transition active:scale-[0.99] ${
        player.eliminated
          ? "border-rose-400/40 bg-slate-900/70"
          : "border-white/10 bg-slate-900/85 hover:border-white/20"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${player.color}44 0%, transparent 34%), linear-gradient(160deg, rgba(15, 23, 42, 0.88) 0%, rgba(2, 6, 23, 0.98) 72%)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-2">
            {isMonarch ? (
              <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                Monarch
              </span>
            ) : null}
            {isInitiative ? (
              <span className="rounded-full bg-cyan-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                Initiative
              </span>
            ) : null}
            {isStartingPlayer ? (
              <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                Starts
              </span>
            ) : null}
          </div>
          <h2 className="truncate text-base font-semibold uppercase tracking-[0.18em] text-white/90">
            {player.name}
          </h2>
        </div>
        <span
          className="mt-1 h-4 w-4 shrink-0 rounded-full border border-white/20"
          style={{ backgroundColor: player.color }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.38em] text-slate-500">
            Life
          </p>
          <div
            className={`mt-2 text-7xl font-semibold tracking-tight sm:text-8xl ${
              player.eliminated ? "text-rose-300" : "text-white"
            }`}
          >
            {player.life}
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] uppercase tracking-[0.28em] text-slate-500">
        Tap for actions
      </div>
    </button>
  );
}
