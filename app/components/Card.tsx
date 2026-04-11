"use client";

import { Card as CardType } from "@/app/types/game";
interface CardProps {
  card: CardType;
  disabled?: boolean;
  selected?: boolean;
  grayscale?: boolean;
  onClick?: () => void;
}

export function Card({
  card,
  disabled,
  selected,
  grayscale,
  onClick,
}: CardProps) {
  const shouldGrayscale = grayscale ?? disabled;
  const typeColors = {
    attack: "from-red-900 to-red-700 border-red-500",
    skill: "from-blue-900 to-blue-700 border-blue-500",
    power: "from-yellow-900 to-yellow-700 border-yellow-500",
    movement: "from-green-900 to-green-700 border-green-500",
  };

  const typeIcons = {
    attack: "⚔️",
    skill: "🛡️",
    power: "✨",
    movement: "👟",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex h-32 w-24 flex-col rounded-md border-2 p-0.5 shadow-md
        md:h-40 md:w-28 md:rounded-lg md:p-1 md:shadow-lg
        bg-linear-to-b ${typeColors[card.type]}
        transition-colors duration-150
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-amber-100"
        }
        ${shouldGrayscale ? "grayscale" : ""}
        ${selected ? "border-yellow-400!" : ""}
      `}
    >
      {/* Faixa superior: largura total, custo à esquerda */}
      <div className="flex w-full shrink-0 items-center gap-0.5 md:gap-1.5">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-600 bg-amber-400 text-[9px] font-bold text-black shadow-sm md:h-6 md:w-6 md:border-2 md:text-xs">
          {card.cost}
        </div>
        <div className="min-h-4 flex-1 md:min-h-6" aria-hidden />
      </div>

      {/* Corpo do cartão */}
      <div className="flex min-h-0 flex-1 flex-col px-0.5 pt-px md:pt-1">
        {/* Tipo */}
        <div className="mb-0 text-center text-base leading-none md:mb-0.5 md:text-xl">
          {typeIcons[card.type]}
        </div>

        {/* Nome */}
        <div className="px-0.5 text-center text-[10px] font-bold leading-tight text-white md:text-[11px]">
          {card.name}
        </div>

        {/* Linha decorativa */}
        <div className="my-px h-px w-full bg-white/30 md:my-1" />

        {/* Descrição */}
        <div className="min-h-0 flex-1 text-center text-[9px] leading-tight text-white/90 md:text-[10px] md:leading-normal">
          {card.description}
        </div>

        {/* Valores */}
        <div className="mt-px flex flex-wrap justify-center gap-0.5 text-[9px] md:mt-0.5 md:gap-1.5 md:text-[11px]">
          {card.damage && (
            <span className="font-bold text-red-300">🗡️ {card.damage}</span>
          )}
          {card.block && (
            <span className="font-bold text-blue-300">🛡️ {card.block}</span>
          )}
          {card.movement && (
            <span className="font-bold text-green-300">👟 {card.movement}</span>
          )}
          {card.range && card.range > 1 && (
            <span className="font-bold text-purple-300">🏹 {card.range}</span>
          )}
          {card.energy && (
            <span className="font-bold text-amber-300">⚡ +{card.energy}</span>
          )}
          {card.loseHp && (
            <span className="font-bold text-red-400">❤️ -{card.loseHp}</span>
          )}
          {card.exhaust && (
            <span className="text-[9px] font-medium text-orange-400/90 md:text-[10px]">
              Esgota
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
