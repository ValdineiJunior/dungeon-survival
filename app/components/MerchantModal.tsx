"use client";

import { useState, useEffect } from "react";
import type { MerchantOffer } from "@/app/types/game";
import { Card as CardComponent } from "@/app/components/Card";
import { merchantPriceForRarity } from "@/app/lib/goldEconomy";

interface MerchantModalProps {
  offers: MerchantOffer[];
  playerGold: number;
  onBuy: (offerIndex: number) => void;
  onLeave: () => void;
}

export function MerchantModal({
  offers,
  playerGold,
  onBuy,
  onLeave,
}: MerchantModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [offers]);

  const selected = selectedIndex !== null ? offers[selectedIndex] : null;
  const selectedPrice = selected
    ? merchantPriceForRarity(selected.rarity)
    : 0;
  const canAffordSelected =
    selected !== null && playerGold >= selectedPrice;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4">
      <div className="max-h-[min(100dvh,48rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border-2 border-amber-600 bg-slate-800 p-4 text-center shadow-2xl md:p-6">
        <div className="mb-3 flex flex-col items-center justify-between gap-3 sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-amber-400 md:text-3xl">
              🛒 Mercador
            </h2>
            <p className="mt-1 text-sm text-slate-400 md:text-base">
              Escolha uma carta, compre se tiver ouro, ou saia quando quiser.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
            <p className="rounded-lg border border-amber-500/40 bg-slate-900/80 px-3 py-1.5 text-sm font-semibold text-amber-300">
              Seu ouro: <span className="tabular-nums">{playerGold}</span>
            </p>
            <button
              type="button"
              onClick={onLeave}
              className="rounded-lg border border-slate-500 bg-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-600"
            >
              Sair do mercador
            </button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {offers.map((offer, index) => {
            const price = merchantPriceForRarity(offer.rarity);
            const isSelected = selectedIndex === index;
            return (
              <div
                key={`${offer.card.id}-${index}`}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-colors md:p-3 ${
                  isSelected
                    ? "border-amber-400 bg-slate-900/80"
                    : "border-transparent bg-slate-900/40 hover:border-amber-600/50"
                }`}
              >
                <CardComponent
                  card={offer.card}
                  selected={isSelected}
                  onClick={() => setSelectedIndex(index)}
                />
                <span className="text-sm font-bold text-amber-300 tabular-nums">
                  {price} ouro
                </span>
              </div>
            );
          })}
        </div>

        {selectedIndex !== null && selected && (
          <div className="border-t border-slate-600 pt-4">
            <p className="mb-3 text-sm text-slate-300 md:text-base">
              Carta selecionada:{" "}
              <span className="font-semibold text-amber-200">
                {selected.card.name}
              </span>{" "}
              — <span className="tabular-nums">{selectedPrice}</span> ouro
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onBuy(selectedIndex)}
                disabled={!canAffordSelected}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-colors md:px-6 md:py-3 md:text-base ${
                  canAffordSelected
                    ? "bg-amber-500 text-black hover:bg-amber-400"
                    : "cursor-not-allowed bg-slate-600 text-slate-400"
                }`}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="rounded-lg border border-slate-500 bg-slate-700 px-4 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-600 md:px-6 md:py-3 md:text-base"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
