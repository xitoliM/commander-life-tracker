type LifeControlsProps = {
  onChange: (delta: number) => void;
};

const LIFE_STEPS = [
  { label: "-5", delta: -5, accent: "from-rose-500/90 to-orange-500/80" },
  { label: "-1", delta: -1, accent: "from-rose-400/80 to-rose-500/70" },
  { label: "+1", delta: 1, accent: "from-emerald-400/80 to-teal-400/70" },
  { label: "+5", delta: 5, accent: "from-cyan-400/80 to-blue-500/80" },
];

export function LifeControls({ onChange }: LifeControlsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {LIFE_STEPS.map((step) => (
        <button
          key={step.label}
          type="button"
          onClick={() => onChange(step.delta)}
          className={`min-h-14 rounded-2xl bg-gradient-to-br ${step.accent} px-3 py-3 text-lg font-semibold text-slate-950 shadow-lg shadow-slate-950/30 transition active:scale-[0.98]`}
        >
          {step.label}
        </button>
      ))}
    </div>
  );
}
