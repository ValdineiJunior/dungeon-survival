'use client';

import { EnemyActionCard } from '@/app/types/game';
import { EnemyActionCardDisplay } from './EnemyActionCardDisplay';

interface EnemyActionsModalProps {
  enemyName: string;
  enemyEmoji: string;
  currentActionCard: EnemyActionCard | null;
  drawPile: EnemyActionCard[];
  discardPile: EnemyActionCard[];
  onClose: () => void;
}

interface CardRowProps {
  title: string;
  icon: string;
  cards: EnemyActionCard[];
  emptyMessage: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  isCurrentSection?: boolean;
}

function CardRow({ title, icon, cards, emptyMessage, bgColor, borderColor, textColor, isCurrentSection }: CardRowProps) {
  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-3`}>
      <div className={`flex items-center gap-2 mb-3 ${textColor}`}>
        <span className="text-lg">{icon}</span>
        <span className="font-bold">{title}</span>
        <span className="text-sm opacity-70">({cards.length})</span>
      </div>
      {cards.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {cards.map((card, index) => (
            <div key={`${card.id}-${index}`} className="flex-shrink-0">
              <EnemyActionCardDisplay
                actionCard={card}
                isCurrentAction={isCurrentSection}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-500 text-sm italic text-center py-4">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export function EnemyActionsModal({ 
  enemyName, 
  enemyEmoji, 
  currentActionCard,
  drawPile,
  discardPile,
  onClose 
}: EnemyActionsModalProps) {
  // Sort cards by name to hide the draw order
  const sortedDrawPile = [...drawPile].sort((a, b) => a.name.localeCompare(b.name));
  const sortedDiscardPile = [...discardPile].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="bg-slate-800 rounded-2xl border-2 border-red-800 shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-800 bg-red-950/30">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{enemyEmoji}</span>
            <div>
              <h2 className="text-xl font-bold text-red-400">{enemyName}</h2>
              <p className="text-sm text-slate-400">Deck de ações</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Card Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Current Action */}
          <CardRow
            title="Ação Atual"
            icon="🎴"
            cards={currentActionCard ? [currentActionCard] : []}
            emptyMessage="Nenhuma ação selecionada"
            bgColor="bg-red-950/30"
            borderColor="border-red-700"
            textColor="text-red-400"
            isCurrentSection={true}
          />

          {/* Draw Pile */}
          <CardRow
            title="Pilha de Compra"
            icon="📚"
            cards={sortedDrawPile}
            emptyMessage="Pilha vazia - será embaralhada no próximo turno"
            bgColor="bg-amber-950/20"
            borderColor="border-amber-700/50"
            textColor="text-amber-400"
          />

          {/* Discard Pile */}
          <CardRow
            title="Pilha de Descarte"
            icon="🗑️"
            cards={sortedDiscardPile}
            emptyMessage="Nenhuma carta descartada"
            bgColor="bg-slate-900/50"
            borderColor="border-slate-600"
            textColor="text-slate-400"
          />
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-red-800 bg-red-950/20">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="text-red-400">⚔️</span> Ataque
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-400">🛡️</span> Defesa
            </span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">👟</span> Movimento
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">⬆️</span> Buff
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-red-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
