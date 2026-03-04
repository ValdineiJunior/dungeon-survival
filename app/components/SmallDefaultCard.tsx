"use client";

import { Card as CardType, DefaultHandCard } from "@/app/types/game";

interface SmallDefaultCardProps {
  entry: DefaultHandCard;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  /** Current player energy; if provided and less than card cost, card is disabled and gray */
  currentEnergy?: number;
}

export function SmallDefaultCard({
  entry,
  disabled,
  selected,
  onClick,
  currentEnergy,
}: SmallDefaultCardProps) {
  const card = entry.card;
  const canAfford =
    currentEnergy === undefined || currentEnergy >= card.cost;
  const noEnergy = currentEnergy !== undefined && !canAfford;
  const effectivelyDisabled = disabled || entry.usedThisTurn || noEnergy;
  const shouldGrayscale = entry.usedThisTurn || disabled || noEnergy;

  const typeColors: Record<CardType["type"], string> = {
    attack: "from-red-900 to-red-700 border-red-500",
    skill: "from-blue-900 to-blue-700 border-blue-500",
    power: "from-yellow-900 to-yellow-700 border-yellow-500",
    movement: "from-green-900 to-green-700 border-green-500",
  };

  const typeIcons: Record<CardType["type"], string> = {
    attack: "⚔️",
    skill: "🛡️",
    power: "✨",
    movement: "👟",
  };

  return (
    <button
      onClick={onClick}
      disabled={effectivelyDisabled}
      className={`
        relative w-full rounded-lg border-2 px-2 py-1.5
        bg-linear-to-r ${typeColors[card.type]}
        flex items-center gap-2
        transform transition-all duration-200
        ${effectivelyDisabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 hover:shadow-lg hover:shadow-black/50 cursor-pointer hover:border-white"
        }
        ${shouldGrayscale ? "grayscale" : ""}
        ${selected ? "ring-2 ring-yellow-400 scale-105 border-yellow-400" : ""}
        shadow-md text-left
      `}
      title={
        noEnergy
          ? `Requer ${card.cost} de energia (você tem ${currentEnergy})`
          : card.description
      }
    >
      <div className="flex bg-amber-400 border border-amber-600 rounded-full w-5 h-5 items-center justify-center text-black font-bold text-xs shrink-0">
        {card.cost}
      </div>
      <div className="flex-1 flex justify-end items-center gap-1">
        <div className="text-sm">
          {typeIcons[card.type]}
        </div>
        <div className="font-bold text-white text-sm">
          {card.damage || card.block || card.movement || card.range || ""}
        </div>
      </div>
    </button>
  );
}
