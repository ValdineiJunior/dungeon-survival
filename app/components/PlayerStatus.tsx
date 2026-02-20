'use client';

import { Player, CharacterClassDefinition } from '@/app/types/game';

interface PlayerStatusProps {
  player: Player;
  deckCount: number;
  discardCount: number;
  classDef: CharacterClassDefinition;
}

export function PlayerStatus({ player, deckCount, discardCount, classDef }: PlayerStatusProps) {
  const hpPercentage = (player.hp / player.maxHp) * 100;

  return (
    <div className="flex items-center gap-6 p-4 bg-slate-800/80 rounded-xl border border-slate-600 backdrop-blur-sm">
      {/* Avatar do jogador */}
      <div className="text-5xl">
        {classDef.emoji}
      </div>

      <div className="flex-1 space-y-2">
        {/* Nome, Posição e HP */}
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-lg">{classDef.name}</span>
          
          {/* Posição hexagonal */}
          <span className="text-slate-500 text-sm font-mono">
            ⬡ {player.position.q},{player.position.r}
          </span>
          
          {/* Block */}
          {player.block > 0 && (
            <span className="px-2 py-1 bg-blue-600 rounded text-white text-sm font-bold">
              🛡️ {player.block}
            </span>
          )}
        </div>

        {/* Barra de HP */}
        <div className="flex items-center gap-2">
          <span className="text-red-400">❤️</span>
          <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <div
              className={`h-full transition-all duration-300 ${
                hpPercentage > 50 ? 'bg-red-500' : hpPercentage > 25 ? 'bg-orange-500' : 'bg-red-700'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          <span className="text-white text-sm min-w-[60px]">
            {player.hp} / {player.maxHp}
          </span>
        </div>

        {/* Energia */}
        <div className="flex items-center gap-2">
          <span className="text-amber-400">⚡</span>
          <div className="flex gap-1">
            {Array.from({ length: player.maxEnergy }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  i < player.energy
                    ? 'bg-amber-400 border-amber-500 shadow-amber-400/50 shadow-md'
                    : 'bg-gray-700 border-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-white text-sm">
            {player.energy} / {player.maxEnergy}
          </span>
        </div>
      </div>

      {/* Contadores de deck */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-2xl">📚</span>
          <span>{deckCount}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-2xl">🗑️</span>
          <span>{discardCount}</span>
        </div>
      </div>
    </div>
  );
}
