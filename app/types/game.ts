// Tipos base do jogo Dungeon Survival

// === CLASSES DE PERSONAGEM ===
export type CharacterClass = 'warrior' | 'archer' | 'mage';

export interface CharacterClassDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  emoji: string;
  baseHp: number;
  baseEnergy: number;
}

// === POSIÇÃO HEXAGONAL (Coordenadas Axiais) ===
// Usamos sistema axial (q, r) que facilita cálculos
// q = coluna, r = linha (em offset)
export interface HexPosition {
  q: number; // coluna
  r: number; // linha
}

// Alias para compatibilidade
export type Position = HexPosition;

// === CARTAS ===
export type CardType = 'attack' | 'skill' | 'power' | 'movement';

export interface Card {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  damage?: number;
  block?: number;
  range?: number;      // Alcance máximo do ataque (em hexes)
  minRange?: number;   // Alcance mínimo do ataque (para ataques à distância)
  movement?: number;   // Quantidade de movimento (em hexes)
  description: string;
  effects?: CardEffect[];
}

export interface CardEffect {
  type: 'draw' | 'energy' | 'heal' | 'vulnerable' | 'weak';
  value: number;
}

// === ENTIDADES (Jogador e Inimigos) ===
export type EnemyIntent = 'attack' | 'defend' | 'buff' | 'debuff' | 'move';

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  intent: EnemyIntent;
  intentValue: number;
  position: HexPosition;
  emoji: string;
}

export interface Player {
  characterClass: CharacterClass;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
  position: HexPosition;
}

// === MAPA HEXAGONAL ===
export type HexTileType = 'floor' | 'wall' | 'obstacle' | 'pit';

export interface HexTile {
  q: number;
  r: number;
  type: HexTileType;
}

export interface HexMap {
  // Raio do mapa (quantidade de hexes do centro até a borda)
  radius: number;
  tiles: Map<string, HexTile>; // key = "q,r"
}

// === ESTADO DO JOGO ===
export type GamePhase = 
  | 'characterSelect'   // Selecting character class
  | 'playerTurn' 
  | 'enemyTurn' 
  | 'victory' 
  | 'defeat' 
  | 'selectingMovement'
  | 'selectingTarget';  // Selecting enemy to attack

export interface GameState {
  // Estado do jogador
  player: Player;
  
  // Cartas
  deck: Card[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  
  // Inimigos
  enemies: Enemy[];
  
  // Mapa
  hexMap: HexMap;
  
  // Fase do jogo
  phase: GamePhase;
  turn: number;
  
  // Estado de seleção
  selectedCard: Card | null;
  validMovePositions: HexPosition[];
  targetableEnemyIds: string[];  // NEW: IDs of enemies that can be targeted
}

// === UTILIDADES HEXAGONAIS ===
// Direções dos 6 vizinhos em coordenadas axiais
export const HEX_DIRECTIONS: HexPosition[] = [
  { q: 1, r: 0 },   // Leste
  { q: 1, r: -1 },  // Nordeste
  { q: 0, r: -1 },  // Noroeste
  { q: -1, r: 0 },  // Oeste
  { q: -1, r: 1 },  // Sudoeste
  { q: 0, r: 1 },   // Sudeste
];
