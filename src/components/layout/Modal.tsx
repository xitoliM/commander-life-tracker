import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-slate-950/75 p-3 backdrop-blur-sm md:items-center md:justify-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/40"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
