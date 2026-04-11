"use client";

import { useState } from "react";
import { Card } from "@/app/types/game";
import { Card as CardComponent } from "./Card";

interface CardRewardModalProps {
  cards: [Card, Card];
  onSelectCard: (card: Card) => void;
}

export function CardRewardModal({
  cards,
  onSelectCard,
}: CardRewardModalProps) {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4">
      <div className="max-h-[min(100dvh,40rem)] w-full max-w-2xl overflow-y-auto rounded-md border-2 border-amber-600 bg-slate-800 p-3 text-center shadow-2xl md:rounded-2xl md:p-8">
        <div className="mb-4 text-2xl font-bold text-amber-400 md:mb-6 md:text-4xl">
          ⭐ Recompensa do Andar!
        </div>
        <p className="mb-6 text-base text-slate-300 md:mb-8 md:text-lg">
          Escolha uma carta para adicionar ao seu deck:
        </p>

        {/* Cards Display */}
        <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6 md:mb-8 md:gap-8">
          <CardComponent
            card={cards[0]}
            selected={selected?.id === cards[0].id}
            onClick={() => setSelected(cards[0])}
          />
          <CardComponent
            card={cards[1]}
            selected={selected?.id === cards[1].id}
            onClick={() => setSelected(cards[1])}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => selected && onSelectCard(selected)}
            disabled={!selected}
            className={`px-2 py-1 md:px-6 md:py-3 font-bold rounded-md md:rounded-lg transition-colors ${
              selected
                ? "bg-amber-500 hover:bg-amber-400 text-black"
                : "bg-slate-500 text-slate-400 cursor-not-allowed"
            }`}
          >
            Confirmar Escolha
          </button>
        </div>
      </div>
    </div>
  );
}
