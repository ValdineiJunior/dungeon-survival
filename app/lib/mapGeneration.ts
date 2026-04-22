import {
  MAX_FLOOR,
  MapRoomLocation,
  RunGeneratedMap,
  RunMapEdge,
  RunMapNode,
} from '@/app/types/game';

const MAP_COLS_FULL = [0, 1, 2, 3, 4, 5, 6];
const MAP_COLS_EVEN_ROW = [0, 1, 2, 3, 4, 5];

const NUM_PATH_WAVES = 6;

const BOSS_DEFINITION_POOL = ['dragon', 'darkMage', 'orc'] as const;

const LOCATION_WEIGHTS: { type: MapRoomLocation; weight: number }[] = [
  { type: 'monster', weight: 60 },
  { type: 'treasure', weight: 20 },
  { type: 'merchant', weight: 10 },
  { type: 'rest', weight: 10 },
];

const BOSS_FLOOR = MAX_FLOOR + 1;

function columnsForFloor(floor: number): number[] {
  if (floor < 1 || floor > MAX_FLOOR) return [];
  return floor % 2 === 0 ? [...MAP_COLS_EVEN_ROW] : [...MAP_COLS_FULL];
}

function nodeId(floor: number, col: number): string {
  return `m_${floor}_${col}`;
}

function layoutFor(floor: number, col: number): { layoutX: number; layoutY: number } {
  const stagger = floor % 2 === 0 ? 6 : 0;
  const layoutX = 6 + col * (88 / 6) + stagger;
  const layoutY = 6 + (floor - 1) * (88 / MAX_FLOOR);
  return { layoutX, layoutY };
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function pickWeightedLocation(): MapRoomLocation {
  const total = LOCATION_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const { type, weight } of LOCATION_WEIGHTS) {
    r -= weight;
    if (r <= 0) return type;
  }
  return 'monster';
}

function closestNextFloorCols(currentCol: number, nextFloor: number): number[] {
  const cols = columnsForFloor(nextFloor);
  const withD = cols.map((c) => ({ c, d: Math.abs(c - currentCol) }));
  withD.sort((a, b) => a.d - b.d);
  if (withD.length === 0) return [];
  const uniqDist = [...new Set(withD.map((x) => x.d))].sort((a, b) => a - b);
  const cap = uniqDist[Math.min(2, uniqDist.length - 1)];
  return withD.filter((x) => x.d <= cap).map((x) => x.c);
}

function buildTemplateNodes(): Map<string, RunMapNode> {
  const map = new Map<string, RunMapNode>();
  for (let f = 1; f <= MAX_FLOOR; f++) {
    for (const c of columnsForFloor(f)) {
      const { layoutX, layoutY } = layoutFor(f, c);
      map.set(nodeId(f, c), {
        id: nodeId(f, c),
        floor: f,
        col: c,
        location: 'monster',
        neighborIds: [],
        layoutX,
        layoutY,
      });
    }
  }
  return map;
}

function addUndirectedEdge(
  edges: RunMapEdge[],
  nodeById: Map<string, RunMapNode>,
  a: string,
  b: string,
): void {
  if (a === b) return;
  const na = nodeById.get(a);
  const nb = nodeById.get(b);
  if (!na || !nb) return;
  if (na.neighborIds.includes(b)) return;
  na.neighborIds.push(b);
  nb.neighborIds.push(a);
  edges.push({ fromId: a, toId: b });
}

function tryAddPathEdge(
  edges: RunMapEdge[],
  nodeById: Map<string, RunMapNode>,
  fromId: string,
  toId: string,
): boolean {
  const na = nodeById.get(fromId);
  const nb = nodeById.get(toId);
  if (!na || !nb) return false;
  if (na.neighborIds.includes(toId)) return true;

  addUndirectedEdge(edges, nodeById, fromId, toId);
  return true;
}

function growPathWave(
  nodeById: Map<string, RunMapNode>,
  edges: RunMapEdge[],
  startCol: number,
): void {
  let col = startCol;
  for (let f = 1; f < MAX_FLOOR; f++) {
    const pool = closestNextFloorCols(col, f + 1);
    shuffleInPlace(pool);
    let placed = false;
    for (const nextCol of pool) {
      const fromId = nodeId(f, col);
      const toId = nodeId(f + 1, nextCol);
      if (tryAddPathEdge(edges, nodeById, fromId, toId)) {
        col = nextCol;
        placed = true;
        break;
      }
    }
    if (!placed) {
      const rest = columnsForFloor(f + 1).filter((c) => !pool.includes(c));
      shuffleInPlace(rest);
      for (const nextCol of rest) {
        const fromId = nodeId(f, col);
        const toId = nodeId(f + 1, nextCol);
        if (tryAddPathEdge(edges, nodeById, fromId, toId)) {
          col = nextCol;
          break;
        }
      }
    }
  }
}

function pruneOrphans(nodeById: Map<string, RunMapNode>, edges: RunMapEdge[]): void {
  const toRemove: string[] = [];
  for (const [id, n] of nodeById) {
    if (n.neighborIds.length === 0) toRemove.push(id);
  }
  for (const id of toRemove) {
    nodeById.delete(id);
  }
  const filtered = edges.filter(
    (e) => nodeById.has(e.fromId) && nodeById.has(e.toId),
  );
  edges.length = 0;
  edges.push(...filtered);
  for (const n of nodeById.values()) {
    n.neighborIds = n.neighborIds.filter((nid) => nodeById.has(nid));
  }
}

/** Undirected connected components as sets of node ids. */
function findComponents(nodeById: Map<string, RunMapNode>): Set<string>[] {
  const visited = new Set<string>();
  const components: Set<string>[] = [];
  for (const startId of nodeById.keys()) {
    if (visited.has(startId)) continue;
    const comp = new Set<string>();
    const stack = [startId];
    while (stack.length > 0) {
      const id = stack.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      comp.add(id);
      const n = nodeById.get(id);
      if (!n) continue;
      for (const nid of n.neighborIds) {
        if (nodeById.has(nid) && !visited.has(nid)) stack.push(nid);
      }
    }
    components.push(comp);
  }
  return components;
}

/**
 * Keep a single navigable mass: the largest connected component that touches
 * floor 1 (Slay-the-Spire style — always a path from some start to the top).
 */
function keepLargestFloor1TouchingComponent(
  nodeById: Map<string, RunMapNode>,
  edges: RunMapEdge[],
): void {
  const components = findComponents(nodeById);
  const touching = components.filter((comp) =>
    [...comp].some((id) => nodeById.get(id)?.floor === 1),
  );
  if (touching.length === 0) {
    nodeById.clear();
    edges.length = 0;
    return;
  }
  let best = touching[0];
  for (const comp of touching) {
    if (comp.size > best.size) {
      best = comp;
      continue;
    }
    if (comp.size === best.size) {
      const compHas10 = [...comp].some((id) => nodeById.get(id)?.floor === MAX_FLOOR);
      const bestHas10 = [...best].some((id) => nodeById.get(id)?.floor === MAX_FLOOR);
      if (compHas10 && !bestHas10) best = comp;
    }
  }
  for (const id of [...nodeById.keys()]) {
    if (!best.has(id)) nodeById.delete(id);
  }
  const filtered = edges.filter(
    (e) => nodeById.has(e.fromId) && nodeById.has(e.toId),
  );
  edges.length = 0;
  edges.push(...filtered);
  for (const n of nodeById.values()) {
    n.neighborIds = n.neighborIds.filter((nid) => nodeById.has(nid));
  }
}

function neighborsHigherFloor(n: RunMapNode, nodeById: Map<string, RunMapNode>): RunMapNode[] {
  return n.neighborIds
    .map((id) => nodeById.get(id))
    .filter((x): x is RunMapNode => !!x && x.floor === n.floor + 1);
}

function violatesMerchantRestEdge(a: MapRoomLocation, b: MapRoomLocation): boolean {
  const bad =
    (a === 'merchant' && b === 'rest') ||
    (a === 'rest' && b === 'merchant');
  return bad;
}

function validateLocations(nodeById: Map<string, RunMapNode>): boolean {
  for (const n of nodeById.values()) {
    if (n.floor === 9 && n.location === 'rest') return false;
    for (const nid of n.neighborIds) {
      const o = nodeById.get(nid);
      if (!o) continue;
      if (violatesMerchantRestEdge(n.location, o.location)) return false;
    }
    const up = neighborsHigherFloor(n, nodeById);
    if (up.length >= 2) {
      const types = up.map((u) => u.location);
      // Fixed floors can force the same type on all children (e.g. floor 10 = rest).
      if (new Set(types).size <= 1) {
        // all same — ok
      } else if (new Set(types).size !== types.length) {
        return false;
      }
    }
  }
  return true;
}

function assignLocations(nodeById: Map<string, RunMapNode>): void {
  for (const n of nodeById.values()) {
    if (n.floor === 1) n.location = 'monster';
    else if (n.floor === 4) n.location = 'treasure';
    else if (n.floor === MAX_FLOOR) n.location = 'rest';
    else n.location = 'monster';
  }

  const assignable = [...nodeById.values()].filter(
    (n) => n.floor !== 1 && n.floor !== 4 && n.floor !== MAX_FLOOR,
  );
  shuffleInPlace(assignable);

  const maxTriesPerNode = 80;
  for (const n of assignable) {
    let ok = false;
    for (let t = 0; t < maxTriesPerNode; t++) {
      let loc = pickWeightedLocation();
      if (n.floor === 9 && loc === 'rest') loc = 'monster';
      n.location = loc;
      if (validateLocations(nodeById)) {
        ok = true;
        break;
      }
    }
    if (!ok) {
      n.location = 'monster';
    }
  }

  if (!validateLocations(nodeById)) {
    for (const n of assignable) {
      n.location = 'monster';
    }
  }
}

function attachBoss(nodeById: Map<string, RunMapNode>, edges: RunMapEdge[]): string {
  const bossId = 'boss';
  const floor10 = [...nodeById.values()].filter((n) => n.floor === MAX_FLOOR);
  const avgCol =
    floor10.length > 0
      ? floor10.reduce((s, n) => s + n.col, 0) / floor10.length
      : 3;
  const { layoutX, layoutY } = layoutFor(MAX_FLOOR, Math.round(avgCol));
  const bossNode: RunMapNode = {
    id: bossId,
    floor: BOSS_FLOOR,
    col: Math.round(avgCol),
    location: 'boss',
    neighborIds: [],
    layoutX,
    layoutY: Math.min(98, layoutY + 10),
  };
  nodeById.set(bossId, bossNode);

  for (const n of floor10) {
    addUndirectedEdge(edges, nodeById, n.id, bossId);
  }

  return bossId;
}

function pickFloor1Starts(): number[] {
  const cols = columnsForFloor(1);
  const starts: number[] = [];
  for (let w = 0; w < NUM_PATH_WAVES; w++) {
    if (w === 0) {
      starts.push(cols[Math.floor(Math.random() * cols.length)]);
    } else if (w === 1) {
      const others = cols.filter((c) => c !== starts[0]);
      starts.push(others[Math.floor(Math.random() * others.length)] ?? starts[0]);
    } else {
      starts.push(cols[Math.floor(Math.random() * cols.length)]);
    }
  }
  return starts;
}

export function generateRunMap(): RunGeneratedMap {
  for (let attempt = 0; attempt < 80; attempt++) {
    const nodeById = buildTemplateNodes();
    const edges: RunMapEdge[] = [];
    const starts = pickFloor1Starts();
    for (const s of starts) {
      growPathWave(nodeById, edges, s);
    }
    pruneOrphans(nodeById, edges);
    keepLargestFloor1TouchingComponent(nodeById, edges);
    pruneOrphans(nodeById, edges);

    const floor10Count = [...nodeById.values()].filter((n) => n.floor === MAX_FLOOR).length;
    if (floor10Count === 0) continue;

    assignLocations(nodeById);

    const bossPick =
      BOSS_DEFINITION_POOL[Math.floor(Math.random() * BOSS_DEFINITION_POOL.length)];
    const bossNodeId = attachBoss(nodeById, edges);

    const nodes = [...nodeById.values()];
    return {
      nodes,
      edges: [...edges],
      bossNodeId,
      bossDefinitionId: bossPick,
      bossFloor: BOSS_FLOOR,
    };
  }

  const nodeById = buildTemplateNodes();
  const edges: RunMapEdge[] = [];
  const cols = columnsForFloor(1);
  const c0 = cols[0];
  const c1 = cols[Math.min(1, cols.length - 1)];
  for (let f = 1; f < MAX_FLOOR; f++) {
    tryAddPathEdge(edges, nodeById, nodeId(f, c0), nodeId(f + 1, c0));
  }
  pruneOrphans(nodeById, edges);
  keepLargestFloor1TouchingComponent(nodeById, edges);
  pruneOrphans(nodeById, edges);
  assignLocations(nodeById);
  const bossPick = BOSS_DEFINITION_POOL[0];
  const bossNodeId = attachBoss(nodeById, edges);
  return {
    nodes: [...nodeById.values()],
    edges: [...edges],
    bossNodeId,
    bossDefinitionId: bossPick,
    bossFloor: BOSS_FLOOR,
  };
}
