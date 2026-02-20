'use client';

import { Card as CardType } from '@/app/types/game';
import { Card } from './Card';

interface CardListModalProps {
  title: string;
  cards: CardType[];
  onClose: () => void;
  showColors?: boolean;
}

export function CardListModal({ title, cards, onClose, showColors = false }: CardListModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <h2 className="text-xl font-bold text-amber-400">{title}</h2>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{cards.length} cartas</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {cards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
              {cards.map((card, index) => (
                <div key={`${card.id}-${index}`} className="transform scale-90">
                  <Card card={card} disabled grayscale={!showColors} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500">
              Nenhuma carta
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-600 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
