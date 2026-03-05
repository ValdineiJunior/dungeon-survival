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
      <div className="flex items-center gap-2 text-sm">
        <span className="text-red-400 shrink-0">❤️ Vida</span>
        <div className="flex-1 min-w-0 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div
            className={`h-full transition-all duration-300 ${
              hpPercentage > 50
                ? "bg-red-500"
                : hpPercentage > 25
                  ? "bg-orange-500"
                  : "bg-red-700"
            }`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <span className="text-white shrink-0 tabular-nums">
          {player.hp}/{player.maxHp}
        </span>
      </div>

      {/* Block */}
      {player.block > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-400">🛡️ Bloqueio</span>
          <span className="px-2 py-0.5 bg-blue-600 rounded text-white font-bold">
            {player.block}
          </span>
        </div>
      )}

      {/* Energia */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-amber-400 shrink-0">⚡ Energia</span>
        <div className="flex-1 flex gap-1 justify-center min-w-0">
          {Array.from({ length: player.maxEnergy }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all shrink-0 ${
                i < player.energy
                  ? "bg-amber-400 border-amber-500 shadow-amber-400/50 shadow-md"
                  : "bg-gray-700 border-gray-600"
              }`}
            />
          ))}
        </div>
        <span className="text-white shrink-0 tabular-nums">
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
