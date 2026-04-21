"use client";

import { useState } from "react";
import type { CharacterClass, Enemy, InitiativeResult } from "@/app/types/game";
import { CHARACTER_CLASSES } from "@/app/lib/cards";
import { ENEMY_IMAGE_FILES } from "@/app/lib/enemies";

function portraitSrc(
  entry: InitiativeResult,
  playerClass: CharacterClass,
): string | null {
  if (entry.entityType === "player") {
    return CHARACTER_CLASSES[playerClass].imageUrl;
  }
  const file = ENEMY_IMAGE_FILES[entry.name];
  return file ? `/enemies/${file}` : null;
}

/** Mesmo índice que em EnemyCard: posição na lista `enemies` (1, 2, 3…). */
function enemyEncounterOrderNumber(
  entry: InitiativeResult,
  enemies: Enemy[],
): number | null {
  if (entry.entityType !== "enemy") return null;
  const idx = enemies.findIndex((e) => e.id === entry.id);
  return idx >= 0 ? idx + 1 : null;
}

function MiniSlot({
  entry,
  playerClass,
  isActive,
  orderNumber,
}: {
  entry: InitiativeResult;
  playerClass: CharacterClass;
  isActive: boolean;
  orderNumber: number | null;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = portraitSrc(entry, playerClass);
  const showImg = Boolean(src) && !imgFailed;
  const ring = isActive
    ? "ring-1 ring-amber-400 ring-offset-1 ring-offset-slate-900/90"
    : "";

  return (
    <div
      className={`relative h-6 w-6 shrink-0 overflow-hidden rounded border border-slate-600 bg-slate-800 ${ring}`}
      title={
        orderNumber != null
          ? `${entry.name} — ordem no combate ${orderNumber} · iniciativa ${entry.total}`
          : `${entry.name} — iniciativa ${entry.total}`
      }
      role="listitem"
    >
      {showImg ? (
        <img
          src={src!}
          alt=""
          className="h-full w-full object-cover object-top"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[11px] leading-none">
          {entry.emoji}
        </span>
      )}
      {orderNumber != null && (
        <span className="absolute bottom-px right-px z-10 flex min-h-[0.65rem] min-w-[0.65rem] items-center justify-center rounded border border-amber-600 bg-amber-400 px-px text-center text-[6px] font-bold leading-none text-black tabular-nums sm:text-[7px]">
          {orderNumber}
        </span>
      )}
    </div>
  );
}

interface MiniInitiativeOrderStripProps {
  turnOrder: InitiativeResult[];
  playerCharacterClass: CharacterClass;
  activeTurnIndex: number;
  enemies: Enemy[];
}

/** Faixa horizontal minimalista: retrato minúsculo + número de ordem no combate (inimigos). */
export function MiniInitiativeOrderStrip({
  turnOrder,
  playerCharacterClass,
  activeTurnIndex,
  enemies,
}: MiniInitiativeOrderStripProps) {
  if (turnOrder.length === 0) return null;

  const summary = turnOrder
    .map((e, i) => {
      const n = enemyEncounterOrderNumber(e, enemies);
      const tag = n != null ? `#${n}` : "jogador";
      return `${i + 1}. ${e.name} (${tag}, ini ${e.total})`;
    })
    .join(" → ");

  return (
    <div
      className="flex max-w-[min(12rem,40vw)] shrink-0 items-center gap-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-[min(18rem,50vw)] md:max-w-none"
      role="list"
      aria-label={`Ordem de iniciativa: ${summary}`}
      title={summary}
    >
      {turnOrder.map((entry, i) => (
        <MiniSlot
          key={entry.id}
          entry={entry}
          playerClass={playerCharacterClass}
          isActive={i === activeTurnIndex}
          orderNumber={enemyEncounterOrderNumber(entry, enemies)}
        />
      ))}
    </div>
  );
}
