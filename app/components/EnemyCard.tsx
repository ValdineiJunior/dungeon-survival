"use client";

import { Enemy, EnemyIntent, GamePhase } from "@/app/types/game";
import { DiceIcon } from "@/app/components/DiceIcon";
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
  buff: { icon: "⬆️", color: "text-green-400", label: "Buff" },
  debuff: { icon: "⬇️", color: "text-purple-400", label: "Debuff" },
  move: { icon: "👟", color: "text-yellow-400", label: "Movimento" },
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
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  const hpPillClass =
    enemy.hp <= 0
      ? "border-gray-600 bg-gray-600 text-slate-300"
      : hpPercentage > 50
        ? "border-red-600 bg-red-500 text-white shadow-md shadow-red-500/30"
        : hpPercentage > 25
          ? "border-orange-600 bg-orange-500 text-slate-900 shadow-md shadow-orange-500/25"
          : "border-red-800 bg-red-700 text-white shadow-md shadow-red-900/40";
  const actionCard = enemy.currentActionCard;
  const isInitiativePhase =
    phase === "rollingInitiative" || phase === "viewingInitiative";
  const initiativeDiceFaces = enemy.initiativeDice ?? [6, 6, 6];
  const initiativeMin = initiativeDiceFaces.length;
  const initiativeMax = initiativeDiceFaces.reduce((a, b) => a + b, 0);
  const initiativeRange = `${initiativeMin}-${initiativeMax}`;

  const blockPillClass =
    enemy.block > 0
      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
      : "border-gray-600 bg-gray-600 text-slate-300";

  const rangePillClass =
    enemy.attackRange > 1
      ? "border-amber-500 bg-amber-400 text-slate-900 shadow-md shadow-amber-400/35"
      : "border-gray-600 bg-gray-600 text-slate-300";

  const pillBase =
    "inline-flex min-w-0 items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors sm:text-xs";

  return (
    <div
      onClick={isTargetable ? onClick : undefined}
      className={`
        relative min-w-0 max-w-full w-full rounded-xl border-2 p-3 shadow-lg
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

      <div className="flex flex-col gap-2">
        {/* Duas metades com mesma largura + divisor vertical */}
        <div className="flex w-full min-w-0 items-stretch gap-3">
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
            <h3
              className="w-full min-w-0 truncate px-0.5 text-center text-xs font-bold leading-tight text-white sm:text-sm"
              title={enemy.name}
            >
              {enemy.name}
            </h3>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border-2 border-slate-600 bg-slate-800">
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

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0 text-xs text-red-400" aria-hidden>
                ❤️
              </span>
              <span
                className={`${pillBase} ${hpPillClass}`}
                title={`Vida: ${enemy.hp} de ${enemy.maxHp}`}
              >
                {enemy.hp}/{enemy.maxHp}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0 text-xs text-blue-400" aria-hidden>
                🛡️
              </span>
              <span
                className={`${pillBase} ${blockPillClass}`}
                title={`Bloqueio: ${enemy.block}`}
              >
                {enemy.block}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0 text-sm leading-none" title="Alcance">
                🏹
              </span>
              <span
                className={`${pillBase} ${rangePillClass}`}
                title={
                  enemy.attackRange > 1
                    ? `Alcance: ${enemy.attackRange} hexes (ataque à distância)`
                    : `Alcance: ${enemy.attackRange} (corpo a corpo)`
                }
              >
                {enemy.attackRange}
              </span>
            </div>
          </div>
        </div>

        {/* Iniciativa: min-h cobre dado sm + valor + borda (sm+); no mobile dado menor → min-h-12 basta */}
        {isInitiativePhase && (
          <div className="flex min-h-12 w-full flex-wrap items-center justify-center gap-x-1 gap-y-0.5 border-t border-slate-600 pt-2 sm:min-h-14">
            {initiativeDice ? (
              <>
                {initiativeDice.dice.map((d, di) => (
                  <DiceIcon
                    key={di}
                    faces={initiativeDice.diceFaces?.[di] ?? 6}
                    value={d}
                    size="sm"
                    highlighted={d === initiativeDice.highestDie}
                  />
                ))}
                <span className="text-xs font-bold text-red-400">
                  ={initiativeDice.total}
                </span>
                <span className="text-[10px] font-bold tabular-nums text-slate-500">
                  {initiativeRange}
                </span>
              </>
            ) : (
              <>
                {initiativeDiceFaces.map((faces, i) => (
                  <DiceIcon key={i} faces={faces} size="sm" />
                ))}
                <span className="text-[10px] font-bold tabular-nums text-slate-500">
                  {initiativeRange}
                </span>
              </>
            )}
          </div>
        )}

        {/* Intenção: mesma escala de min-h que iniciativa (cartão estável entre fases) */}
        {!isInitiativePhase && actionCard && (
          <div
            className="flex min-h-12 w-full flex-wrap items-center justify-center gap-2 border-t border-slate-600 pt-2 sm:min-h-14"
            title={actionCard.name}
          >
            {actionCard.actions.map((action, index) => {
              const info = actionIcons[action.type];
              return (
                <span
                  key={index}
                  className={`text-sm ${info.color}`}
                  title={`${info.label}: ${action.value}`}
                >
                  {info.icon}
                  <span className="text-xs font-bold">{action.value}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
