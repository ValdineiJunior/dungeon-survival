"use client";

import { Card as CardType } from "@/app/types/game";
import { Card } from "./Card";

interface HandProps {
  cards: CardType[];
  energy: number;
  selectedCard: CardType | null;
  onSelectCard: (card: CardType) => void;
  onEndTurn: () => void;
  canEndTurn: boolean;
  disabled?: boolean;
}

export function Hand({
  cards,
  energy,
  selectedCard,
  onSelectCard,
  onEndTurn,
  canEndTurn,
  disabled,
}: HandProps) {
  return (
    <div className="flex items-center gap-4 p-4 min-h-52">
      {/* Cards */}
      <div className="flex-1 flex justify-center items-end gap-2">
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

      {/* End Turn Button */}
      <div className="shrink-0">
        <button
          onClick={onEndTurn}
          disabled={!canEndTurn}
          className={`
            px-6 py-4 rounded-lg font-bold text-lg
            transition-all duration-200
            ${
              canEndTurn
                ? "bg-amber-500 hover:bg-amber-400 text-black hover:scale-105"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Finalizar
          <br />
          Turno
        </button>
      </div>
    </div>
  );
}
