'use client';

import { Enemy, EnemyIntent } from '@/app/types/game';

interface EnemyCardProps {
  enemy: Enemy;
  isTargetable?: boolean;
  isTargeted?: boolean;
  onClick?: () => void;
}

const actionIcons: Record<EnemyIntent, { icon: string; color: string }> = {
  attack: { icon: '⚔️', color: 'text-red-400' },
  defend: { icon: '🛡️', color: 'text-blue-400' },
  buff: { icon: '⬆️', color: 'text-green-400' },
  debuff: { icon: '⬇️', color: 'text-purple-400' },
  move: { icon: '👟', color: 'text-yellow-400' },
};

export function EnemyCard({ enemy, isTargetable, isTargeted, onClick }: EnemyCardProps) {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  const actionCard = enemy.currentActionCard;

  return (
    <button
      onClick={onClick}
      disabled={!isTargetable}
      className={`
        relative p-3 rounded-xl 
        bg-gradient-to-b from-slate-800 to-slate-900
        border-2 
        ${isTargetable 
          ? 'border-yellow-400 shadow-yellow-400/50 hover:bg-slate-700 cursor-pointer animate-pulse ring-2 ring-yellow-400' 
          : isTargeted 
            ? 'border-yellow-400 shadow-yellow-400/50' 
            : 'border-slate-600 cursor-default'
        }
        shadow-lg transition-all duration-200
        w-full
        ${isTargetable ? 'hover:scale-105' : ''}
      `}
    >
      {/* Target indicator */}
      {isTargetable && (
        <div className="absolute -top-2 -left-2 px-2 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">
          🎯 Alvo
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Monster avatar */}
        <div className={`text-3xl ${isTargetable ? 'animate-bounce' : ''}`}>
          {enemy.emoji}
        </div>

        <div className="flex-1">
          {/* Name and hex position */}
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-sm">
              {enemy.name}
            </span>
            <span className="text-slate-500 text-xs font-mono">
              ⬡ {enemy.position.q},{enemy.position.r}
            </span>
          </div>

          {/* HP bar */}
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600 mt-1">
            <div
              className={`h-full transition-all duration-300 ${
                hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          
          {/* HP text and Block */}
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-300">
              ❤️ {enemy.hp}/{enemy.maxHp}
            </span>
            {enemy.block > 0 && (
              <span className="text-blue-400">
                🛡️ {enemy.block}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Enemy Action Card */}
      {actionCard && (
        <div className="mt-2 p-2 rounded-lg bg-red-950/50 border border-red-800">
          <div className="text-xs text-red-300 font-bold mb-1 truncate">
            {actionCard.name}
          </div>
          <div className="flex flex-wrap gap-2">
            {actionCard.actions.map((action, index) => {
              const info = actionIcons[action.type];
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-xs ${info.color}`}
                >
                  <span>{info.icon}</span>
                  <span className="font-bold">{action.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Click hint when targetable */}
      {isTargetable && (
        <div className="mt-2 text-center text-yellow-400 text-xs font-bold">
          Clique para atacar!
        </div>
      )}
    </button>
  );
}
