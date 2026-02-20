'use client';

import { useEffect, useRef } from 'react';
import { GameLogEntry } from '@/app/types/game';

interface GameLogModalProps {
  logs: GameLogEntry[];
  onClose: () => void;
}

function getLogEntryColor(type: GameLogEntry['type']): string {
  switch (type) {
    case 'playerAttack':
      return 'text-amber-400';
    case 'playerBlock':
      return 'text-blue-400';
    case 'playerMove':
      return 'text-green-400';
    case 'enemyAttack':
      return 'text-red-400';
    case 'enemyBlock':
      return 'text-orange-400';
    case 'enemyMove':
      return 'text-orange-300';
    case 'enemyDefeated':
      return 'text-purple-400';
    case 'turnStart':
      return 'text-slate-300 font-bold';
    case 'turnEnd':
      return 'text-slate-500';
    case 'floorStart':
      return 'text-emerald-400 font-bold';
    case 'innateAbility':
      return 'text-cyan-400';
    default:
      return 'text-slate-300';
  }
}

export function GameLogModal({ logs, onClose }: GameLogModalProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <h2 className="text-xl font-bold text-amber-400">Log de Combate</h2>
              <p className="text-slate-400 text-sm">{logs.length} ações registradas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Log content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Nenhuma ação registrada ainda...
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`py-1 px-2 rounded ${
                  log.type === 'turnStart' ? 'bg-slate-700/50 mt-3' : ''
                } ${log.type === 'floorStart' ? 'bg-emerald-900/30 mt-4 py-2' : ''}`}
              >
                <span className={getLogEntryColor(log.type)}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-600">
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="text-amber-400">● Ataque jogador</span>
            <span className="text-blue-400">● Bloqueio jogador</span>
            <span className="text-red-400">● Ataque inimigo</span>
            <span className="text-purple-400">● Inimigo derrotado</span>
            <span className="text-cyan-400">● Habilidade inata</span>
          </div>
        </div>
      </div>
    </div>
  );
}
