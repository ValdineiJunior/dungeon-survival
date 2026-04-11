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
  const canAfford = currentEnergy === undefined || currentEnergy >= card.cost;
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
        relative w-full min-h-0 rounded-md border-2 px-1 py-1 shadow-md transition-colors duration-150
        md:rounded-lg md:px-1.5 md:py-1
        bg-linear-to-r ${typeColors[card.type]}
        flex items-center max-md:justify-center max-md:gap-1 md:justify-start md:gap-2
        text-left max-md:overflow-hidden
        ${
          effectivelyDisabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-amber-100"
        }
        ${shouldGrayscale ? "grayscale" : ""}
        ${selected ? "border-yellow-400!" : ""}
      `}
      title={
        noEnergy
          ? `Requer ${card.cost} de energia (você tem ${currentEnergy})`
          : card.description
      }
    >
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-600 bg-amber-400 text-[10px] font-bold text-black md:h-4.5 md:w-4.5 md:text-[11px]">
        {card.cost}
      </div>
      {/* Mobile: display:contents → custo, ícone e valor centralizados na linha. Desktop: grupo à direita. */}
      <div className="max-md:contents md:flex md:min-w-0 md:flex-1 md:items-center md:justify-end md:gap-1">
        <div className="shrink-0 text-xs leading-none md:text-xs">
          {typeIcons[card.type]}
        </div>
        <div className="min-w-0 truncate text-[11px] font-bold text-white tabular-nums md:text-right md:text-xs">
          {card.damage || card.block || card.movement || card.range || ""}
        </div>
      </div>
    </button>
  );
}
