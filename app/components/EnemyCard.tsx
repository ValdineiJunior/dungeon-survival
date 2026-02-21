"use client";

import { Enemy, EnemyIntent } from "@/app/types/game";

interface EnemyCardProps {
  enemy: Enemy;
  orderNumber: number;
  isTargetable?: boolean;
  isTargeted?: boolean;
  onClick?: () => void;
  onViewActions?: () => void;
}

const actionIcons: Record<EnemyIntent, { icon: string; color: string; label: string }> = {
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
  onViewActions,
}: EnemyCardProps) {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  const actionCard = enemy.currentActionCard;

  const handleViewActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewActions?.();
  };

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
        <div className={`relative text-2xl ${isTargetable ? "animate-bounce" : ""}`}>
          {enemy.emoji}
          <span 
            className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center bg-amber-400 text-black text-[10px] font-bold rounded-full border border-amber-600"
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
              <span className="text-blue-400 text-xs" title={`Bloqueio: ${enemy.block} - Reduz o dano recebido`}>
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
              <span className="text-orange-400" title={`Alcance: ${enemy.attackRange} hexes - Pode atacar à distância!`}>
                📏{enemy.attackRange}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Intent icons - fixed width for up to 3 actions */}
        <div className="flex flex-col items-center gap-1 pl-2 border-l border-slate-600 w-24">
          {/* Label - clickable to view all actions */}
          <button
            onClick={handleViewActions}
            className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-700/50 hover:bg-slate-600 transition-colors border border-slate-600 hover:border-slate-500"
            title="Ver todas as ações"
          >
            Intenção
          </button>

          {/* Action icons */}
          {actionCard && (
            <div className="flex items-center gap-1" title={actionCard.name}>
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

      {/* Click hint when targetable */}
      {isTargetable && (
        <div className="mt-1 text-center text-yellow-400 text-xs font-bold">
          Clique para atacar!
        </div>
      )}
    </div>
  );
}
