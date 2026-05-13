import { useState } from "react";

import type { BuiltInCounterKey, ExtraCounter, Player } from "@/types/game";

type CounterPanelProps = {
  player: Player;
  onChangeCounter: (counterKey: BuiltInCounterKey, delta: number) => void;
  onAddExtraCounter: (name: string) => void;
  onChangeExtraCounter: (extraCounterId: string, delta: number) => void;
  onRemoveExtraCounter: (extraCounterId: string) => void;
};

function CounterRow({
  label,
  value,
  onMinus,
  onPlus,
  danger,
}: {
  label: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  danger?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded-2xl border border-white/8 bg-slate-950/50 px-3 py-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button
        type="button"
        onClick={onMinus}
        className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30"
      >
        -
      </button>
      <span
        className={`min-w-10 text-center text-lg font-semibold ${danger ? "text-rose-300" : "text-white"}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onPlus}
        className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:text-cyan-100"
      >
        +
      </button>
    </div>
  );
}

function ExtraCounterRow({
  counter,
  onChange,
  onRemove,
}: {
  counter: ExtraCounter;
  onChange: (delta: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 rounded-2xl border border-white/8 bg-slate-950/50 px-3 py-2">
      <span className="text-sm font-medium text-slate-300">{counter.name}</span>
      <button
        type="button"
        onClick={() => onChange(-1)}
        className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30"
      >
        -
      </button>
      <span className="min-w-10 text-center text-lg font-semibold text-white">
        {counter.value}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:text-cyan-100"
      >
        +
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-rose-400 transition hover:border-rose-400/40 hover:bg-rose-400/10"
        aria-label={`Remove ${counter.name} counter`}
      >
        ×
      </button>
    </div>
  );
}

export function CounterPanel({
  player,
  onChangeCounter,
  onAddExtraCounter,
  onChangeExtraCounter,
  onRemoveExtraCounter,
}: CounterPanelProps) {
  const [extraCounterName, setExtraCounterName] = useState("");

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <CounterRow
          label="Poison"
          value={player.poison}
          onMinus={() => onChangeCounter("poison", -1)}
          onPlus={() => onChangeCounter("poison", 1)}
          danger={player.poison >= 10}
        />
        <CounterRow
          label="Commander Tax"
          value={player.commanderTax}
          onMinus={() => onChangeCounter("commanderTax", -1)}
          onPlus={() => onChangeCounter("commanderTax", 1)}
        />
        <CounterRow
          label="Energy"
          value={player.energy}
          onMinus={() => onChangeCounter("energy", -1)}
          onPlus={() => onChangeCounter("energy", 1)}
        />
        <CounterRow
          label="Experience"
          value={player.experience}
          onMinus={() => onChangeCounter("experience", -1)}
          onPlus={() => onChangeCounter("experience", 1)}
        />
      </div>

      {player.extraCounters.length > 0 ? (
        <div className="grid gap-2">
          {player.extraCounters.map((counter) => (
            <ExtraCounterRow
              key={counter.id}
              counter={counter}
              onChange={(delta) => onChangeExtraCounter(counter.id, delta)}
              onRemove={() => onRemoveExtraCounter(counter.id)}
            />
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={extraCounterName}
          onChange={(event) => setExtraCounterName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && extraCounterName.trim()) {
              onAddExtraCounter(extraCounterName);
              setExtraCounterName("");
            }
          }}
          placeholder="Add custom counter"
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
        />
        <button
          type="button"
          onClick={() => {
            onAddExtraCounter(extraCounterName);
            setExtraCounterName("");
          }}
          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
        >
          Add
        </button>
      </div>
    </div>
  );
}
