import type { ReactNode } from "react";

import type { Player, StatusKey } from "@/types/game";

type StatusBarProps = {
  players: Player[];
  monarchPlayerId?: string;
  initiativePlayerId?: string;
  startingPlayerId?: string;
  onSetStatusOwner: (statusKey: StatusKey, playerId?: string) => void;
  onRandomizeStartingPlayer: () => void;
};

function StatusRow({
  title,
  accentClass,
  statusKey,
  currentPlayerId,
  players,
  onSetStatusOwner,
  action,
}: {
  title: string;
  accentClass: string;
  statusKey: StatusKey;
  currentPlayerId?: string;
  players: Player[];
  onSetStatusOwner: (statusKey: StatusKey, playerId?: string) => void;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-slate-900/70 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentClass}`}>
          {title}
        </p>
        {action}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSetStatusOwner(statusKey, undefined)}
          className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
            !currentPlayerId
              ? "border-white/30 bg-white/10 text-white"
              : "border-white/10 text-slate-300 hover:border-white/20"
          }`}
        >
          None
        </button>
        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => onSetStatusOwner(statusKey, player.id)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
              currentPlayerId === player.id
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-slate-300 hover:border-white/20"
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatusBar({
  players,
  monarchPlayerId,
  initiativePlayerId,
  startingPlayerId,
  onSetStatusOwner,
  onRandomizeStartingPlayer,
}: StatusBarProps) {
  return (
    <section className="grid gap-3 lg:grid-cols-3">
      <StatusRow
        title="Monarch"
        accentClass="text-amber-300"
        statusKey="monarchPlayerId"
        currentPlayerId={monarchPlayerId}
        players={players}
        onSetStatusOwner={onSetStatusOwner}
      />
      <StatusRow
        title="Initiative"
        accentClass="text-cyan-300"
        statusKey="initiativePlayerId"
        currentPlayerId={initiativePlayerId}
        players={players}
        onSetStatusOwner={onSetStatusOwner}
      />
      <StatusRow
        title="Starting Player"
        accentClass="text-emerald-300"
        statusKey="startingPlayerId"
        currentPlayerId={startingPlayerId}
        players={players}
        onSetStatusOwner={onSetStatusOwner}
        action={
          <button
            type="button"
            onClick={onRandomizeStartingPlayer}
            className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-emerald-300/40"
          >
            Random
          </button>
        }
      />
    </section>
  );
}
