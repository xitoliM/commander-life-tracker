import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end overflow-y-auto bg-slate-950/75 p-2 backdrop-blur-sm overscroll-contain md:items-center md:justify-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-950/40 md:max-h-[calc(100dvh-2rem)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-[2rem] border-b border-white/8 bg-slate-900/95 px-5 py-4 backdrop-blur">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-5 pt-4 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
