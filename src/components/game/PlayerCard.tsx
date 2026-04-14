import { CounterPanel } from "@/components/game/CounterPanel";
import { LifeControls } from "@/components/game/LifeControls";
import type { Player } from "@/types/game";

type PlayerCardProps = {
  player: Player;
  incomingCommanderDamage: number;
  isMonarch: boolean;
  isInitiative: boolean;
  isStartingPlayer: boolean;
  onChangeLife: (delta: number) => void;
  onChangeCounter: (
    counterKey: "poison" | "commanderTax" | "energy" | "experience",
    delta: number,
  ) => void;
  onAddExtraCounter: (name: string) => void;
  onChangeExtraCounter: (extraCounterId: string, delta: number) => void;
  onOpenCommanderDamage: () => void;
};

export function PlayerCard({
  player,
  incomingCommanderDamage,
  isMonarch,
  isInitiative,
  isStartingPlayer,
  onChangeLife,
  onChangeCounter,
  onAddExtraCounter,
  onChangeExtraCounter,
  onOpenCommanderDamage,
}: PlayerCardProps) {
  return (
    <article
      className={`rounded-[2rem] border p-4 shadow-2xl shadow-slate-950/30 transition ${
        player.eliminated
          ? "border-rose-400/40 bg-slate-900/60 opacity-75"
          : "border-white/8 bg-slate-900/85"
      }`}
      style={{
        backgroundImage: `linear-gradient(145deg, ${player.color}22 0%, rgba(15, 23, 42, 0.92) 28%, rgba(2, 6, 23, 0.98) 100%)`,
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-2">
            {isMonarch ? (
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
                Monarch
              </span>
            ) : null}
            {isInitiative ? (
              <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
                Initiative
              </span>
            ) : null}
            {isStartingPlayer ? (
              <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
                Starts
              </span>
            ) : null}
            {player.eliminated ? (
              <span className="rounded-full border border-rose-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                Eliminated
              </span>
            ) : null}
          </div>
          <h2 className="truncate text-2xl font-semibold text-white">{player.name}</h2>
        </div>

        <span
          className="h-5 w-5 shrink-0 rounded-full border border-white/20"
          style={{ backgroundColor: player.color }}
        />
      </div>

      <div className="mb-4 rounded-[1.75rem] border border-white/8 bg-slate-950/55 px-4 py-5 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Life</p>
        <div className="mt-2 text-6xl font-semibold tracking-tight text-white">
          {player.life}
        </div>
      </div>

      <div className="space-y-3">
        <LifeControls onChange={onChangeLife} />

        <button
          type="button"
          onClick={onOpenCommanderDamage}
          className={`flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
            incomingCommanderDamage >= 21
              ? "border-rose-400/40 bg-rose-500/10"
              : "border-white/8 bg-slate-950/45"
          }`}
        >
          <span>
            <span className="block text-xs uppercase tracking-[0.24em] text-slate-400">
              Commander Damage
            </span>
            <span className="mt-1 block text-sm font-medium text-slate-200">
              Manage incoming totals
            </span>
          </span>
          <span
            className={`text-2xl font-semibold ${
              incomingCommanderDamage >= 21 ? "text-rose-300" : "text-white"
            }`}
          >
            {incomingCommanderDamage}
          </span>
        </button>

        <CounterPanel
          player={player}
          onChangeCounter={onChangeCounter}
          onAddExtraCounter={onAddExtraCounter}
          onChangeExtraCounter={onChangeExtraCounter}
        />
      </div>
    </article>
  );
}
