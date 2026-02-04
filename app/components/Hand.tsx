'use client';

import { Card as CardType } from '@/app/types/game';
import { Card } from './Card';

interface HandProps {
  cards: CardType[];
  energy: number;
  selectedCard: CardType | null;
  onSelectCard: (card: CardType) => void;
  disabled?: boolean;
}

export function Hand({ cards, energy, selectedCard, onSelectCard, disabled }: HandProps) {
  return (
    <div className="flex justify-center items-end gap-2 p-4 min-h-[200px]">
      {cards.map((card, index) => {
        const canPlay = card.cost <= energy && !disabled;
        const isSelected = selectedCard?.id === card.id;
        
        return (
          <div
            key={card.id}
            className="transition-all duration-200"
            style={{
              transform: `rotate(${(index - (cards.length - 1) / 2) * 3}deg)`,
            }}
          >
            <Card
              card={card}
              disabled={!canPlay}
              selected={isSelected}
              onClick={() => canPlay && onSelectCard(card)}
            />
          </div>
        );
      })}
      
      {cards.length === 0 && (
        <div className="text-gray-500 italic">Sua mão está vazia</div>
      )}
    </div>
  );
}
