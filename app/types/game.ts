// Tipos base do jogo Dungeon Survival

// === CLASSES DE PERSONAGEM ===
export type CharacterClass = 'warrior' | 'archer' | 'mage';

// Tipos de habilidades inatas
export type InnateAbilityType =
  | 'passiveBlock'    // Ganha bloqueio no início de cada turno
  | 'roomHealing'     // Cura HP ao completar cada sala
  | 'bonusDraw'       // Compra cartas extras no início do turno
  | 'energyRegen';    // Ganha energia extra

export interface InnateAbility {
  type: InnateAbilityType;
  value: number;
  name: string;
  description: string;
  emoji: string;
}

export interface CharacterClassDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  emoji: string;
  imageUrl: string;
  baseHp: number;
  baseEnergy: number;
  innateAbilities: InnateAbility[];
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
  range?: number;      // Alcance máximo (1 a range). Ataque à distância (range > 1) vs adjacente: 1d6, 1-2 erra.
  movement?: number;   // Quantidade de movimento (em hexes)
  burnsCards?: number; // Quantidade de cartas para descartar definitivamente
  drawCards?: number;  // Quantidade de cartas para comprar
  description: string;
  effects?: CardEffect[];
}

export interface CardEffect {
  type: 'draw' | 'energy' | 'heal' | 'vulnerable' | 'weak';
  value: number;
}

// === ENTIDADES (Jogador e Inimigos) ===
export type EnemyIntent = 'attack' | 'defend' | 'buff' | 'debuff' | 'move';

// Ação individual de um inimigo
export interface EnemyAction {
  type: EnemyIntent;
  value: number;
}

// Carta de ação do inimigo (pode conter múltiplas ações)
export interface EnemyActionCard {
  id: string;
  name: string;
  actions: EnemyAction[];
  description?: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  attackRange: number;  // Alcance de ataque em hexes
  currentActionCard: EnemyActionCard | null;
  actionDrawPile: EnemyActionCard[];    // Cards to draw from
  actionDiscardPile: EnemyActionCard[]; // Used cards
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

// === LOG DE AÇÕES ===
export type LogEntryType =
  | 'playerAttack'
  | 'playerBlock'
  | 'playerMove'
  | 'playerDraw'
  | 'enemyAttack'
  | 'enemyBlock'
  | 'enemyMove'
  | 'enemyDefeated'
  | 'turnStart'
  | 'turnEnd'
  | 'floorStart'
  | 'innateAbility'
  | 'rewardStart'
  | 'cardReward';

export interface GameLogEntry {
  id: string;
  turn: number;
  floor: number;
  type: LogEntryType;
  message: string;
  details?: {
    attacker?: string;
    target?: string;
    damage?: number;
    blocked?: number;
    finalDamage?: number;
    healing?: number;
    block?: number;
    cards?: number;
    position?: HexPosition;
  };
  timestamp: number;
}

// === ESTADO DO JOGO ===
export type GamePhase =
  | 'characterSelect'   // Selecting character class
  | 'rollingInitiative' // Rolling initiative dice
  | 'viewingInitiative' // Viewing turn order
  | 'playerTurn'
  | 'enemyTurn' // Note: This will likely be deprecated with interleaved turns
  | 'victory'
  | 'defeat'
  | 'selectingMovement'
  | 'selectingTarget'   // Selecting enemy to attack
  | 'confirmingSkill'   // Confirming skill card use
  | 'selectingBurn'     // Selecting a card to burn from hand
  | 'floorComplete'     // Floor cleared, ready for next floor
  | 'selectingReward';  // Selecting reward card

export const MAX_FLOOR = 4;

export interface InitiativeResult {
  id: string; // Enemy ID or 'player'
  entityType: 'player' | 'enemy';
  name: string;
  total: number;
  dice: number[];
  /** Face count per die (e.g. [4, 6] for d4+d6) for displaying the correct dice icon */
  diceFaces?: number[];
  highestDie: number;
  hp: number;
  emoji: string;
}

export interface GameState {
  // Estado do jogador
  player: Player;

  // Cartas
  deck: Card[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  burnedPile: Card[];

  // Inimigos
  enemies: Enemy[];

  // Log de ações
  gameLog: GameLogEntry[];

  // Mapa
  hexMap: HexMap;

  // Fase do jogo
  phase: GamePhase;
  turn: number;
  floor: number;  // Current dungeon floor (1-4)
  turnOrder: InitiativeResult[];
  activeTurnIndex: number;

  // Estado de seleção
  selectedCard: Card | null;
  // Whether the currently selected card (selectedCard) is from the default hand
  selectedCardIsDefault?: boolean;
  cardsToBurn: number;
  validMovePositions: HexPosition[];
  targetableEnemyIds: string[];  // NEW: IDs of enemies that can be targeted

  // Estado de movimento passo a passo
  movementPath: HexPosition[];  // Path of hexes selected for current movement
  remainingMovement: number;    // Remaining movement points for current card

  // Recompensa de cartas após andar
  rewardCards: Card[];  // Two cards to choose from after floor completion
  // Secondary persistent default hand (3 simple cards, usable once per round)
  defaultHand: DefaultHandCard[];
}

export interface DefaultHandCard {
  id: string; // unique id for instance in the default hand
  card: Card; // the card data
  usedThisTurn: boolean; // whether it was used this turn (resets each turn)
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
