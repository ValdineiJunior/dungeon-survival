'use client';

import { Player, CharacterClassDefinition } from '@/app/types/game';

interface PlayerStatusProps {
  player: Player;
  deckCount: number;
  discardCount: number;
  classDef: CharacterClassDefinition;
  onViewDeck: () => void;
  onViewDiscard: () => void;
}

export function PlayerStatus({ player, deckCount, discardCount, classDef, onViewDeck, onViewDiscard }: PlayerStatusProps) {
  const hpPercentage = (player.hp / player.maxHp) * 100;

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/80 rounded-xl border border-slate-600 backdrop-blur-sm h-full">
      {/* Avatar e Nome */}
      <div className="text-center">
        <div className="text-5xl mb-2">{classDef.emoji}</div>
        <h3 className="text-amber-400 font-bold">{classDef.name}</h3>
        <span className="text-slate-500 text-xs font-mono">
          ⬡ {player.position.q},{player.position.r}
        </span>
      </div>

      {/* Separador */}
      <div className="border-t border-slate-600" />

      {/* HP */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-red-400">❤️ Vida</span>
          <span className="text-white">{player.hp}/{player.maxHp}</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div
            className={`h-full transition-all duration-300 ${
              hpPercentage > 50 ? 'bg-red-500' : hpPercentage > 25 ? 'bg-orange-500' : 'bg-red-700'
            }`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
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
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-amber-400">⚡ Energia</span>
          <span className="text-white">{player.energy}/{player.maxEnergy}</span>
        </div>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: player.maxEnergy }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                i < player.energy
                  ? 'bg-amber-400 border-amber-500 shadow-amber-400/50 shadow-md'
                  : 'bg-gray-700 border-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-slate-600" />

      {/* Contadores de deck - clicáveis */}
      <div className="space-y-2 text-sm">
        <button
          onClick={onViewDeck}
          className="w-full flex items-center justify-between text-gray-300 hover:text-amber-400 hover:bg-slate-700/50 rounded px-2 py-1 transition-colors"
        >
          <span>📚 Deck Completo</span>
          <span className="font-bold">{deckCount}</span>
        </button>
        <button
          onClick={onViewDiscard}
          className="w-full flex items-center justify-between text-gray-300 hover:text-amber-400 hover:bg-slate-700/50 rounded px-2 py-1 transition-colors"
        >
          <span>🗑️ Descarte</span>
          <span className="font-bold">{discardCount}</span>
        </button>
      </div>

      {/* Habilidades Inatas */}
      {classDef.innateAbilities.length > 0 && (
        <>
          <div className="border-t border-slate-600" />
          <div className="space-y-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Habilidades Inatas
            </div>
            {classDef.innateAbilities.map((ability, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-300 bg-slate-700/50 rounded px-2 py-1"
                title={ability.description}
              >
                <span>{ability.emoji}</span>
                <span className="text-amber-300">{ability.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
