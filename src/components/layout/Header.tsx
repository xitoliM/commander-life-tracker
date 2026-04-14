type HeaderProps = {
  canUndo: boolean;
  hasGame: boolean;
  onUndo: () => void;
  onNewGame: () => void;
  onReset: () => void;
};

export function Header({
  canUndo,
  hasGame,
  onUndo,
  onNewGame,
  onReset,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">
            Commander Life Tracker
          </p>
          <h1 className="text-lg font-semibold text-white">Table-ready EDH board</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/60 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
          >
            New Game
          </button>
          {hasGame ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-400"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
