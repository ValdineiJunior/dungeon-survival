"use client";

import { RunGeneratedMap } from "@/app/types/game";
import { getNextMapChoices } from "@/app/lib/mapPath";
import { runMapNodeChoiceTitle } from "@/app/lib/runMapLabels";
import { RunMapGraph, runMapLocationLabel } from "@/app/components/RunMapGraph";

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

  const choiceIds = choices.map((n) => n.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div className="flex max-h-[min(92dvh,52rem)] w-full max-w-xl flex-col rounded-2xl border-2 border-amber-600/80 bg-slate-800 shadow-2xl md:max-w-2xl">
        <div className="shrink-0 border-b border-slate-600/80 p-4 pb-3 md:p-5 md:pb-4">
          <h2 className="mb-1 text-center text-xl font-bold text-amber-400 md:text-2xl">
            Próximo destino
          </h2>
          <p className="mb-1 text-center text-sm text-slate-400">
            Salas concluídas: {mapRoomsCompleted}/{roomsBeforeBoss}
          </p>
          <p className="text-center text-sm text-slate-300">
            Escolha um nó conectado para continuar subindo até o chefe.
          </p>
        </div>

        <div className="min-h-0 shrink-0 border-b border-slate-600/60 bg-slate-950/40 px-3 py-3 md:px-4">
          <p className="mb-2 text-center text-[10px] uppercase tracking-wide text-slate-500">
            Mapa — ouro: onde você está · tracejado âmbar: destinos possíveis
          </p>
          <div className="mx-auto aspect-[10/11] w-full max-h-[min(36dvh,260px)] min-h-[160px] max-w-md rounded-lg border border-slate-600/70 bg-slate-950/90 p-1.5 md:max-h-[min(38dvh,280px)]">
            <RunMapGraph
              runMap={runMap}
              mapCurrentNodeId={mapCurrentNodeId}
              choiceNodeIds={choiceIds}
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pt-3 md:p-5 md:pt-4">
          <ul className="flex flex-col gap-2">
            {choices.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => onPickNode(n.id)}
                  className="flex w-full flex-col items-stretch gap-0.5 rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:border-amber-500/60 hover:bg-slate-700"
                >
                  <span className="font-medium text-slate-100">
                    {runMapNodeChoiceTitle(n)}
                  </span>
                  <span className="text-xs text-amber-200/90">
                    {runMapLocationLabel(n.location)}
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
    </div>
  );
}
