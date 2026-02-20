import { HexPosition, HexMap, HexTile, HEX_DIRECTIONS } from '@/app/types/game';

// === FUNÇÕES DE COORDENADAS ===

// Criar chave única para posição hex
export function hexKey(pos: HexPosition): string {
  return `${pos.q},${pos.r}`;
}

// Parse chave para posição
export function parseHexKey(key: string): HexPosition {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
}

// Comparar duas posições
export function hexEquals(a: HexPosition, b: HexPosition): boolean {
  return a.q === b.q && a.r === b.r;
}

// Somar duas posições
export function hexAdd(a: HexPosition, b: HexPosition): HexPosition {
  return { q: a.q + b.q, r: a.r + b.r };
}

// Subtrair posições
export function hexSubtract(a: HexPosition, b: HexPosition): HexPosition {
  return { q: a.q - b.q, r: a.r - b.r };
}

// === DISTÂNCIA ===

// Distância entre dois hexágonos (em número de hexes)
export function hexDistance(a: HexPosition, b: HexPosition): number {
  // Em coordenadas axiais, a distância usa a terceira coordenada implícita
  // s = -q - r (coordenada cúbica)
  const dq = Math.abs(a.q - b.q);
  const dr = Math.abs(a.r - b.r);
  const ds = Math.abs((-a.q - a.r) - (-b.q - b.r));
  return Math.max(dq, dr, ds);
}

// === VIZINHOS ===

// Obter todos os vizinhos de um hex
export function hexNeighbors(pos: HexPosition): HexPosition[] {
  return HEX_DIRECTIONS.map(dir => hexAdd(pos, dir));
}

// Obter vizinho em uma direção específica (0-5)
export function hexNeighbor(pos: HexPosition, direction: number): HexPosition {
  return hexAdd(pos, HEX_DIRECTIONS[direction]);
}

// === ALCANCE ===

// Obter todos os hexes dentro de um raio
export function hexesInRange(center: HexPosition, range: number): HexPosition[] {
  const results: HexPosition[] = [];
  
  for (let q = -range; q <= range; q++) {
    for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
      results.push({ q: center.q + q, r: center.r + r });
    }
  }
  
  return results;
}

// Obter hexes exatamente a uma distância específica (anel)
export function hexRing(center: HexPosition, radius: number): HexPosition[] {
  if (radius === 0) return [center];
  
  const results: HexPosition[] = [];
  let hex = hexAdd(center, { q: -radius, r: radius }); // Começa no sudoeste
  
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = hexNeighbor(hex, i);
    }
  }
  
  return results;
}

// === CRIAÇÃO DE MAPA ===

// Criar mapa hexagonal com raio específico
export function createHexMap(radius: number): HexMap {
  const tiles = new Map<string, HexTile>();
  
  // Gerar todos os hexes dentro do raio
  const allHexes = hexesInRange({ q: 0, r: 0 }, radius);
  
  for (const pos of allHexes) {
    tiles.set(hexKey(pos), {
      q: pos.q,
      r: pos.r,
      type: 'floor',
    });
  }
  
  return { radius, tiles };
}

// Verificar se posição está dentro do mapa
export function isValidHex(map: HexMap, pos: HexPosition): boolean {
  return map.tiles.has(hexKey(pos));
}

// Obter tile em uma posição
export function getTile(map: HexMap, pos: HexPosition): HexTile | undefined {
  return map.tiles.get(hexKey(pos));
}

// === CONVERSÃO PARA PIXELS (para renderização) ===

// Tamanho do hex (espaçamento entre hexágonos)
const HEX_SPACING_X = 35; // Espaçamento horizontal
const HEX_SPACING_Y = 30; // Espaçamento vertical

// Converter coordenadas axiais para pixels (pointy-top hexagons)
export function hexToPixel(pos: HexPosition): { x: number; y: number } {
  const x = HEX_SPACING_X * (Math.sqrt(3) * pos.q + Math.sqrt(3)/2 * pos.r);
  const y = HEX_SPACING_Y * (3/2 * pos.r);
  return { x, y };
}

// Obter o tamanho do hex para CSS
export function getHexSpacing(): { x: number; y: number } {
  return { x: HEX_SPACING_X, y: HEX_SPACING_Y };
}

// Calcular bounds do mapa para centralização
export function getMapBounds(map: HexMap): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  for (const key of map.tiles.keys()) {
    const pos = parseHexKey(key);
    const pixel = hexToPixel(pos);
    
    minX = Math.min(minX, pixel.x - HEX_SPACING_X);
    maxX = Math.max(maxX, pixel.x + HEX_SPACING_X);
    minY = Math.min(minY, pixel.y - HEX_SPACING_Y);
    maxY = Math.max(maxY, pixel.y + HEX_SPACING_Y);
  }
  
  return { minX, maxX, minY, maxY };
}

// === PATHFINDING SIMPLES ===

// Encontrar todos os hexes alcançáveis dentro de um número de movimentos
export function getReachableHexes(
  start: HexPosition,
  maxDistance: number,
  map: HexMap,
  blockedPositions: HexPosition[]
): HexPosition[] {
  const visited = new Set<string>();
  const results: HexPosition[] = [];
  const blocked = new Set(blockedPositions.map(hexKey));
  
  // BFS
  const queue: { pos: HexPosition; dist: number }[] = [{ pos: start, dist: 0 }];
  visited.add(hexKey(start));
  
  while (queue.length > 0) {
    const { pos, dist } = queue.shift()!;
    
    // Não incluir posição inicial nos resultados
    if (dist > 0) {
      results.push(pos);
    }
    
    // Se ainda pode mover mais
    if (dist < maxDistance) {
      for (const neighbor of hexNeighbors(pos)) {
        const key = hexKey(neighbor);
        
        // Verificar se é válido e não visitado
        if (
          !visited.has(key) &&
          isValidHex(map, neighbor) &&
          !blocked.has(key)
        ) {
          const tile = getTile(map, neighbor);
          if (tile && tile.type === 'floor') {
            visited.add(key);
            queue.push({ pos: neighbor, dist: dist + 1 });
          }
        }
      }
    }
  }
  
  return results;
}
