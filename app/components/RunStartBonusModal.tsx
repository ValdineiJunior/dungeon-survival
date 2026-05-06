"use client";

import { useState } from "react";

import type { RunStartRewardPick } from "@/app/types/game";

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export const RUN_START_GOLD_OPTIONS = [25, 50, 75] as const;

const DEFAULT_CARD_BOOSTS: {
  pick: Extract<RunStartRewardPick, { kind: "defaultEnhance" }>;
  label: string;
  hint: string;
}[] = [
  {
    pick: {
      kind: "defaultEnhance",
      role: "movement",
      field: "movement",
      delta: 1,
    },
    label: "+1 movimento",
    hint: "carta padrão de movimento",
  },
  {
    pick: {
      kind: "defaultEnhance",
      role: "attack",
      field: "damage",
      delta: 1,
    },
    label: "+1 ataque",
    hint: "carta padrão de ataque",
  },
  {
    pick: {
      kind: "defaultEnhance",
      role: "defense",
      field: "block",
      delta: 1,
    },
    label: "+1 defesa",
    hint: "carta padrão de bloqueio",
  },
];

const DEFAULT_CARD_COST_REDUCTIONS: {
  pick: Extract<RunStartRewardPick, { kind: "defaultEnhance" }>;
  label: string;
  hint: string;
}[] = [
  {
    pick: {
      kind: "defaultEnhance",
      role: "movement",
      field: "cost",
      delta: -1,
    },
    label: "−1 custo",
    hint: "carta padrão de movimento",
  },
  {
    pick: {
      kind: "defaultEnhance",
      role: "attack",
      field: "cost",
      delta: -1,
    },
    label: "−1 custo",
    hint: "carta padrão de ataque",
  },
  {
    pick: {
      kind: "defaultEnhance",
      role: "defense",
      field: "cost",
      delta: -1,
    },
    label: "−1 custo",
    hint: "carta padrão de defesa",
  },
];

interface RunStartBonusModalProps {
  onPick: (pick: RunStartRewardPick) => void;
}

export function RunStartBonusModal({ onPick }: RunStartBonusModalProps) {
  const [{ goldAmount, boostEntry, costEntry }] = useState(() => ({
    goldAmount: pickRandom(RUN_START_GOLD_OPTIONS),
    boostEntry: pickRandom(DEFAULT_CARD_BOOSTS),
    costEntry: pickRandom(DEFAULT_CARD_COST_REDUCTIONS),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-start-bonus-title"
        className="my-4 w-full max-w-lg rounded-2xl border-2 border-amber-500/70 bg-slate-800 p-5 shadow-2xl md:max-w-2xl md:p-8"
      >
        <div className="mb-2 text-center text-4xl" aria-hidden>
          ✨
        </div>
        <h2
          id="run-start-bonus-title"
          className="mb-2 text-center text-xl font-bold text-amber-400 md:text-2xl"
        >
          Recompensa de partida
        </h2>
        <p className="mb-6 text-center text-sm text-slate-300 md:text-base">
          Escolha uma recompensa antes de continuar.
        </p>

        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Ouro
        </p>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <button
            type="button"
            onClick={() => onPick({ kind: "gold", amount: goldAmount })}
            className="flex flex-1 cursor-pointer flex-col items-center rounded-xl border-2 border-yellow-600/60 bg-linear-to-b from-yellow-900/40 to-amber-950/60 px-4 py-4 text-center transition-colors hover:border-amber-400 hover:from-yellow-800/50 hover:to-amber-900/70 sm:min-w-[6.5rem]"
          >
            <span className="text-lg font-bold tabular-nums text-yellow-200 md:text-xl">
              {goldAmount}
            </span>
            <span className="mt-1 text-xs font-medium text-yellow-100/80">
              ouro
            </span>
          </button>
        </div>

        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Cartas padrão
        </p>
        <p className="mb-3 text-center text-xs text-slate-500">
          Bônus nesta corrida apenas (até o fim da partida).
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <button
            key={`${boostEntry.pick.role}-${boostEntry.pick.field}-up`}
            type="button"
            onClick={() => onPick(boostEntry.pick)}
            className="flex flex-1 cursor-pointer flex-col items-center rounded-xl border-2 border-violet-600/60 bg-linear-to-b from-violet-950/50 to-slate-900/80 px-3 py-4 text-center transition-colors hover:border-violet-400 hover:from-violet-900/50 sm:min-w-[6.5rem]"
          >
            <span className="text-lg font-bold text-violet-200 md:text-xl">
              {boostEntry.label}
            </span>
            <span className="mt-1 text-xs font-medium text-violet-200/70">
              {boostEntry.hint}
            </span>
          </button>
        </div>

        <p className="mb-2 mt-8 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Menos custo (padrão)
        </p>
        <p className="mb-3 text-center text-xs text-slate-500">
          −1 de custo na carta indicada (mínimo 0 nesta corrida).
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <button
            key={`${costEntry.pick.role}-${costEntry.pick.field}-down`}
            type="button"
            onClick={() => onPick(costEntry.pick)}
            className="flex flex-1 cursor-pointer flex-col items-center rounded-xl border-2 border-emerald-700/60 bg-linear-to-b from-emerald-950/50 to-slate-900/80 px-3 py-4 text-center transition-colors hover:border-emerald-400 hover:from-emerald-900/45 sm:min-w-[6.5rem]"
          >
            <span className="text-lg font-bold text-emerald-200 md:text-xl">
              {costEntry.label}
            </span>
            <span className="mt-1 text-xs font-medium text-emerald-200/75">
              {costEntry.hint}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
