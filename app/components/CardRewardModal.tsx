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
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-40">
      <div className="text-center p-1 md:p-8 bg-slate-800 rounded-md md:rounded-2xl border-2 border-amber-600 shadow-2xl max-w-2xl">
        <div className="text-4xl mb-6 text-amber-400 font-bold">⭐ Recompensa do Andar!</div>
        <p className="text-slate-300 mb-8 text-lg">
          Escolha uma carta para adicionar ao seu deck:
        </p>

        {/* Cards Display */}
        <div className="flex justify-center gap-8 mb-8">
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
