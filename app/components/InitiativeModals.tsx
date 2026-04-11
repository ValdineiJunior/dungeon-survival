"use client";

import { useState } from "react";
import { InitiativeResult } from "@/app/types/game";
import { DiceIcon } from "@/app/components/DiceIcon";

// ─── Dice Choice Panel (inline, replaces hand area) ─────────────────────────

interface InitiativeRollModalProps {
  onRoll: (selectedDiceIndices: number[]) => void;
  turn: number;
  diceFaces: number[];
}

export function InitiativeRollModal({
  onRoll,
  turn,
  diceFaces,
}: InitiativeRollModalProps) {
  const pool = diceFaces.length > 0 ? diceFaces : [6];
  const [selected, setSelected] = useState<boolean[]>(() =>
    pool.map(() => true),
  );

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const selectedIndices = selected
    .map((v, i) => (v ? i : -1))
    .filter((i) => i >= 0);
  const selectedFaces = selectedIndices.map((i) => pool[i]);
  const canRoll = selectedIndices.length > 0;

  const diceLabel =
    selectedFaces.length > 0
      ? selectedFaces.map((faces) => `d${faces}`).join(" + ")
      : "dados";
  const minTotal = selectedFaces.length;
  const maxTotal =
    selectedFaces.length > 0
      ? selectedFaces.reduce((sum, faces) => sum + faces, 0)
      : 20;

  const handleRoll = () => {
    if (!canRoll) return;
    onRoll(selectedIndices);
  };

  return (
    <div
      className={`
        flex h-fit w-full max-w-full min-h-30 min-w-0 flex-row items-center justify-center gap-1.5
        px-1 py-0.5 md:min-h-40 md:gap-4 md:px-1.5 md:py-1
      `}
    >
      {/* Label — compact row, same vertical band as Hand */}
      <div className="flex shrink-0 flex-row items-center gap-1 text-center md:flex-col md:gap-0">
        <div className="text-base leading-none md:text-2xl">🎲</div>
        <div>
          <div className="text-[10px] font-bold leading-tight text-amber-400 md:text-sm">
            Iniciativa
          </div>
          <div className="text-[9px] text-slate-500 md:text-xs">Turno {turn}</div>
        </div>
      </div>

      <div className="hidden shrink-0 text-lg text-slate-600 md:block">—</div>

      {/* Pool — one horizontal scroller like the hand */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-0 md:gap-2">
        <p className="hidden px-1 text-center text-[10px] text-slate-400 md:block md:text-xs">
          Selecione os dados que quer rolar. Clique para marcar/desmarcar.
        </p>
        <div
          className={`
            flex max-w-full flex-nowrap items-center justify-center gap-1 overflow-x-auto py-px
            [-webkit-overflow-scrolling:touch] touch-pan-x sm:gap-2
          `}
        >
          {pool.map((faces, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`shrink-0 rounded-md border-2 transition-all duration-200 md:rounded-lg ${
                selected[i]
                  ? "scale-100 border-amber-400 bg-amber-900/30 ring-2 ring-amber-400/50"
                  : "scale-95 border-slate-600 bg-slate-800/50 opacity-50"
              }`}
              title={
                selected[i]
                  ? `d${faces} selecionado (clique para desmarcar)`
                  : `d${faces} (clique para incluir)`
              }
            >
              <DiceIcon faces={faces} size="sm" />
            </button>
          ))}
        </div>
        <p className="hidden max-w-[220px] px-1 text-center text-[9px] text-amber-400/80 md:block md:text-[10px]">
          Menos dados = tende a agir depois. Mais dados = tende a agir primeiro.
        </p>
      </div>

      <div className="hidden shrink-0 text-lg text-slate-600 md:block">—</div>

      <button
        type="button"
        onClick={handleRoll}
        disabled={!canRoll}
        title={`Total possível: ${minTotal}–${maxTotal}. Pelo menos 1 dado.`}
        className={`
          group flex shrink-0 flex-col items-center gap-0.5 rounded-md border-2 border-blue-600 bg-blue-900/40 px-2 py-1
          transition-all duration-200 hover:border-blue-400 hover:bg-blue-800/60 hover:shadow-lg hover:shadow-blue-500/20
          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
          md:gap-2 md:rounded-xl md:px-5 md:py-3 md:hover:scale-105
        `}
      >
        <div className="text-center text-[10px] font-bold text-blue-300 group-hover:text-white md:text-sm">
          Rolar {diceLabel}
        </div>
        <div className="hidden text-center text-[9px] text-slate-400 md:block md:text-[10px]">
          {minTotal} – {maxTotal} · Pelo menos 1 dado
        </div>
      </button>
    </div>
  );
}

// ─── Turn Order Panel (inline, replaces hand area) ───────────────────────────

interface InitiativeOrderModalProps {
  turnOrder: InitiativeResult[];
  turn: number;
}

export function InitiativeOrderModal({
  turnOrder,
  turn,
}: InitiativeOrderModalProps) {
  return (
    <div className="flex h-fit min-h-30 w-full max-w-full min-w-0 items-center gap-1.5 overflow-hidden px-1 py-0.5 md:min-h-40 md:gap-3 md:px-1.5 md:py-1">
      {/* Label */}
      <div className="shrink-0 text-center">
        <div className="text-xl md:text-2xl mb-0.5">⚔️</div>
        <div className="text-amber-400 font-bold text-[10px] md:text-xs leading-tight">
          Ordem
        </div>
        <div className="text-slate-500 text-[10px] md:text-xs">T{turn}</div>
      </div>

      {/* Lista horizontal */}
      <div className="flex min-h-0 min-w-0 flex-1 items-center gap-1 overflow-x-auto py-0.5 md:gap-2 md:py-1">
        {turnOrder.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex min-h-0 min-w-[56px] shrink-0 flex-col items-center gap-0.5 rounded-md border px-1 py-0.5 md:min-w-[72px] md:gap-1 md:rounded-xl md:px-3 md:py-2 ${
              entry.entityType === "player"
                ? "bg-emerald-900/40 border-emerald-700/60"
                : "bg-red-900/20 border-red-800/40"
            }`}
          >
            <div className="flex items-center gap-1">
              <span
                className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full text-[9px] md:text-[10px] font-bold shrink-0 ${
                  i === 0
                    ? "bg-amber-400 text-black"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-base md:text-lg">{entry.emoji}</span>
            </div>
            <div className="text-[9px] md:text-[10px] font-semibold text-white text-center leading-tight max-w-[56px] md:max-w-[64px] truncate">
              {entry.name}
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-0.5 justify-center">
              {entry.dice.map((d, di) => {
                const faces = entry.diceFaces?.[di] ?? 6;
                return (
                  <DiceIcon
                    key={di}
                    faces={faces}
                    value={d}
                    size="sm"
                    highlighted={d === entry.highestDie}
                  />
                );
              })}
              <span
                className={`ml-0.5 text-[10px] md:text-xs font-bold shrink-0 ${entry.entityType === "player" ? "text-emerald-400" : "text-red-400"}`}
              >
                ={entry.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
