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
        flex h-48 w-36 flex-col rounded-md md:rounded-lg border-2 p-1 md:p-1.5 shadow-lg
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
      <div className="flex w-full shrink-0 items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-amber-600 bg-amber-400 text-sm font-bold text-black shadow-sm">
          {card.cost}
        </div>
        <div className="min-h-7 flex-1" aria-hidden />
      </div>

      {/* Corpo do cartão */}
      <div className="flex min-h-0 flex-1 flex-col px-0.5 pt-1.5">
        {/* Tipo */}
        <div className="mb-0.5 text-center text-2xl leading-none">
          {typeIcons[card.type]}
        </div>

        {/* Nome */}
        <div className="px-0.5 text-center text-sm font-bold leading-tight text-white">
          {card.name}
        </div>

        {/* Linha decorativa */}
        <div className="my-1.5 h-px w-full bg-white/30" />

        {/* Descrição */}
        <div className="min-h-0 flex-1 text-center text-xs text-white/90">
          {card.description}
        </div>

        {/* Valores */}
        <div className="mt-1 flex flex-wrap justify-center gap-2 text-sm">
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
            <span className="text-[10px] font-medium text-orange-400/90">
              Esgota
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
