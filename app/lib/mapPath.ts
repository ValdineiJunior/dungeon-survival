import { MAX_FLOOR, RunGeneratedMap, RunMapNode } from '@/app/types/game';

function nodeById(runMap: RunGeneratedMap): Map<string, RunMapNode> {
  return new Map(runMap.nodes.map((n) => [n.id, n]));
}

/** Valid next nodes: floor 1 when current is null; else neighbors strictly upward or boss from floor MAX_FLOOR. */
export function getNextMapChoices(
  runMap: RunGeneratedMap,
  currentNodeId: string | null,
): RunMapNode[] {
  const byId = nodeById(runMap);
  if (currentNodeId === null) {
    return runMap.nodes
      .filter((n) => n.floor === 1)
      .sort((a, b) => a.col - b.col || a.id.localeCompare(b.id));
  }
  const cur = byId.get(currentNodeId);
  if (!cur) return [];
  const out: RunMapNode[] = [];
  for (const nid of cur.neighborIds) {
    const n = byId.get(nid);
    if (!n) continue;
    if (n.id === runMap.bossNodeId && cur.floor === MAX_FLOOR) {
      out.push(n);
      continue;
    }
    if (n.floor > cur.floor) out.push(n);
  }
  return out.sort((a, b) => a.floor - b.floor || a.col - b.col || a.id.localeCompare(b.id));
}
