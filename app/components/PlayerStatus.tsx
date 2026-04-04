"use client";

import { Player, CharacterClassDefinition } from "@/app/types/game";
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

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/80 rounded-xl border border-slate-600 backdrop-blur-sm h-full">
      {/* Avatar e Nome */}
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-3 rounded-lg overflow-hidden border-2 border-amber-500/50 bg-slate-700">
          <img
            src={classDef.imageUrl}
            alt={classDef.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <h3 className="text-amber-400 font-bold">{classDef.name}</h3>
        <span className="text-slate-500 text-xs font-mono">
          ⬡ {player.position.q},{player.position.r}
        </span>
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

      {/* Pool de dados (iniciativa) */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-wide shrink-0">
          🎲 Iniciativa
        </span>
        <div className="flex items-center gap-1 justify-end flex-wrap min-w-0">
          {(classDef.initiativeDice ?? [6, 6, 6]).map(
            (faces, i) => (
              <DiceIcon key={i} faces={faces} size="sm" />
            ),
          )}
        </div>
      </div>

      {/* Habilidades Inatas */}
      {classDef.innateAbilities.length > 0 && (
        <>
          <div className="space-y-2">
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Habilidades Inatas
            </div>
            {classDef.innateAbilities.map((ability, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded px-2 py-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span>{ability.emoji}</span>
                  <span className="text-amber-300 font-medium">
                    {ability.name}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 pl-6">
                  {ability.description}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
