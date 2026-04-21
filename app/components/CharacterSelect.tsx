"use client";

import { useState } from "react";
import { CharacterClass } from "@/app/types/game";
import {
  CHARACTER_CLASSES,
  getClassCards,
  WARRIOR_DEFAULT_CARDS,
  ARCHER_DEFAULT_CARDS,
  MAGE_DEFAULT_CARDS,
} from "@/app/lib/cards";
import { getRewardPool } from "@/app/lib/cardRewards";
import { CardListModal } from "./CardListModal";
import { DiceIcon } from "./DiceIcon";

interface CharacterSelectProps {
  onSelect: (characterClass: CharacterClass) => void;
  /** `embedded`: dentro do hub (scroll, sem fundo full-screen). `fullscreen`: rota /game ou legado. */
  variant?: "fullscreen" | "embedded";
}

const CLASS_ORDER: CharacterClass[] = ["warrior", "archer", "mage"];

export function CharacterSelect({
  onSelect,
  variant = "fullscreen",
}: CharacterSelectProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(
    null,
  );
  const [cardType, setCardType] = useState<
    "initial" | "normal" | "rare" | "default" | null
  >(null);

  const closeModal = () => {
    setSelectedClass(null);
    setCardType(null);
  };

  const getModalTitle = () => {
    if (!selectedClass || !cardType) return "";
    const className = CHARACTER_CLASSES[selectedClass].name;
    const titles: Record<string, string> = {
      initial: `Cartas Iniciais - ${className}`,
      normal: `Cartas de Recompensa Normais - ${className}`,
      rare: `Cartas de Recompensa Raras - ${className}`,
      default: `Cartas Padrão - ${className}`,
    };
    return titles[cardType] || "";
  };

  const getCardsToDisplay = () => {
    if (!selectedClass || !cardType) return [];

    if (cardType === "initial") {
      return getClassCards(selectedClass);
    }

    if (cardType === "default") {
      switch (selectedClass) {
        case "warrior":
          return WARRIOR_DEFAULT_CARDS;
        case "archer":
          return ARCHER_DEFAULT_CARDS;
        case "mage":
          return MAGE_DEFAULT_CARDS;
        default:
          return [];
      }
    }

    const pool = getRewardPool(selectedClass);
    if (cardType === "normal") {
      return pool.normal;
    } else if (cardType === "rare") {
      return pool.rare;
    }

    return [];
  };
  const isEmbedded = variant === "embedded";

  return (
    <div
      className={
        isEmbedded
          ? "flex min-h-0 w-full flex-1 flex-col items-center py-4 md:py-6"
          : "relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8"
      }
    >
      {!isEmbedded && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-900/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-red-900/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900/10 blur-3xl" />
        </div>
      )}

      <div
        className={`relative z-10 flex w-full max-w-5xl flex-col items-center px-2 ${isEmbedded ? "mb-6 shrink-0" : "mb-12"}`}
      >
        <h1
          className={`mb-3 text-center font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 ${
            isEmbedded ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl mb-4"
          }`}
        >
          Escolha seu Personagem
        </h1>
        <p
          className={`text-center text-slate-400 ${isEmbedded ? "text-base" : "text-lg"}`}
        >
          Cada classe tem habilidades e cartas únicas
        </p>
      </div>

      <div
        className={`relative z-10 flex w-full max-w-5xl flex-wrap justify-center gap-6 px-1 pb-4 md:px-2 ${
          isEmbedded
            ? "min-h-0 flex-1 content-start overflow-y-auto overflow-x-hidden"
            : ""
        }`}
      >
        {CLASS_ORDER.map((classId) => {
          const classDef = CHARACTER_CLASSES[classId];
          const cards = getClassCards(classId);
          const attackCards = cards.filter((c) => c.type === "attack");
          const hasRanged = attackCards.some((c) => (c.range ?? 1) > 1);
          const initiativeDice = classDef.initiativeDice ?? [6, 6, 6];
          const initiativeRange = `${initiativeDice.length}-${initiativeDice.reduce((a, b) => a + b, 0)}`;

          return (
            <div
              key={classId}
              onClick={() => onSelect(classId)}
              className="group relative w-80 p-4 md:p-6 bg-slate-800/80 rounded-2xl border-2 border-slate-600 
                         hover:border-amber-500 hover:bg-slate-700/80 
                         transition-[border-color,background-color,box-shadow] duration-300
                         hover:shadow-lg hover:shadow-amber-500/15
                         backdrop-blur-sm text-left cursor-pointer"
            >
              {/* Imagem do herói */}
              <div className="mb-4 overflow-hidden rounded-xl border-2 border-slate-600 group-hover:border-amber-500 transition-colors h-56 bg-slate-700/50">
                <img
                  src={classDef.imageUrl}
                  alt={classDef.name}
                  className="h-full w-full object-cover object-top transition-[filter] duration-300 group-hover:brightness-110"
                />
              </div>

              {/* Nome da classe */}
              <h2 className="text-2xl font-bold text-amber-400 mb-2">
                {classDef.name}
              </h2>

              {/* Descrição */}
              <p className="text-slate-300 text-sm mb-4 min-h-[60px]">
                {classDef.description}
              </p>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">❤️ Vida</span>
                  <span className="text-white font-bold">
                    {classDef.baseHp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">⚡ Energia</span>
                  <span className="text-white font-bold">
                    {classDef.baseEnergy}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">🏹 Alcance</span>
                  <span className="text-white font-bold">
                    {hasRanged ? "Distância" : "Corpo a corpo"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">🎲 Dados</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs tabular-nums">
                      {initiativeRange}
                    </span>
                    {initiativeDice.map((faces, i) => (
                      <DiceIcon key={i} faces={faces} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Innate Abilities */}
              {classDef.innateAbilities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                    Habilidades Inatas
                  </div>
                  <div className="space-y-1">
                    {classDef.innateAbilities.map((ability, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span>{ability.emoji}</span>
                        <div>
                          <span className="text-amber-300 font-medium">
                            {ability.name}:
                          </span>
                          <span className="text-slate-400 ml-1">
                            {ability.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Preview Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-600 flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(classId);
                    setCardType("initial");
                  }}
                  className="w-full py-2 px-3 text-xs font-medium bg-slate-700 hover:bg-amber-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  📋 Cartas Iniciais
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(classId);
                    setCardType("default");
                  }}
                  className="w-full py-2 px-3 text-xs font-medium bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  🔰 Cartas Padrão
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(classId);
                    setCardType("normal");
                  }}
                  className="w-full py-2 px-3 text-xs font-medium bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  💎 Cartas Normais
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(classId);
                    setCardType("rare");
                  }}
                  className="w-full py-2 px-3 text-xs font-medium bg-slate-700 hover:bg-purple-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  ✨ Cartas Raras
                </button>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/0 group-hover:border-amber-400/50 transition-colors pointer-events-none" />
            </div>
          );
        })}
      </div>

      <div
        className={`relative z-10 shrink-0 text-center text-sm text-slate-500 ${isEmbedded ? "mt-8" : "mt-12"}`}
      >
        Clique em uma classe para começar a aventura
      </div>

      {/* Card Preview Modal */}
      {selectedClass && cardType && (
        <CardListModal
          title={getModalTitle()}
          cards={getCardsToDisplay()}
          onClose={closeModal}
          showColors
        />
      )}
    </div>
  );
}
