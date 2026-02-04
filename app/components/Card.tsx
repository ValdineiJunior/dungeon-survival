'use client';

import { Card as CardType } from '@/app/types/game';

interface CardProps {
  card: CardType;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function Card({ card, disabled, selected, onClick }: CardProps) {
  const typeColors = {
    attack: 'from-red-900 to-red-700 border-red-500',
    skill: 'from-blue-900 to-blue-700 border-blue-500',
    power: 'from-yellow-900 to-yellow-700 border-yellow-500',
    movement: 'from-green-900 to-green-700 border-green-500',
  };

  const typeIcons = {
    attack: '⚔️',
    skill: '🛡️',
    power: '✨',
    movement: '👟',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-32 h-44 rounded-lg border-2 
        bg-gradient-to-b ${typeColors[card.type]}
        flex flex-col p-2
        transform transition-all duration-200
        ${disabled 
          ? 'opacity-50 cursor-not-allowed grayscale' 
          : 'hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/50 cursor-pointer'
        }
        ${selected 
          ? 'ring-4 ring-yellow-400 scale-110 -translate-y-2' 
          : ''
        }
        shadow-lg
      `}
    >
      {/* Custo de energia */}
      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-black font-bold text-lg shadow-md">
        {card.cost}
      </div>

      {/* Tipo */}
      <div className="text-2xl text-center mt-3 mb-1">
        {typeIcons[card.type]}
      </div>

      {/* Nome */}
      <div className="text-center font-bold text-white text-sm px-1 leading-tight">
        {card.name}
      </div>

      {/* Linha decorativa */}
      <div className="w-full h-px bg-white/30 my-2" />

      {/* Descrição */}
      <div className="flex-1 text-center text-white/90 text-xs px-1">
        {card.description}
      </div>

      {/* Valores */}
      <div className="flex justify-center gap-2 text-sm">
        {card.damage && (
          <span className="text-red-300 font-bold">🗡️ {card.damage}</span>
        )}
        {card.block && (
          <span className="text-blue-300 font-bold">🛡️ {card.block}</span>
        )}
        {card.movement && (
          <span className="text-green-300 font-bold">👟 {card.movement}</span>
        )}
        {card.range && card.range > 1 && (
          <span className="text-purple-300 font-bold">📏 {card.range}</span>
        )}
      </div>
    </button>
  );
}
