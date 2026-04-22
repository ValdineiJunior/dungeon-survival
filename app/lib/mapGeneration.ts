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

type Pt = { x: number; y: number };

function nodeCenter(n: RunMapNode): Pt {
  return { x: n.layoutX, y: n.layoutY };
}

function orientation(a: Pt, b: Pt, c: Pt): number {
  const v = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(v) < 1e-9) return 0;
  return v > 0 ? 1 : 2;
}

function onSegment(a: Pt, b: Pt, c: Pt): boolean {
  return (
    c.x <= Math.max(a.x, b.x) + 1e-9 &&
    c.x + 1e-9 >= Math.min(a.x, b.x) &&
    c.y <= Math.max(a.y, b.y) + 1e-9 &&
    c.y + 1e-9 >= Math.min(a.y, b.y)
  );
}

function segmentsIntersect(p1: Pt, q1: Pt, p2: Pt, q2: Pt): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) return true;

  if (o1 === 0 && onSegment(p1, q1, p2)) return true;
  if (o2 === 0 && onSegment(p1, q1, q2)) return true;
  if (o3 === 0 && onSegment(p2, q2, p1)) return true;
  if (o4 === 0 && onSegment(p2, q2, q1)) return true;

  return false;
}

function edgeCrossesAnySegment(
  p1: Pt,
  p2: Pt,
  existing: RunMapEdge[],
  nodeById: Map<string, RunMapNode>,
): boolean {
  for (const e of existing) {
    const na = nodeById.get(e.fromId);
    const nb = nodeById.get(e.toId);
    if (!na || !nb) continue;
    const c = nodeCenter(na);
    const d = nodeCenter(nb);
    if (segmentsIntersect(p1, p2, c, d)) return true;
  }
  return false;
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

  const pa = nodeCenter(na);
  const pb = nodeCenter(nb);
  if (edgeCrossesAnySegment(pa, pb, edges, nodeById)) return false;

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
