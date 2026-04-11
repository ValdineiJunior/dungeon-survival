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
    <div className="flex h-fit min-h-0 w-full min-w-0 justify-center px-1 py-0.5 md:px-1.5 md:py-1">
      <div className="max-w-full overflow-x-auto overflow-y-visible scroll-smooth [-webkit-overflow-scrolling:touch] touch-pan-x">
        <div className="mx-auto flex w-max flex-nowrap items-end justify-center gap-1 px-0.5 py-px sm:gap-1.5 md:gap-2.5 md:px-1 md:py-px">
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
            <div className="flex h-32 min-w-44 items-center justify-center px-2 text-center text-xs italic text-gray-500 md:h-40 md:text-sm">
              Sua mão está vazia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
