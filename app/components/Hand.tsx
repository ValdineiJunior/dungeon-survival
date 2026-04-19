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

  return (
    <div className="flex h-32 min-h-32 w-full min-w-0 justify-center px-1 md:h-40 md:min-h-40 md:px-1.5">
      {/* Fixed band height so horizontal scrollbar stays inside and does not grow the layout */}
      <div
        className={`
          h-full max-w-full min-h-0 flex-1 overflow-x-auto overflow-y-hidden scroll-smooth
          [-webkit-overflow-scrolling:touch] touch-pan-x [scrollbar-width:thin]
          [&::-webkit-scrollbar]:h-1.5
        `}
      >
        <div className="mx-auto flex h-full w-max min-w-0 flex-nowrap items-end justify-center gap-1 px-0.5 sm:gap-1.5 md:gap-2.5 md:px-1">
          {cards.map((card, index) => {
            const canPlay = card.cost <= energy && !disabled;
            const isSelected =
              selectedCard?.id === card.id && !selectedCardIsDefault;

            return (
              <div
                key={card.id}
                className="relative shrink-0"
                style={{
                  zIndex: hoveredCardId === card.id ? 50 : index,
                }}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
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
            <div className="flex h-full w-full min-w-0 items-center justify-center px-2 text-center text-xs italic text-gray-500 md:text-sm">
              Sua mão está vazia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
