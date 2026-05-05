// Tipos base do jogo Dungeon Survival

// === CLASSES DE PERSONAGEM ===
export type CharacterClass = 'warrior' | 'archer' | 'mage';

// Tipos de habilidades inatas
export type InnateAbilityType =
  | 'roomHealing'     // Cura HP ao completar cada sala
  | 'bonusDraw'       // Compra cartas extras no início do turno
  | 'energyRegen'     // Ganha energia extra no primeiro turno de cada sala
  | 'turnStartEnergy'; // Ganha energia extra no início de cada turno (não limitado por maxEnergy)

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
  /** Initiative: array of die face counts (1+ dice), e.g. [4, 6, 8]. Defaults to [6, 6, 6]. */
  initiativeDice?: number[];
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
  energy?: number;    // Ganho de energia ao jogar (ex.: +2)
  exhaust?: boolean;  // Se true, a carta vai para a pilha de queimadas (não volta ao deck neste combate)
  loseHp?: number;    // Perde este tanto de HP ao jogar (ex.: 6)
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
  /** Initiative dice: array of face counts, e.g. [4, 6, 8] = d4 + d6 + d8 (3 dice) */
  initiativeDice: number[];
}

export interface Player {
  characterClass: CharacterClass;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
  position: HexPosition;
  gold: number;
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
  | 'selectingReward'  // Selecting reward card
  | 'selectingMerchant' // Merchant shop (priced offers)
  | 'selectingMapNode' // Pick next node on run map
  | 'selectingRunStartBonus' // One-time gold pick at run start (before first map choice)
  | 'restSite'         // Confirm rest (+HP, capped)
  | 'bossRoomIntro';   // Pre-boss modal before rolling initiative

export const MAX_FLOOR = 10;

/** Procedural run map; independent of hex combat for now. */
export type MapRoomLocation = 'monster' | 'treasure' | 'merchant' | 'rest' | 'boss';

export interface RunMapNode {
  id: string;
  /** Dungeon floor 1 = bottom … MAX_FLOOR; boss uses `bossFloor`. */
  floor: number;
  /** Column index in the irregular row template (0–6). */
  col: number;
  location: MapRoomLocation;
  /** Undirected adjacency (neighbor node ids). */
  neighborIds: string[];
  /** 0–100-ish layout hints for read-only viewer (row stagger / isometric feel). */
  layoutX: number;
  layoutY: number;
}

export interface RunMapEdge {
  fromId: string;
  toId: string;
}

export interface RunGeneratedMap {
  nodes: RunMapNode[];
  edges: RunMapEdge[];
  bossNodeId: string;
  /** Cosmetic boss pick for this run (matches `EnemyDefinition` ids where possible). */
  bossDefinitionId: string;
  /** Sentinel floor index used only for layout (above last floor). */
  bossFloor: number;
}

/** What kind of combat (if any) determines victory / floor-complete when enemies are cleared. */
export type RunCombatKind = 'none' | 'mapMonster' | 'boss';

/** Rooms to clear on the map before boss intro (not counting the boss fight). */
export const MAP_ROOMS_BEFORE_BOSS = 10;

export type RewardRarity = 'normal' | 'rare';

export interface MerchantOffer {
  card: Card;
  rarity: RewardRarity;
}

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
  floor: number;  // Current dungeon floor (1–MAX_FLOOR)
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

  /** Procedural map for the current run; regenerated when combat starts. */
  runMap: RunGeneratedMap | null;

  /** Map path: null = before first pick (only floor-1 choices). */
  mapCurrentNodeId: string | null;
  /** Rooms fully resolved this run (0 … MAP_ROOMS_BEFORE_BOSS). */
  mapRoomsCompleted: number;
  /** Monster combats finished; next monster room uses `createFloorEnemies(mapMonsterCombatsCompleted + 1)`. */
  mapMonsterCombatsCompleted: number;
  runCombatKind: RunCombatKind;

  /** Merchant node: up to 6 priced offers; entries removed when bought. */
  merchantOffers: MerchantOffer[];
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
