import { Modal } from "@/components/layout/Modal";
import { getCommanderDamageAmount } from "@/lib/gameLogic";
import type { Game, Player } from "@/types/game";

type CommanderDamageModalProps = {
  game: Game;
  targetPlayer: Player;
  onClose: () => void;
  onChangeCommanderDamage: (
    sourcePlayerId: string,
    targetPlayerId: string,
    delta: number,
  ) => void;
};

const DAMAGE_STEPS = [-5, -1, 1, 5];

export function CommanderDamageModal({
  game,
  targetPlayer,
  onClose,
  onChangeCommanderDamage,
}: CommanderDamageModalProps) {
  const sources = game.players.filter((player) => player.id !== targetPlayer.id);

  return (
    <Modal title={`Commander Damage vs ${targetPlayer.name}`} onClose={onClose}>
      <div className="space-y-3">
        {sources.map((source) => {
          const amount = getCommanderDamageAmount(game, source.id, targetPlayer.id);
          const danger = amount >= 21;

          return (
            <div
              key={source.id}
              className={`rounded-[1.5rem] border p-4 ${
                danger
                  ? "border-rose-400/40 bg-rose-500/10"
                  : "border-white/10 bg-slate-950/50"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full border border-white/15"
                    style={{ backgroundColor: source.color }}
                  />
                  <div>
                    <p className="text-lg font-semibold text-white">{source.name}</p>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      attacking commander
                    </p>
                  </div>
                </div>
                <div className={`text-3xl font-semibold ${danger ? "text-rose-300" : "text-white"}`}>
                  {amount}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {DAMAGE_STEPS.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() =>
                      onChangeCommanderDamage(source.id, targetPlayer.id, step)
                    }
                    className="min-h-12 rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-base font-semibold text-white transition hover:border-cyan-300/40"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
