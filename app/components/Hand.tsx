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
    <div className="flex w-full min-w-0 justify-center p-1 md:p-4 min-h-52">
      <div className="max-w-full overflow-x-auto overflow-y-visible scroll-smooth pb-1">
        <div className="mx-auto flex w-max flex-nowrap items-end justify-center gap-2 px-1 py-1">
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
            <div className="flex min-h-40 min-w-48 items-center justify-center text-gray-500 italic">
              Sua mão está vazia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
