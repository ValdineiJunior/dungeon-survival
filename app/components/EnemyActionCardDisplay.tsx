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

function ActionDisplay({ action }: { action: EnemyAction }) {
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
      <div className={`
        flex items-center gap-2 px-2 py-1 rounded
        ${isCurrentAction ? 'bg-red-900/50 border border-red-500' : 'bg-slate-700/50'}
      `}>
        {actionCard.actions.map((action, index) => (
          <ActionDisplay key={index} action={action} />
        ))}
      </div>
    );
  }

  return (
    <div className={`
      w-28 rounded-lg border-2 overflow-hidden
      ${isCurrentAction 
        ? 'border-red-500 bg-gradient-to-b from-red-950 to-red-900 ring-2 ring-red-400 ring-offset-1 ring-offset-slate-900' 
        : 'border-slate-600 bg-gradient-to-b from-slate-800 to-slate-900'
      }
    `}>
      {/* Card Header */}
      <div className={`
        px-2 py-1 text-center text-xs font-bold truncate
        ${isCurrentAction ? 'bg-red-800 text-red-200' : 'bg-slate-700 text-slate-300'}
      `}>
        {actionCard.name}
      </div>

      {/* Actions */}
      <div className="p-2 space-y-1">
        {actionCard.actions.map((action, index) => (
          <div 
            key={index} 
            className={`
              flex items-center justify-between px-2 py-1 rounded text-sm
              ${isCurrentAction ? 'bg-red-800/50' : 'bg-slate-700/50'}
            `}
          >
            <span className="text-slate-400">{actionIcons[action.type]}</span>
            <span className={`font-bold ${actionColors[action.type]}`}>
              {action.value}
            </span>
          </div>
        ))}
      </div>

      {/* Current action indicator */}
      {isCurrentAction && (
        <div className="px-2 py-1 text-center text-xs text-red-300 bg-red-900/50 border-t border-red-700">
          Próxima ação
        </div>
      )}
    </div>
  );
}
