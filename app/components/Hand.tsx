"use client";

import { Card as CardType, DefaultHandCard } from "@/app/types/game";
import { Card } from "./Card";

interface HandProps {
  cards: CardType[];
  energy: number;
  selectedCard: CardType | null;
  onSelectCard: (card: CardType) => void;
  onEndTurn: () => void;
  canEndTurn: boolean;
  disabled?: boolean;
  defaultHand?: DefaultHandCard[];
  onPlayDefaultCard?: (id: string) => void;
}

export function Hand({
  cards,
  energy,
  selectedCard,
  onSelectCard,
  onEndTurn,
  canEndTurn,
  disabled,
  defaultHand,
  onPlayDefaultCard,
}: HandProps) {
  return (
    <div className="flex items-center gap-4 p-4 min-h-52">
      {/* Default Hand (left) */}
      <div className="w-56 flex flex-col items-center gap-2">
        <div className="text-sm text-slate-300 mb-1">Cartas Padrão</div>
        <div className="flex flex-row items-end gap-2">
          {(defaultHand ?? []).map((entry, idx) => {
            const canPlay = !entry.usedThisTurn && entry.card.cost <= energy && !disabled;
            return (
              <div key={entry.id} className="transition-all duration-150">
                <Card
                  card={entry.card}
                  disabled={!canPlay}
                  grayscale={entry.usedThisTurn ? true : undefined}
                  onClick={() => canPlay && onPlayDefaultCard && onPlayDefaultCard(entry.id)}
                />
              </div>
            );
          })}
          {(defaultHand ?? []).length === 0 && (
            <div className="text-gray-500 italic">—</div>
          )}
        </div>
      </div>

      {/* Main Cards (center) */}
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

      {/* End Turn Button (shared) */}
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
