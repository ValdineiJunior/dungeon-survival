'use client';

import type { MapRoomLocation, RunGeneratedMap, RunMapNode } from '@/app/types/game';
import { runMapNodeGraphCaption } from '@/app/lib/runMapLabels';

export function runMapLocationColor(loc: RunMapNode['location']): string {
  switch (loc) {
    case 'monster':
      return '#f87171';
    case 'treasure':
      return '#fbbf24';
    case 'merchant':
      return '#60a5fa';
    case 'rest':
      return '#4ade80';
    case 'boss':
      return '#c084fc';
    default:
      return '#94a3b8';
  }
}

export function runMapLocationLabel(loc: MapRoomLocation): string {
  switch (loc) {
    case 'monster':
      return 'Monstro';
    case 'treasure':
      return 'Tesouro';
    case 'merchant':
      return 'Mercador';
    case 'rest':
      return 'Descanso';
    case 'boss':
      return 'Chefe';
    default:
      return loc;
  }
}

function toSvgY(layoutY: number): number {
  return 100 - layoutY;
}

export interface RunMapGraphProps {
  runMap: RunGeneratedMap;
  /** Node the player is on (after first pick). Highlighted in gold. */
  mapCurrentNodeId?: string | null;
  /** Valid next picks — dashed amber ring. */
  choiceNodeIds?: readonly string[];
  /** Applied to the root SVG (e.g. `h-full w-full`). */
  className?: string;
}

export function RunMapGraph({
  runMap,
  mapCurrentNodeId = null,
  choiceNodeIds = [],
  className,
}: RunMapGraphProps) {
  const nodeById = new Map(runMap.nodes.map((n) => [n.id, n]));
  const choiceSet = new Set(choiceNodeIds);

  return (
    <svg
      viewBox="0 0 100 108"
      className={className ?? 'h-full w-full'}
      aria-hidden
    >
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
        const r = n.location === 'boss' ? 2.8 : 2.1;
        const caption = runMapNodeGraphCaption(n);
        const fs =
          n.location === 'boss'
            ? caption.length > 4
              ? 1.75
              : 2.1
            : caption.length > 4
              ? 1.45
              : 1.65;
        const isCurrent = mapCurrentNodeId != null && n.id === mapCurrentNodeId;
        const isChoice = choiceSet.has(n.id);

        return (
          <g key={n.id}>
            {(isCurrent || isChoice) && (
              <circle
                cx={cx}
                cy={cy}
                r={r + 0.85}
                fill="none"
                stroke={isCurrent ? '#fbbf24' : '#f59e0b'}
                strokeWidth={isCurrent ? 0.42 : 0.32}
                strokeDasharray={isCurrent ? undefined : '0.55 0.35'}
                strokeOpacity={0.95}
              />
            )}
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
              fill={runMapLocationColor(n.location)}
              stroke="#1e293b"
              strokeWidth={0.15}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#f8fafc"
              fontSize={fs}
              fontWeight={700}
              fontFamily="system-ui, sans-serif"
              paintOrder="stroke"
              stroke="#0f172a"
              strokeWidth={0.2}
              strokeLinejoin="round"
            >
              {caption}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
