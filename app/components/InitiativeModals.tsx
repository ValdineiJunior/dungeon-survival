"use client";

import { InitiativeResult } from "@/app/types/game";

// ─── Dice Choice Panel (inline, replaces hand area) ─────────────────────────

interface InitiativeRollModalProps {
  onRoll: () => void;
  turn: number;
  diceFaces: number[];
}

export function InitiativeRollModal({
  onRoll,
  turn,
  diceFaces,
}: InitiativeRollModalProps) {
  const diceLabel =
    diceFaces.length > 0
      ? diceFaces.map((faces) => `d${faces}`).join(" + ")
      : "dados";
  const minTotal = diceFaces.length || 1;
  const maxTotal =
    diceFaces.length > 0
      ? diceFaces.reduce((sum, faces) => sum + faces, 0)
      : 20;

  return (
    <div className="w-full h-full min-h-52 flex items-center justify-center gap-6 px-4 py-3 bg-slate-900/80 rounded-3xl border border-amber-700/50 backdrop-blur-sm">
      {/* Label */}
      <div className="shrink-0 text-center">
        <div className="text-2xl mb-0.5">🎲</div>
        <div className="text-amber-400 font-bold text-sm leading-tight">
          Iniciativa
        </div>
        <div className="text-slate-500 text-xs">Turno {turn}</div>
      </div>

      <div className="shrink-0 text-slate-600 text-lg">—</div>

      <p className="text-slate-400 text-xs leading-snug hidden sm:block max-w-[200px]">
        Você irá rolar{" "}
        <span className="text-amber-300 font-semibold">{diceLabel}</span> para
        determinar a iniciativa.
        <br />
        <span className="text-amber-400/80">
          Resultado entre {minTotal} e {maxTotal}. Maior valor age primeiro.
        </span>
      </p>

      <div className="shrink-0 text-slate-600 text-lg hidden sm:block">—</div>

      <button
        onClick={onRoll}
        className="group flex flex-col items-center gap-1 px-5 py-3 bg-blue-900/40 hover:bg-blue-800/60 border-2 border-blue-600 hover:border-blue-400 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
      >
        <span className="text-3xl">🎲🎲</span>
        <div className="text-sm font-bold text-blue-300 group-hover:text-white">
          Rolar {diceLabel}
        </div>
        <div className="text-[10px] text-slate-400">
          {minTotal} – {maxTotal} · Dados de iniciativa
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
            <div className="flex items-center gap-0.5">
              {entry.dice.map((d, di) => (
                <span
                  key={di}
                  className={`text-[9px] px-1 py-0.5 rounded font-mono font-bold ${
                    d === entry.highestDie
                      ? "bg-amber-500/30 text-amber-300 border border-amber-600/50"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {d}
                </span>
              ))}
              <span
                className={`ml-1 text-xs font-bold ${entry.entityType === "player" ? "text-emerald-400" : "text-red-400"}`}
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
