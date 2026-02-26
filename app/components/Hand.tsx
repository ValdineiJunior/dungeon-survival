"use client";

import { useState } from "react";
import { Card as CardType } from "@/app/types/game";
import { Card } from "./Card";

interface HandProps {
  cards: CardType[];
  energy: number;
  selectedCard: CardType | null;
  selectedCardIsDefault?: boolean;
  onSelectCard: (card: CardType) => void;
  disabled?: boolean;
}

export function Hand({
  cards,
  energy,
  selectedCard,
  selectedCardIsDefault,
  onSelectCard,
  disabled,
}: HandProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Calculate card overlap based on total cards
  // More cards = more overlap to fit them
  const totalCards = cards.length;
  const cardWidth = 144; // w-36 = 144px
  const maxHandWidth = typeof window !== 'undefined' ? window.innerWidth * 0.7 : 800;
  
  // Calculate negative margin to create overlap
  // Cards need to overlap when we have many cards
  let overlapMargin = 0;
  if (totalCards > 5) {
    overlapMargin = Math.min(96, Math.floor((totalCards * cardWidth - maxHandWidth) / Math.max(totalCards - 1, 1)));
  }

  return (
    <div className="flex justify-center p-4 min-h-52">
      {/* Main Cards (center) with default cards prepended visually */}
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-end gap-0">
          {cards.map((card, index) => {
            const canPlay = card.cost <= energy && !disabled;
            const isSelected = selectedCard?.id === card.id && !selectedCardIsDefault;

              return (
                <div
                  key={card.id}
                  className="transition-all duration-200"
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  style={{ 
                    transform: `rotate(${(index - (cards.length - 1) / 2) * 3}deg)`,
                    marginRight: index < cards.length - 1 ? `-${overlapMargin}px` : 0,
                    zIndex: hoveredCardId === card.id ? 1000 : index,
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
      </div>
    </div>
  );
}
