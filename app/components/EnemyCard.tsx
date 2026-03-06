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
  const actionCard = enemy.currentActionCard;
  const isInitiativePhase =
    phase === "rollingInitiative" || phase === "viewingInitiative";
  const initiativeDiceFaces = enemy.initiativeDice ?? [6, 6, 6];
  const initiativeMin = initiativeDiceFaces.length;
  const initiativeMax = initiativeDiceFaces.reduce((a, b) => a + b, 0);
  const initiativeRange = `${initiativeMin}-${initiativeMax}`;

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

      <div className="flex items-center gap-2">
        {/* Monster avatar with order number */}
        <div className="shrink-0 w-12 h-12 relative rounded border-2 border-slate-600 bg-slate-800 overflow-hidden">
          {ENEMY_IMAGE_FILES[enemy.name] ? (
            <img
              src={`/enemies/${ENEMY_IMAGE_FILES[enemy.name]}`}
              alt={enemy.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {enemy.emoji}
            </div>
          )}
          <span
            className="absolute -bottom-0 -right-0 w-4 h-4 flex items-center justify-center bg-amber-400 text-black text-[10px] font-bold rounded-full border border-amber-600 z-10"
            title={`Ordem de turno: ${orderNumber}`}
          >
            {orderNumber}
          </span>
        </div>

        {/* Center: Enemy info */}
        <div className="flex-1 min-w-0">
          {/* Name and position */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-white font-bold text-sm truncate">
              {enemy.name}
            </span>
            {enemy.block > 0 && (
              <span
                className="text-blue-400 text-xs"
                title={`Bloqueio: ${enemy.block} - Reduz o dano recebido`}
              >
                🛡️{enemy.block}
              </span>
            )}
          </div>

          {/* HP bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600 mt-1">
            <div
              className={`h-full transition-all duration-300 ${
                hpPercentage > 50
                  ? "bg-green-500"
                  : hpPercentage > 25
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>

          {/* HP text and range */}
          <div className="flex items-center justify-between text-xs text-gray-300 mt-0.5">
            <span title={`Vida: ${enemy.hp} de ${enemy.maxHp}`}>
              ❤️ {enemy.hp}/{enemy.maxHp}
            </span>
            {enemy.attackRange > 1 && (
              <span
                className="text-orange-400"
                title={`Alcance: ${enemy.attackRange} hexes - Pode atacar à distância!`}
              >
                📏{enemy.attackRange}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Dice pool during initiative, or intent icons otherwise */}
        <div className="flex flex-col items-center gap-1 pl-2 border-l border-slate-600 w-28">
          {isInitiativePhase ? (
            /* Dice pool: 3 dice per enemy, configurable faces per enemy type */
            <div className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-slate-500 font-bold">
                Iniciativa
              </div>
              {initiativeDice ? (
                /* Viewing phase: show rolled dice with icons */
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-0.5 flex-wrap justify-center">
                    {initiativeDice.dice.map((d, di) => (
                      <DiceIcon
                        key={di}
                        faces={initiativeDice.diceFaces?.[di] ?? 6}
                        value={d}
                        size="sm"
                        highlighted={d === initiativeDice.highestDie}
                      />
                    ))}
                    <span className="ml-0.5 text-xs font-bold text-red-400">
                      ={initiativeDice.total}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {initiativeRange}
                  </span>
                </div>
              ) : (
                /* Rolling phase: show pool (e.g. 3 dice with enemy's config) */
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="flex items-center gap-0.5 flex-wrap justify-center"
                    title={`${initiativeDiceFaces.map((f) => `d${f}`).join(" + ")} - Aguardando rolagem`}
                  >
                    {initiativeDiceFaces.map((faces, i) => (
                      <DiceIcon key={i} faces={faces} size="sm" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {initiativeRange}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Normal gameplay: label + action icons */
            <div className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-slate-500 font-bold">
                Intenção
              </div>
              {actionCard && (
                <div
                  className="flex items-center gap-1"
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
                        <span className="text-xs font-bold">
                          {action.value}
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
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
