import type { RunMapNode } from '@/app/types/game';

/** First line in node lists (matches in-graph caption semantics). */
export function runMapNodeChoiceTitle(n: RunMapNode): string {
  if (n.location === 'boss') return `Andar ${n.floor}`;
  return `Andar ${n.floor} · col ${n.col}`;
}

/** Short text drawn inside map circles (e.g. 1·6 ↔ Andar 1, col 6). */
export function runMapNodeGraphCaption(n: RunMapNode): string {
  if (n.location === 'boss') return 'Chefe';
  return `${n.floor}·${n.col}`;
}
