import { Card } from "@/app/types/game";
import { Card as CardComponent } from "./Card";

interface BurnCardModalProps {
    hand: Card[];
    cardsToBurn: number;
    onConfirm: (cardId: string) => void;
    onCancel: () => void;
}

export function BurnCardModal({ hand, cardsToBurn, onConfirm, onCancel }: BurnCardModalProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-md md:rounded-xl p-1 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-orange-500">🔥 Queimar Cartas</h2>
                        <p className="text-slate-400 text-sm mt-1">Selecione {cardsToBurn} carta(s) da sua mão para ser(em) destruída(s) para sempre nesta jornada.</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-slate-400 hover:text-white"
                    >
                        ✕ Cancelar
                    </button>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    {hand.map((card) => (
                        <div key={card.id} className="relative group">
                            <CardComponent card={card} disabled={false} />

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md md:rounded-xl flex items-center justify-center">
                                <button
                                    onClick={() => onConfirm(card.id)}
                                    className="px-2 py-1 md:px-6 md:py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-md md:rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all"
                                >
                                    Queimar
                                </button>
                            </div>
                        </div>
                    ))}

                    {hand.length === 0 && (
                        <p className="text-slate-500 col-span-full py-8 text-center italic">
                            Não há cartas na mão para queimar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
