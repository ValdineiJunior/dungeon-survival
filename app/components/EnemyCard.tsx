"use client";

import { Fragment } from "react";
import { Enemy, EnemyIntent, GamePhase } from "@/app/types/game";
import { DiceIcon } from "@/app/components/DiceIcon";
import { GamePill } from "@/app/components/GamePill";
import { ENEMY_IMAGE_FILES } from "@/app/lib/enemies";

interface InitiativeDice {
  dice: number[];
  total: number;
  highestDie: number;
  diceFaces?: number[];
}

interface EnemyCardProps {
  enemy: Enemy;
  orderNumber: number;
  isTargetable?: boolean;
  isTargeted?: boolean;
  onClick?: () => void;
  phase?: GamePhase;
  initiativeDice?: InitiativeDice;
}

const actionIcons: Record<
  EnemyIntent,
  { icon: string; color: string; label: string }
> = {
  attack: { icon: "⚔️", color: "text-red-400", label: "Ataque" },
  defend: { icon: "🛡️", color: "text-blue-400", label: "Defesa" },
  buff: { icon: "⬆️", color: "text-yellow-400", label: "Buff" },
  debuff: { icon: "⬇️", color: "text-purple-400", label: "Debuff" },
  move: { icon: "👟", color: "text-green-400", label: "Movimento" },
};

export function EnemyCard({
  enemy,
  orderNumber,
  isTargetable,
  isTargeted,
  onClick,
  phase,
  initiativeDice,
}: EnemyCardProps) {
  const actionCard = enemy.currentActionCard;
  const isInitiativePhase =
    phase === "rollingInitiative" || phase === "viewingInitiative";
  const initiativeDiceFaces = enemy.initiativeDice ?? [6, 6, 6];
  const initiativeMin = initiativeDiceFaces.length;
  const initiativeMax = initiativeDiceFaces.reduce((a, b) => a + b, 0);
  const initiativeRange = `${initiativeMin}-${initiativeMax}`;
  const showInitiativeRow = isInitiativePhase;
  const showActionsRow = !isInitiativePhase && Boolean(actionCard);
  const showSecondarySection = showInitiativeRow || showActionsRow;

  const secondarySectionLabel = showInitiativeRow
    ? phase === "viewingInitiative"
      ? "Resultado da iniciativa"
      : "Variação de iniciativa"
    : "Ações";

  /** Variação: show physical dice art; Resultado: value-only cells with rolls. */
  const showDiceImagesInInitiativeRow = phase === "rollingInitiative";

  return (
    <div
      onClick={isTargetable ? onClick : undefined}
      className={`
        relative min-w-0 max-w-full w-full rounded-md md:rounded-xl border-2 p-1 md:p-3 shadow-lg
        bg-linear-to-r from-slate-800 to-slate-900
        transition-colors duration-200
        ${
          isTargetable
            ? "cursor-pointer border-yellow-400 hover:border-amber-300 hover:bg-slate-700/40"
            : isTargeted
              ? "border-yellow-400"
              : "border-slate-600"
        }
      `}
    >
      {/* Target indicator */}
      {isTargetable && (
        <div className="absolute left-1 top-1 z-20 max-w-[calc(100%-0.5rem)] truncate rounded-full bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-black sm:left-2 sm:top-2 sm:max-w-none sm:px-2 sm:py-1 sm:text-xs">
          🎯 Atacar alvo
        </div>
      )}

      <div className="flex w-full min-w-0 flex-col gap-1.5 md:gap-2">
        <div className="flex w-full min-w-0 items-stretch gap-3">
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <h3
              className="w-14 min-w-0 truncate text-center text-xs font-bold leading-tight text-white sm:text-sm"
              title={enemy.name}
            >
              {enemy.name}
            </h3>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 border-slate-600 bg-slate-800">
              {ENEMY_IMAGE_FILES[enemy.name] ? (
                <img
                  src={`/enemies/${ENEMY_IMAGE_FILES[enemy.name]}`}
                  alt={enemy.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">
                  {enemy.emoji}
                </div>
              )}
              <span
                className="absolute bottom-0 right-0 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-amber-600 bg-amber-400 text-[10px] font-bold text-black"
                title={`Ordem de turno: ${orderNumber}`}
              >
                {orderNumber}
              </span>
            </div>
          </div>

          <div
            className="w-px shrink-0 self-stretch bg-slate-600"
            role="separator"
            aria-orientation="vertical"
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-xs text-red-400" aria-hidden>
                  ❤️
                </span>
                <GamePill variant="hp" hp={enemy.hp} maxHp={enemy.maxHp} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-xs text-blue-400" aria-hidden>
                  🛡️
                </span>
                <GamePill variant="block" block={enemy.block} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-sm leading-none" title="Alcance">
                  🏹
                </span>
                <GamePill variant="range" attackRange={enemy.attackRange} />
              </div>
            </div>
          </div>
        </div>

        {showSecondarySection && (
          <div className="w-full min-w-0">
            <div
              className="mb-1.5 flex min-w-0 items-center gap-2 md:mb-2"
              role="separator"
              aria-orientation="horizontal"
              aria-label={secondarySectionLabel}
            >
              <span
                className="min-h-px min-w-0 flex-1 bg-slate-600"
                aria-hidden
              />
              <span className="max-w-[min(100%,12rem)] shrink-0 truncate text-center text-[9px] font-semibold tracking-wide text-slate-400 sm:text-[10px]">
                {secondarySectionLabel}
              </span>
              <span
                className="min-h-px min-w-0 flex-1 bg-slate-600"
                aria-hidden
              />
            </div>

            {showInitiativeRow && (
              <div
                className="flex w-full min-w-0 flex-wrap items-center justify-center gap-1"
                title="Iniciativa"
              >
                {initiativeDiceFaces.map((faces, i) => {
                  const roll = initiativeDice?.dice?.[i];
                  const faceForColor =
                    initiativeDice?.diceFaces?.[i] ?? faces;
                  return (
                    <Fragment key={i}>
                      {i > 0 && (
                        <span
                          className="shrink-0 text-[11px] font-bold text-slate-400"
                          aria-hidden
                        >
                          +
                        </span>
                      )}
                      {showDiceImagesInInitiativeRow ? (
                        <DiceIcon faces={faceForColor} size="sm" />
                      ) : (
                        <DiceIcon
                          faces={faceForColor}
                          value={roll !== undefined ? roll : "?"}
                          size="sm"
                          showImage={false}
                        />
                      )}
                    </Fragment>
                  );
                })}
                <span
                  className="shrink-0 px-0.5 text-[11px] font-bold text-slate-400"
                  aria-hidden
                >
                  =
                </span>
                <GamePill
                  variant="initiative"
                  initiativeRange={initiativeRange}
                  total={initiativeDice?.total}
                  shrink
                />
              </div>
            )}

            {showActionsRow && actionCard && (
              <div
                className="flex w-full min-w-0 flex-wrap items-center justify-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                title={actionCard.name}
              >
                {actionCard.actions.map((action, index) => {
                  const info = actionIcons[action.type];
                  return (
                    <span
                      key={index}
                      className={`inline-flex shrink-0 items-center gap-1 text-sm ${info.color}`}
                      title={`${info.label}: ${action.value}`}
                    >
                      {info.icon}
                      <GamePill
                        variant="action"
                        action={action.type}
                        shrink
                        title={`${info.label}: ${action.value}`}
                      >
                        {action.value}
                      </GamePill>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
