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
    pool.map(() => true)
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
    <div className="w-full h-full min-h-52 flex items-center justify-center gap-4 sm:gap-6 px-4 py-3 bg-slate-900/80 rounded-3xl border border-amber-700/50 backdrop-blur-sm">
      {/* Label */}
      <div className="shrink-0 text-center">
        <div className="text-2xl mb-0.5">🎲</div>
        <div className="text-amber-400 font-bold text-sm leading-tight">
          Iniciativa
        </div>
        <div className="text-slate-500 text-xs">Turno {turn}</div>
      </div>

      <div className="shrink-0 text-slate-600 text-lg">—</div>

      {/* Pool: clickable dice */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-slate-400 text-xs text-center">
          Selecione os dados que quer rolar. Clique para marcar/desmarcar.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {pool.map((faces, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`rounded-lg border-2 transition-all duration-200 ${
                selected[i]
                  ? "border-amber-400 bg-amber-900/30 ring-2 ring-amber-400/50 scale-100"
                  : "border-slate-600 bg-slate-800/50 opacity-50 scale-95"
              }`}
              title={selected[i] ? `d${faces} selecionado (clique para desmarcar)` : `d${faces} (clique para incluir)`}
            >
              <DiceIcon faces={faces} size="lg" />
            </button>
          ))}
        </div>
        <p className="text-amber-400/80 text-[10px] text-center max-w-[180px]">
          Menos dados = tende a agir depois. Mais dados = tende a agir primeiro.
        </p>
      </div>

      <div className="shrink-0 text-slate-600 text-lg hidden sm:block">—</div>

      <button
        onClick={handleRoll}
        disabled={!canRoll}
        className="group flex flex-col items-center gap-2 px-5 py-3 bg-blue-900/40 hover:bg-blue-800/60 border-2 border-blue-600 hover:border-blue-400 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="text-sm font-bold text-blue-300 group-hover:text-white">
          Rolar {diceLabel}
        </div>
        <div className="text-[10px] text-slate-400">
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
    <div className="w-full h-full min-h-52 flex items-center gap-3 px-4 py-3 bg-slate-900/80 rounded-3xl border border-amber-700/50 backdrop-blur-sm overflow-hidden">
      {/* Label */}
      <div className="shrink-0 text-center">
        <div className="text-2xl mb-0.5">⚔️</div>
        <div className="text-amber-400 font-bold text-xs leading-tight">
          Ordem
        </div>
        <div className="text-slate-500 text-xs">T{turn}</div>
      </div>

      {/* Horizontal scrollable list */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide">
        {turnOrder.map((entry, i) => (
          <div
            key={entry.id}
            className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border min-w-[72px] ${
              entry.entityType === "player"
                ? "bg-emerald-900/40 border-emerald-700/60"
                : "bg-red-900/20 border-red-800/40"
            }`}
          >
            {/* Position badge + emoji */}
            <div className="flex items-center gap-1">
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                  i === 0
                    ? "bg-amber-400 text-black"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-lg">{entry.emoji}</span>
            </div>
            {/* Name */}
            <div className="text-[10px] font-semibold text-white text-center leading-tight max-w-[64px] truncate">
              {entry.name}
            </div>
            {/* Dice + total */}
            <div className="flex items-center gap-0.5 flex-wrap justify-center">
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
                className={`ml-0.5 text-xs font-bold ${entry.entityType === "player" ? "text-emerald-400" : "text-red-400"}`}
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
