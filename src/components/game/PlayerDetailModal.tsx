import { CounterPanel } from "@/components/game/CounterPanel";
import { LifeControls } from "@/components/game/LifeControls";
import { Modal } from "@/components/layout/Modal";
import { getCommanderDamageAmount } from "@/lib/gameLogic";
import type { Game, Player } from "@/types/game";

type PlayerDetailModalProps = {
  game: Game;
  player: Player;
  onClose: () => void;
  onChangeLife: (delta: number) => void;
  onChangeCounter: (
    counterKey: "poison" | "commanderTax" | "energy" | "experience",
    delta: number,
  ) => void;
  onAddExtraCounter: (name: string) => void;
  onChangeExtraCounter: (extraCounterId: string, delta: number) => void;
  onChangeCommanderDamage: (
    sourcePlayerId: string,
    targetPlayerId: string,
    delta: number,
  ) => void;
};

const DAMAGE_STEPS = [-5, -1, 1, 5];

export function PlayerDetailModal({
  game,
  player,
  onClose,
  onChangeLife,
  onChangeCounter,
  onAddExtraCounter,
  onChangeExtraCounter,
  onChangeCommanderDamage,
}: PlayerDetailModalProps) {
  const sources = game.players.filter((entry) => entry.id !== player.id);

  return (
    <Modal title={player.name} onClose={onClose}>
      <div className="space-y-5">
        <section className="rounded-[1.75rem] border border-white/8 bg-slate-950/45 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Life</p>
              <div className="mt-2 text-6xl font-semibold tracking-tight text-white">
                {player.life}
              </div>
            </div>
            <span
              className="h-6 w-6 rounded-full border border-white/20"
              style={{ backgroundColor: player.color }}
            />
          </div>
          <LifeControls onChange={onChangeLife} />
        </section>

        <section className="space-y-3 rounded-[1.75rem] border border-white/8 bg-slate-950/45 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Commander Damage
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Tracked per opposing commander. Changes here also adjust life.
            </p>
          </div>

          <div className="space-y-3">
            {sources.map((source) => {
              const amount = getCommanderDamageAmount(game, source.id, player.id);
              const danger = amount >= 21;

              return (
                <div
                  key={source.id}
                  className={`rounded-[1.5rem] border p-4 ${
                    danger
                      ? "border-rose-400/40 bg-rose-500/10"
                      : "border-white/10 bg-slate-900/80"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full border border-white/15"
                        style={{ backgroundColor: source.color }}
                      />
                      <div>
                        <p className="text-base font-semibold text-white">
                          {source.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                          only this commander
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-semibold ${
                        danger ? "text-rose-300" : "text-white"
                      }`}
                    >
                      {amount}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {DAMAGE_STEPS.map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => onChangeCommanderDamage(source.id, player.id, step)}
                        className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-base font-semibold text-white transition hover:border-cyan-300/40"
                      >
                        {step > 0 ? `+${step}` : step}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white/8 bg-slate-950/45 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            Counters
          </p>
          <CounterPanel
            player={player}
            onChangeCounter={onChangeCounter}
            onAddExtraCounter={onAddExtraCounter}
            onChangeExtraCounter={onChangeExtraCounter}
          />
        </section>
      </div>
    </Modal>
  );
}
