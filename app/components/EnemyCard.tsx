'use client';

import { Enemy } from '@/app/types/game';

interface EnemyCardProps {
  enemy: Enemy;
  isTargetable?: boolean;
  isTargeted?: boolean;
  onClick?: () => void;
}

export function EnemyCard({ enemy, isTargetable, isTargeted, onClick }: EnemyCardProps) {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  
  const intentIcons = {
    attack: { icon: '⚔️', color: 'text-red-400', label: 'Atacar' },
    defend: { icon: '🛡️', color: 'text-blue-400', label: 'Defender' },
    buff: { icon: '⬆️', color: 'text-green-400', label: 'Fortalecer' },
    debuff: { icon: '⬇️', color: 'text-purple-400', label: 'Enfraquecer' },
    move: { icon: '👟', color: 'text-yellow-400', label: 'Mover' },
  };

  const intentInfo = intentIcons[enemy.intent];

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
          🎯 Target
        </div>
      )}

      {/* Enemy intent */}
      <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full bg-slate-950 border border-slate-600 flex items-center gap-1 text-xs ${intentInfo.color}`}>
        <span>{intentInfo.icon}</span>
        <span className="font-bold">{enemy.intentValue}</span>
      </div>

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
      
      {/* Click hint when targetable */}
      {isTargetable && (
        <div className="mt-2 text-center text-yellow-400 text-xs font-bold">
          Click to attack!
        </div>
      )}
    </button>
  );
}
