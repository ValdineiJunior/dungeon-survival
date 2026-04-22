"use client";

import { MapRoomLocation, RunGeneratedMap, RunMapNode } from "@/app/types/game";
import { ENEMY_DEFINITIONS } from "@/app/lib/enemies";

interface RunMapModalProps {
  runMap: RunGeneratedMap;
  onClose: () => void;
}

function locationLabel(loc: RunMapNode["location"]): string {
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

function locationColor(loc: RunMapNode["location"]): string {
  switch (loc) {
    case "monster":
      return "#f87171";
    case "treasure":
      return "#fbbf24";
    case "merchant":
      return "#60a5fa";
    case "rest":
      return "#4ade80";
    case "boss":
      return "#c084fc";
    default:
      return "#94a3b8";
  }
}

function toSvgY(layoutY: number): number {
  return 100 - layoutY;
}

export function RunMapModal({ runMap, onClose }: RunMapModalProps) {
  const nodeById = new Map(runMap.nodes.map((n) => [n.id, n]));
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
            <svg viewBox="0 0 100 108" className="h-full w-full" aria-hidden>
              {runMap.edges.map((e, i) => {
                const a = nodeById.get(e.fromId);
                const b = nodeById.get(e.toId);
                if (!a || !b) return null;
                const x1 = a.layoutX;
                const y1 = toSvgY(a.layoutY);
                const x2 = b.layoutX;
                const y2 = toSvgY(b.layoutY);
                return (
                  <line
                    key={`${e.fromId}-${e.toId}-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#64748b"
                    strokeWidth={0.35}
                    strokeOpacity={0.85}
                  />
                );
              })}

              {runMap.nodes.map((n) => {
                const cx = n.layoutX;
                const cy = toSvgY(n.layoutY);
                const r = n.location === "boss" ? 2.8 : 2.1;
                return (
                  <g key={n.id}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 0.35}
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth={0.2}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={locationColor(n.location)}
                      stroke="#1e293b"
                      strokeWidth={0.15}
                    />
                  </g>
                );
              })}
            </svg>
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
                  style={{ backgroundColor: locationColor(loc) }}
                />
                {locationLabel(loc)}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
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
