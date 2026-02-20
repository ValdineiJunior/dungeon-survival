'use client';

import { CharacterClass } from '@/app/types/game';
import { CHARACTER_CLASSES, getClassCards } from '@/app/lib/cards';

interface CharacterSelectProps {
  onSelect: (characterClass: CharacterClass) => void;
}

const CLASS_ORDER: CharacterClass[] = ['warrior', 'archer', 'mage'];

export function CharacterSelect({ onSelect }: CharacterSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-8">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 mb-4">
          Escolha seu Personagem
        </h1>
        <p className="text-slate-400 text-lg">
          Cada classe tem habilidades e cartas únicas
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-6 max-w-5xl">
        {CLASS_ORDER.map((classId) => {
          const classDef = CHARACTER_CLASSES[classId];
          const cards = getClassCards(classId);
          const attackCards = cards.filter(c => c.type === 'attack');
          const avgDamage = Math.round(
            attackCards.reduce((sum, c) => sum + (c.damage || 0), 0) / attackCards.length
          );
          const hasMinRange = attackCards.some(c => c.minRange && c.minRange > 1);

          return (
            <button
              key={classId}
              onClick={() => onSelect(classId)}
              className="group relative w-72 p-6 bg-slate-800/80 rounded-2xl border-2 border-slate-600 
                         hover:border-amber-500 hover:bg-slate-700/80 
                         transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20
                         backdrop-blur-sm text-left"
            >
              {/* Emoji grande */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {classDef.emoji}
              </div>

              {/* Nome da classe */}
              <h2 className="text-2xl font-bold text-amber-400 mb-2">
                {classDef.name}
              </h2>

              {/* Descrição */}
              <p className="text-slate-300 text-sm mb-4 min-h-[60px]">
                {classDef.description}
              </p>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">❤️ Vida</span>
                  <span className="text-white font-bold">{classDef.baseHp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">⚡ Energia</span>
                  <span className="text-white font-bold">{classDef.baseEnergy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">⚔️ Dano médio</span>
                  <span className="text-white font-bold">{avgDamage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">📏 Alcance</span>
                  <span className="text-white font-bold">
                    {hasMinRange ? 'Distância' : 'Corpo a corpo'}
                  </span>
                </div>
              </div>

              {/* Innate Abilities */}
              {classDef.innateAbilities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                    Habilidades Inatas
                  </div>
                  <div className="space-y-1">
                    {classDef.innateAbilities.map((ability, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span>{ability.emoji}</span>
                        <div>
                          <span className="text-amber-300 font-medium">{ability.name}:</span>
                          <span className="text-slate-400 ml-1">{ability.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/0 group-hover:border-amber-400/50 transition-colors pointer-events-none" />
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-12 text-slate-500 text-sm">
        Clique em uma classe para começar a aventura
      </div>
    </div>
  );
}
