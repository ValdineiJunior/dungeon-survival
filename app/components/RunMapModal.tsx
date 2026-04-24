"use client";

import { MapRoomLocation, RunGeneratedMap } from "@/app/types/game";
import { ENEMY_DEFINITIONS } from "@/app/lib/enemies";
import { RunMapGraph, runMapLocationColor } from "@/app/components/RunMapGraph";
import { runMapLocationLabel } from "@/app/lib/runMapLabels";

interface RunMapModalProps {
  runMap: RunGeneratedMap;
  onClose: () => void;
}

export function RunMapModal({ runMap, onClose }: RunMapModalProps) {
  const bossDef = ENEMY_DEFINITIONS[runMap.bossDefinitionId];
  const bossTitle = bossDef?.name ?? runMap.bossDefinitionId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="mx-4 flex max-h-[88vh] w-full max-w-3xl flex-col rounded-2xl border-2 border-slate-600 bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-600 p-4">
          <div>
            <h2 className="text-xl font-bold text-amber-400">
              Mapa da corrida
            </h2>
            <p className="text-xs text-slate-400">
              Somente leitura — chefe: {bossTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="aspect-[10/11] w-full min-h-[280px] rounded-xl border border-slate-600/80 bg-slate-950/80 p-2">
            <RunMapGraph runMap={runMap} className="h-full w-full" />
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-400">
            {(
              [
                "monster",
                "treasure",
                "merchant",
                "rest",
                "boss",
              ] as MapRoomLocation[]
            ).map((loc) => (
              <span key={loc} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-slate-600"
                  style={{ backgroundColor: runMapLocationColor(loc) }}
                />
                {runMapLocationLabel(loc)}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            Identificação nos círculos: <strong className="font-medium text-slate-400">andar·coluna</strong>{" "}
            (ex.: <span className="font-mono text-slate-400">1·6</span> = Andar 1, col 6). Chefe:{" "}
            <span className="font-mono text-slate-400">Chefe</span>.
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Andar 1: monstro fixo · Andar 4: tesouro fixo · Andar{" "}
            {runMap.bossFloor - 1}: descanso fixo
          </p>
        </div>

        <div className="border-t border-slate-600 p-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-600 px-6 py-2 text-sm text-white transition-colors hover:bg-slate-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
