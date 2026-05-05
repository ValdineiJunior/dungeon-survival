"use client";

export const RUN_START_GOLD_OPTIONS = [25, 50, 75] as const;
export type RunStartGoldAmount = (typeof RUN_START_GOLD_OPTIONS)[number];

interface RunStartBonusModalProps {
  onPick: (amount: RunStartGoldAmount) => void;
}

export function RunStartBonusModal({ onPick }: RunStartBonusModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-start-bonus-title"
        className="w-full max-w-lg rounded-2xl border-2 border-amber-500/70 bg-slate-800 p-5 shadow-2xl md:p-8"
      >
        <div className="mb-2 text-center text-4xl" aria-hidden>
          ✨
        </div>
        <h2
          id="run-start-bonus-title"
          className="mb-2 text-center text-xl font-bold text-amber-400 md:text-2xl"
        >
          Recompensa inicial
        </h2>
        <p className="mb-6 text-center text-sm text-slate-300 md:text-base">
          Escolha uma recompensa antes de continuar.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {RUN_START_GOLD_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onPick(amount)}
              className="flex flex-1 cursor-pointer flex-col items-center rounded-xl border-2 border-yellow-600/60 bg-linear-to-b from-yellow-900/40 to-amber-950/60 px-4 py-4 text-center transition-colors hover:border-amber-400 hover:from-yellow-800/50 hover:to-amber-900/70 sm:min-w-[6.5rem]"
            >
              <span className="text-2xl font-bold tabular-nums text-yellow-200">
                {amount}
              </span>
              <span className="text-xs font-medium text-yellow-100/80">
                ouro
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
