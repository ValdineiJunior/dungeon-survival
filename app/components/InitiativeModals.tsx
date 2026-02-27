'use client';

import { InitiativeResult } from '@/app/types/game';

// ─── Dice Choice Modal ──────────────────────────────────────────────────────

interface InitiativeRollModalProps {
    onRoll: (dice: '2d6' | '2d3') => void;
    turn: number;
}

export function InitiativeRollModal({ onRoll, turn }: InitiativeRollModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="bg-slate-900 rounded-2xl border-2 border-amber-600 shadow-2xl w-full max-w-md mx-4 p-6 text-center">
                <div className="text-4xl mb-3">🎲</div>
                <h2 className="text-2xl font-bold text-amber-400 mb-1">Rolagem de Iniciativa</h2>
                <p className="text-slate-400 text-sm mb-6">Turno {turn} — Escolha seu dado</p>

                <p className="text-slate-300 text-sm mb-6">
                    Escolha como você quer rolar a iniciativa deste turno.<br />
                    <span className="text-amber-300 font-semibold">Maior resultado age primeiro.</span>
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {/* 2d6 option */}
                    <button
                        onClick={() => onRoll('2d6')}
                        className="group relative flex flex-col items-center gap-2 px-4 py-6 bg-blue-900/40 hover:bg-blue-800/60 border-2 border-blue-600 hover:border-blue-400 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                        <span className="text-5xl">⚄⚄</span>
                        <div>
                            <div className="text-xl font-bold text-blue-300 group-hover:text-white">2d6</div>
                            <div className="text-xs text-slate-400 group-hover:text-slate-300">Resultado: 2–12</div>
                        </div>
                        <div className="text-[10px] text-blue-400 mt-1 opacity-75">Alta variância</div>
                    </button>

                    {/* 2d3 option */}
                    <button
                        onClick={() => onRoll('2d3')}
                        className="group relative flex flex-col items-center gap-2 px-4 py-6 bg-purple-900/40 hover:bg-purple-800/60 border-2 border-purple-600 hover:border-purple-400 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                        <span className="text-5xl">⚂⚂</span>
                        <div>
                            <div className="text-xl font-bold text-purple-300 group-hover:text-white">2d3</div>
                            <div className="text-xs text-slate-400 group-hover:text-slate-300">Resultado: 2–6</div>
                        </div>
                        <div className="text-[10px] text-purple-400 mt-1 opacity-75">Mais previsível</div>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Turn Order Modal ────────────────────────────────────────────────────────

interface InitiativeOrderModalProps {
    turnOrder: InitiativeResult[];
    turn: number;
    onConfirm: () => void;
}

export function InitiativeOrderModal({ turnOrder, turn, onConfirm }: InitiativeOrderModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="bg-slate-900 rounded-2xl border-2 border-amber-600 shadow-2xl w-full max-w-sm mx-4 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-4 pb-2 text-center border-b border-amber-800/50">
                    <div className="text-3xl mb-1">⚔️</div>
                    <h2 className="text-xl font-bold text-amber-400">Ordem de Iniciativa</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Turno {turn}</p>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {turnOrder.map((entry, i) => (
                        <div
                            key={entry.id}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-all ${entry.entityType === 'player'
                                    ? 'bg-emerald-900/30 border-emerald-700/60'
                                    : 'bg-red-900/20 border-red-800/40'
                                }`}
                        >
                            {/* Position badge */}
                            <div className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-amber-400 text-black' : 'bg-slate-700 text-slate-300'
                                }`}>
                                {i + 1}
                            </div>

                            {/* Emoji */}
                            <span className="text-xl shrink-0">{entry.emoji}</span>

                            {/* Name + dice */}
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate text-white">{entry.name}</div>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {entry.dice.map((d, di) => (
                                        <span
                                            key={di}
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${d === entry.highestDie
                                                    ? 'bg-amber-500/30 text-amber-300 border border-amber-600/50'
                                                    : 'bg-slate-700 text-slate-400'
                                                }`}
                                        >
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className={`shrink-0 text-lg font-bold ${entry.entityType === 'player' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {entry.total}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-amber-800/50">
                    <button
                        onClick={onConfirm}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors text-sm"
                    >
                        Começar Turno ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
