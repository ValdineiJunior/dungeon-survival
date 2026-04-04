"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Player,
  CharacterClassDefinition,
  InnateAbility,
} from "@/app/types/game";
import { DiceIcon } from "./DiceIcon";

interface PlayerStatusProps {
  player: Player;
  deckCount: number;
  discardCount: number;
  classDef: CharacterClassDefinition;
  onViewDeck: () => void;
  onViewDiscard: () => void;
}

export function PlayerStatus({
  player,
  deckCount,
  discardCount,
  classDef,
  onViewDeck,
  onViewDiscard,
}: PlayerStatusProps) {
  const hpPercentage = (player.hp / player.maxHp) * 100;
  const [innateDetail, setInnateDetail] = useState<InnateAbility | null>(null);

  return (
    <div className="flex h-full min-w-0 max-w-full flex-col gap-4 rounded-xl border border-slate-600 bg-slate-800/80 p-3 backdrop-blur-sm sm:p-4">
      {/* Nome + avatar */}
      <div className="text-center">
        <h3 className="mb-2 text-amber-400 font-bold lg:mb-3">
          {classDef.name}
        </h3>
        <div className="mx-auto size-14 shrink-0 overflow-hidden rounded border-2 border-amber-500/50 bg-slate-700 lg:size-32 lg:rounded-lg">
          <img
            src={classDef.imageUrl}
            alt={classDef.name}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-slate-600" />

      {/* HP */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-red-400 shrink-0">❤️ Vida</span>
        <span
          className={`inline-flex min-w-0 shrink-0 items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-xs font-bold tabular-nums transition-colors ${
            player.hp <= 0
              ? "border-gray-600 bg-gray-600 text-slate-300"
              : hpPercentage > 50
                ? "border-red-600 bg-red-500 text-white shadow-md shadow-red-500/30"
                : hpPercentage > 25
                  ? "border-orange-600 bg-orange-500 text-slate-900 shadow-md shadow-orange-500/25"
                  : "border-red-800 bg-red-700 text-white shadow-md shadow-red-900/40"
          }`}
        >
          {player.hp}/{player.maxHp}
        </span>
      </div>

      {/* Bloqueio */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-blue-400 shrink-0">🛡️ Bloqueio</span>
        <span
          className={`inline-flex min-w-0 shrink-0 items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-xs font-bold tabular-nums transition-colors ${
            player.block > 0
              ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
              : "border-gray-600 bg-gray-600 text-slate-300"
          }`}
        >
          {player.block}
        </span>
      </div>

      {/* Energia */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-amber-400 shrink-0">⚡ Energia</span>
        <span
          className={`inline-flex min-w-0 shrink-0 items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-xs font-bold tabular-nums transition-colors ${
            player.energy > 0
              ? "border-amber-500 bg-amber-400 text-slate-900 shadow-md shadow-amber-400/35"
              : "border-gray-600 bg-gray-600 text-slate-300"
          }`}
        >
          {player.energy}/{player.maxEnergy}
        </span>
      </div>

      {/* Separador */}
      <div className="border-t border-slate-600" />

      {/* Iniciativa */}
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="min-w-0 flex-1 truncate text-left text-xs tracking-wide text-slate-500">
          Iniciativa
        </span>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
          {(classDef.initiativeDice ?? [6, 6, 6]).map((faces, i) => (
            <DiceIcon key={i} faces={faces} size="sm" />
          ))}
        </div>
      </div>

      {/* Habilidades Inatas (linha própria; só ícones) */}
      {classDef.innateAbilities.length > 0 && (
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="min-w-0 flex-1 truncate text-left text-xs tracking-wide text-slate-500">
            Habilidades Inatas
          </span>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
            {classDef.innateAbilities.map((ability, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInnateDetail(ability)}
                title={ability.name}
                aria-label={`Habilidade inata: ${ability.name}`}
                className="flex size-7 items-center justify-center rounded-md border border-slate-600 bg-slate-700/80 text-sm leading-none transition-colors hover:border-amber-500/50 hover:bg-slate-600"
              >
                {ability.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {innateDetail &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setInnateDetail(null)}
            role="presentation"
          >
            <div
              className="mx-4 w-full max-w-md rounded-2xl border-2 border-slate-600 bg-slate-800 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="innate-ability-title"
            >
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-600 pb-4">
                <h3
                  id="innate-ability-title"
                  className="flex min-w-0 items-center gap-2 text-xl font-bold text-amber-400"
                >
                  <span className="shrink-0 text-2xl">
                    {innateDetail.emoji}
                  </span>
                  <span className="min-w-0 leading-tight">
                    {innateDetail.name}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => setInnateDetail(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
              <p className="text-center text-sm leading-relaxed text-slate-300">
                {innateDetail.description}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
