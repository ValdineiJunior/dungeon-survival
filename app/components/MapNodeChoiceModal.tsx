"use client";

import { RunGeneratedMap } from "@/app/types/game";
import { getNextMapChoices } from "@/app/lib/mapPath";
import { RunMapGraph } from "@/app/components/RunMapGraph";

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
  const hasChoices = choiceIds.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div className="flex h-[min(94dvh,56rem)] max-h-[min(94dvh,56rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border-2 border-amber-600/80 bg-slate-800 shadow-2xl md:max-w-3xl">
        <div className="shrink-0 border-b border-slate-600/80 p-4 pb-3 md:p-5 md:pb-4">
          <h2 className="mb-1 text-center text-xl font-bold text-amber-400 md:text-2xl">
            Próximo destino
          </h2>
          <p className="mb-1 text-center text-sm text-slate-400">
            Salas concluídas: {mapRoomsCompleted}/{roomsBeforeBoss}
          </p>
          <p className="text-center text-sm text-slate-300">
            {hasChoices
              ? "Toque num nó com contorno âmbar tracejado para continuar subindo até o chefe."
              : "Não há destinos disponíveis neste mapa."}
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-slate-950/40 px-3 py-3 md:px-4">
          <p className="mb-2 shrink-0 text-center text-[10px] uppercase tracking-wide text-slate-500">
            Mapa — ouro: onde você está · âmbar tracejado: toque para escolher ·
            role para ver tudo
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain rounded-lg border border-slate-600/70 bg-slate-950/90 p-2 touch-pan-y">
            <div className="mx-auto w-full max-w-2xl aspect-[100/108] min-w-[min(100%,18rem)] md:max-w-none">
              <RunMapGraph
                runMap={runMap}
                mapCurrentNodeId={mapCurrentNodeId}
                choiceNodeIds={choiceIds}
                onChoiceNodeClick={hasChoices ? onPickNode : undefined}
                className="block h-full w-full"
              />
            </div>
          </div>
          {!hasChoices && (
            <p className="mt-3 shrink-0 text-center text-sm text-red-400">
              Nenhum caminho disponível. Reinicie a corrida.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
