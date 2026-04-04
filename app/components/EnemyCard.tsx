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
    "inline-flex min-w-[2.75rem] items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors sm:text-xs";

  return (
    <div
      onClick={isTargetable ? onClick : undefined}
      className={`
        relative p-3 rounded-xl 
        bg-linear-to-r from-slate-800 to-slate-900
        border-2 
        ${
          isTargetable
            ? "border-yellow-400 shadow-yellow-400/50 hover:bg-slate-700 cursor-pointer animate-pulse ring-2 ring-yellow-400"
            : isTargeted
              ? "border-yellow-400 shadow-yellow-400/50"
              : "border-slate-600"
        }
        shadow-lg transition-all duration-200
        w-full
        ${isTargetable ? "hover:scale-105" : ""}
      `}
    >
      {/* Target indicator */}
      {isTargetable && (
        <div className="absolute -top-2 -left-2 px-2 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">
          🎯 Alvo
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Coluna esquerda: nome acima da imagem; direita: pills */}
        <div className="flex items-stretch gap-3">
          <div
            className={`flex w-16 shrink-0 flex-col items-center gap-1.5 ${isTargetable ? "pt-0.5" : ""}`}
          >
            <h3 className="w-full min-w-0 text-center text-[11px] font-bold leading-tight text-white sm:text-xs">
              <span className="line-clamp-3 wrap-break-word">{enemy.name}</span>
            </h3>
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border-2 border-slate-600 bg-slate-800">
              {ENEMY_IMAGE_FILES[enemy.name] ? (
                <img
                  src={`/enemies/${ENEMY_IMAGE_FILES[enemy.name]}`}
                  alt={enemy.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">
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
              <span className="shrink-0 text-xs text-amber-400" aria-hidden>
                📏
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

        {/* Dados de iniciativa (sem rótulo) */}
        {isInitiativePhase && (
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 border-t border-slate-600 pt-2">
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

        {/* Intenção (fora da fase de iniciativa) */}
        {!isInitiativePhase && (
          <div className="flex flex-col gap-1 border-t border-slate-600 pt-2">
            <div className="text-center text-[10px] font-bold text-slate-500">
              Intenção
            </div>
            {actionCard && (
              <div
                className="flex flex-wrap items-center justify-center gap-2"
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
        )}
      </div>

      {/* Click hint when targetable */}
      {isTargetable && (
        <div className="mt-1 text-center text-yellow-400 text-xs font-bold">
          Clique para atacar!
        </div>
      )}
    </div>
  );
}
