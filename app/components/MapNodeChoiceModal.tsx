"use client";

import { RunGeneratedMap, MapRoomLocation } from "@/app/types/game";
import { getNextMapChoices } from "@/app/lib/mapPath";

function locationLabel(loc: MapRoomLocation): string {
  switch (loc) {
    case "monster":
      return "Monstro";
    case "treasure":
      return "Tesouro";
    case "merchant":
      return "Mercador";
    case "rest":
      return "Descanso";
    case "boss":
      return "Chefe";
    default:
      return loc;
  }
}

interface MapNodeChoiceModalProps {
  runMap: RunGeneratedMap;
  mapCurrentNodeId: string | null;
  mapRoomsCompleted: number;
  roomsBeforeBoss: number;
  onPickNode: (nodeId: string) => void;
}

export function MapNodeChoiceModal({
  runMap,
  mapCurrentNodeId,
  mapRoomsCompleted,
  roomsBeforeBoss,
  onPickNode,
}: MapNodeChoiceModalProps) {
  const choices = getNextMapChoices(runMap, mapCurrentNodeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-amber-600/80 bg-slate-800 p-5 shadow-2xl md:p-6">
        <h2 className="mb-1 text-center text-xl font-bold text-amber-400 md:text-2xl">
          Próximo destino
        </h2>
        <p className="mb-4 text-center text-sm text-slate-400">
          Salas concluídas: {mapRoomsCompleted}/{roomsBeforeBoss}
        </p>
        <p className="mb-4 text-center text-sm text-slate-300">
          Escolha um nó conectado para continuar subindo até o chefe.
        </p>
        <ul className="flex max-h-[min(50dvh,24rem)] flex-col gap-2 overflow-y-auto">
          {choices.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => onPickNode(n.id)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:border-amber-500/60 hover:bg-slate-700"
              >
                <span className="font-medium">
                  Andar {n.floor}
                  {n.location !== "boss" ? ` · col ${n.col}` : ""}
                </span>
                <span className="rounded-md bg-slate-700 px-2 py-0.5 text-xs text-amber-200">
                  {locationLabel(n.location)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {choices.length === 0 && (
          <p className="mt-4 text-center text-sm text-red-400">
            Nenhum caminho disponível. Reinicie a corrida.
          </p>
        )}
      </div>
    </div>
  );
}
