'use client';

import { EnemyActionCard, EnemyAction } from '@/app/types/game';

interface EnemyActionCardDisplayProps {
  actionCard: EnemyActionCard;
  isCurrentAction?: boolean;
  compact?: boolean;
}

const actionIcons: Record<string, string> = {
  attack: '⚔️',
  defend: '🛡️',
  move: '👟',
  buff: '⬆️',
  debuff: '⬇️',
};

const actionColors: Record<string, string> = {
  attack: 'text-red-400',
  defend: 'text-blue-400',
  move: 'text-green-400',
  buff: 'text-yellow-400',
  debuff: 'text-purple-400',
};

const actionDescriptions: Record<string, (value: number) => string> = {
  attack: (value) => `Causa ${value} de dano`,
  defend: (value) => `Ganha ${value} de bloqueio`,
  move: (value) => `Move ${value} hex`,
  buff: (value) => `Aumenta força em ${value}`,
  debuff: (value) => `Reduz força em ${value}`,
};

function ActionDisplay({ action, showDescription }: { action: EnemyAction; showDescription?: boolean }) {
  if (showDescription) {
    return (
      <div className={`flex items-center gap-2 ${actionColors[action.type]}`}>
        <span>{actionIcons[action.type]}</span>
        <span className="text-sm">{actionDescriptions[action.type](action.value)}</span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-1 ${actionColors[action.type]}`}>
      <span>{actionIcons[action.type]}</span>
      <span className="font-bold">{action.value}</span>
    </div>
  );
}

export function EnemyActionCardDisplay({ actionCard, isCurrentAction, compact }: EnemyActionCardDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-700/50">
        {actionCard.actions.map((action, index) => (
          <ActionDisplay key={index} action={action} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-48 rounded-lg border-2 overflow-hidden border-slate-600 bg-gradient-to-b from-slate-800 to-slate-900">
      {/* Card Header */}
      <div className="px-2 py-1.5 text-center text-sm font-bold truncate bg-slate-700 text-slate-300">
        {actionCard.name}
      </div>

      {/* Actions with descriptions */}
      <div className="p-2 space-y-1.5">
        {actionCard.actions.map((action, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs bg-slate-700/50"
          >
            <span>{actionIcons[action.type]}</span>
            <span className={actionColors[action.type]}>
              {actionDescriptions[action.type](action.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Current action indicator */}
      {isCurrentAction && (
        <div className="px-2 py-1 text-center text-xs text-amber-400 bg-slate-700/50 border-t border-slate-600">
          Ação Atual
        </div>
      )}
    </div>
  );
}
