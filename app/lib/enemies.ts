import { Enemy, EnemyActionCard, HexPosition } from '@/app/types/game';

// Definições de inimigos
export interface EnemyDefinition {
  id: string;
  name: string;
  emoji: string;
  minHp: number;
  maxHp: number;
  attackRange: number;
  /** Initiative: array of die face counts (1+ dice), e.g. [4, 6] or [4, 6, 8]. Defaults to [6, 6, 6]. */
  initiativeDice?: number[];
  actionCards: EnemyActionCard[];
}

/** Enemy display name -> image filename under /enemies/ (for cards and hex grid) */
export const ENEMY_IMAGE_FILES: Record<string, string> = {
  Gosma: 'slime.png',
  'Rato Gigante': 'rat.png',
  Goblin: 'goblin.png',
  Esqueleto: 'skeleton.png',
  Orc: 'orc.png',
  'Mago Negro': 'dark_Mage.png',
  Fantasma: 'ghost.png',
  'Dragão Ancião': 'dragon.png',
};

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const ENEMY_DEFINITIONS: Record<string, EnemyDefinition> = {
  // === FLOOR 1 ENEMIES ===
  slime: {
    id: 'slime',
    name: 'Gosma',
    emoji: '🟢',
    minHp: 12,
    maxHp: 16,
    attackRange: 1,
    initiativeDice: [4, 6],
    actionCards: [
      {
        id: 'slime_attack',
        name: 'Golpe Viscoso',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 5 },
        ],
      },
      {
        id: 'slime_move_attack',
        name: 'Avanço Pegajoso',
        actions: [
          { type: 'move', value: 2 },
          { type: 'attack', value: 3 },
        ],
      },
      {
        id: 'slime_defend',
        name: 'Endurecer',
        actions: [{ type: 'defend', value: 4 }],
      },
    ],
  },
  rat: {
    id: 'rat',
    name: 'Rato Gigante',
    emoji: '🐀',
    minHp: 8,
    maxHp: 12,
    attackRange: 1,
    initiativeDice: [4, 6, 6],
    actionCards: [
      {
        id: 'rat_bite',
        name: 'Mordida',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 4 },
        ],
      },
      {
        id: 'rat_scratch',
        name: 'Arranhão Rápido',
        actions: [
          { type: 'attack', value: 2 },
          { type: 'attack', value: 2 },
        ],
      },
      {
        id: 'rat_scurry',
        name: 'Correr',
        actions: [{ type: 'move', value: 3 }],
      },
    ],
  },

  // === FLOOR 2 ENEMIES ===
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    emoji: '👺',
    minHp: 20,
    maxHp: 26,
    attackRange: 1,
    initiativeDice: [6, 6, 6],
    actionCards: [
      {
        id: 'goblin_stab',
        name: 'Facada',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 8 },
        ],
      },
      {
        id: 'goblin_rush',
        name: 'Investida Covarde',
        actions: [
          { type: 'move', value: 3 },
          { type: 'attack', value: 4 },
        ],
      },
      {
        id: 'goblin_combo',
        name: 'Combo Traiçoeiro',
        actions: [
          { type: 'attack', value: 4 },
          { type: 'attack', value: 4 },
        ],
      },
      {
        id: 'goblin_defensive',
        name: 'Postura Defensiva',
        actions: [
          { type: 'defend', value: 5 },
          { type: 'attack', value: 3 },
        ],
      },
    ],
  },
  skeleton: {
    id: 'skeleton',
    name: 'Esqueleto',
    emoji: '💀',
    minHp: 25,
    maxHp: 32,
    attackRange: 2,
    initiativeDice: [4, 6, 8],
    actionCards: [
      {
        id: 'skeleton_arrow',
        name: 'Flecha Óssea',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 6 },
        ],
      },
      {
        id: 'skeleton_volley',
        name: 'Rajada de Flechas',
        actions: [
          { type: 'attack', value: 4 },
          { type: 'attack', value: 4 },
        ],
      },
      {
        id: 'skeleton_reposition',
        name: 'Reposicionar',
        actions: [
          { type: 'move', value: 2 },
          { type: 'defend', value: 3 },
        ],
      },
      {
        id: 'skeleton_power_shot',
        name: 'Tiro Poderoso',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 12 },
        ],
      },
      {
        id: 'skeleton_fortify',
        name: 'Fortificar',
        actions: [
          { type: 'defend', value: 6 },
          { type: 'defend', value: 4 },
        ],
      },
    ],
  },

  // === FLOOR 3 ENEMIES ===
  orc: {
    id: 'orc',
    name: 'Orc',
    emoji: '👹',
    minHp: 35,
    maxHp: 45,
    attackRange: 1,
    initiativeDice: [6, 6, 8],
    actionCards: [
      {
        id: 'orc_smash',
        name: 'Esmagamento',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 12 },
        ],
      },
      {
        id: 'orc_rage',
        name: 'Fúria',
        actions: [
          { type: 'move', value: 1 },
          { type: 'buff', value: 3 },
          { type: 'attack', value: 8 },
        ],
      },
      {
        id: 'orc_charge',
        name: 'Investida Brutal',
        actions: [
          { type: 'move', value: 2 },
          { type: 'attack', value: 10 },
        ],
      },
      {
        id: 'orc_brace',
        name: 'Posição de Combate',
        actions: [
          { type: 'defend', value: 8 },
          { type: 'attack', value: 6 },
        ],
      },
    ],
  },
  darkMage: {
    id: 'darkMage',
    name: 'Mago Negro',
    emoji: '🧙‍♂️',
    minHp: 28,
    maxHp: 35,
    attackRange: 3,
    initiativeDice: [6, 8, 8],
    actionCards: [
      {
        id: 'dark_bolt',
        name: 'Raio Sombrio',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 10 },
        ],
      },
      {
        id: 'dark_barrage',
        name: 'Barragem Arcana',
        actions: [
          { type: 'attack', value: 5 },
          { type: 'attack', value: 5 },
          { type: 'attack', value: 5 },
        ],
      },
      {
        id: 'dark_shield',
        name: 'Escudo Mágico',
        actions: [
          { type: 'defend', value: 12 },
        ],
      },
      {
        id: 'dark_teleport',
        name: 'Teleporte',
        actions: [
          { type: 'move', value: 4 },
          { type: 'defend', value: 5 },
        ],
      },
    ],
  },
  ghost: {
    id: 'ghost',
    name: 'Fantasma',
    emoji: '👻',
    minHp: 22,
    maxHp: 28,
    attackRange: 2,
    initiativeDice: [4, 6, 8],
    actionCards: [
      {
        id: 'ghost_drain',
        name: 'Dreno Vital',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 8 },
        ],
      },
      {
        id: 'ghost_haunt',
        name: 'Assombrar',
        actions: [
          { type: 'move', value: 3 },
          { type: 'attack', value: 6 },
        ],
      },
      {
        id: 'ghost_phase',
        name: 'Fase Etérea',
        actions: [
          { type: 'defend', value: 15 },
        ],
      },
    ],
  },

  // === FLOOR 4 BOSS ===
  dragon: {
    id: 'dragon',
    name: 'Dragão Ancião',
    emoji: '🐉',
    minHp: 120,
    maxHp: 150,
    attackRange: 3,
    initiativeDice: [8, 8, 12],
    actionCards: [
      {
        id: 'dragon_breath',
        name: 'Sopro de Fogo',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 15 },
          { type: 'attack', value: 10 },
        ],
      },
      {
        id: 'dragon_claw',
        name: 'Garras Devastadoras',
        actions: [
          { type: 'move', value: 1 },
          { type: 'attack', value: 20 },
        ],
      },
      {
        id: 'dragon_tail',
        name: 'Chicotada da Cauda',
        actions: [
          { type: 'attack', value: 8 },
          { type: 'attack', value: 8 },
          { type: 'attack', value: 8 },
        ],
      },
      {
        id: 'dragon_roar',
        name: 'Rugido Aterrorizante',
        actions: [
          { type: 'defend', value: 20 },
          { type: 'buff', value: 5 },
        ],
      },
      {
        id: 'dragon_dive',
        name: 'Mergulho Aéreo',
        actions: [
          { type: 'move', value: 3 },
          { type: 'attack', value: 18 },
        ],
      },
      {
        id: 'dragon_inferno',
        name: 'Inferno Dracônico',
        actions: [
          { type: 'attack', value: 12 },
          { type: 'attack', value: 12 },
          { type: 'attack', value: 12 },
        ],
      },
    ],
  },
};

// Floor configurations - which enemies spawn on each floor
export interface FloorConfig {
  floor: number;
  name: string;
  description: string;
  enemies: { definitionId: string; position: HexPosition }[];
}

export const FLOOR_CONFIGS: FloorConfig[] = [
  {
    floor: 1,
    name: 'Entrada da Masmorra',
    description: 'Os primeiros habitantes da masmorra te aguardam...',
    enemies: [
      { definitionId: 'slime', position: { q: 2, r: 0 } },
      { definitionId: 'rat', position: { q: 1, r: 2 } },
      { definitionId: 'slime', position: { q: -1, r: 2 } },
    ],
  },
  {
    floor: 2,
    name: 'Salão dos Ossos',
    description: 'Criaturas mais perigosas espreitam nas sombras...',
    enemies: [
      { definitionId: 'goblin', position: { q: 2, r: -1 } },
      { definitionId: 'skeleton', position: { q: -2, r: 2 } },
      { definitionId: 'goblin', position: { q: 0, r: 2 } },
    ],
  },
  {
    floor: 3,
    name: 'Câmara Sombria',
    description: 'O ar está pesado com magia negra...',
    enemies: [
      { definitionId: 'orc', position: { q: 2, r: 0 } },
      { definitionId: 'darkMage', position: { q: -2, r: 1 } },
      { definitionId: 'ghost', position: { q: 0, r: -2 } },
    ],
  },
  {
    floor: 4,
    name: 'Câmara Profunda',
    description: 'Criaturas endurecidas patrulham os corredores estreitos.',
    enemies: [
      { definitionId: 'orc', position: { q: 2, r: 0 } },
      { definitionId: 'darkMage', position: { q: -2, r: 1 } },
      { definitionId: 'ghost', position: { q: 0, r: -2 } },
    ],
  },
  {
    floor: 5,
    name: 'Salão Quebrado',
    description: 'Ecos de batalhas antigas ainda ressoam nas paredes.',
    enemies: [
      { definitionId: 'goblin', position: { q: 2, r: -1 } },
      { definitionId: 'skeleton', position: { q: -2, r: 2 } },
      { definitionId: 'orc', position: { q: 0, r: 2 } },
    ],
  },
  {
    floor: 6,
    name: 'Poço Sombrio',
    description: 'A umidade e o fedor de carne podre pairam no ar.',
    enemies: [
      { definitionId: 'skeleton', position: { q: 2, r: 0 } },
      { definitionId: 'ghost', position: { q: -2, r: 1 } },
      { definitionId: 'darkMage', position: { q: 0, r: -2 } },
    ],
  },
  {
    floor: 7,
    name: 'Antecâmara Maldita',
    description: 'Você sente que está sendo observado por todos os lados.',
    enemies: [
      { definitionId: 'orc', position: { q: 2, r: 0 } },
      { definitionId: 'ghost', position: { q: -2, r: 2 } },
      { definitionId: 'darkMage', position: { q: 0, r: 2 } },
    ],
  },
  {
    floor: 8,
    name: 'Descida ao Abismo',
    description: 'Cada passo ecoa como um aviso.',
    enemies: [
      { definitionId: 'darkMage', position: { q: 2, r: -1 } },
      { definitionId: 'orc', position: { q: -2, r: 2 } },
      { definitionId: 'ghost', position: { q: 0, r: 2 } },
    ],
  },
  {
    floor: 9,
    name: 'Última Trincheira',
    description: 'Os guardiões finais bloqueiam seu caminho.',
    enemies: [
      { definitionId: 'orc', position: { q: 2, r: 0 } },
      { definitionId: 'darkMage', position: { q: -2, r: 1 } },
      { definitionId: 'ghost', position: { q: 0, r: -2 } },
    ],
  },
  {
    floor: 10,
    name: 'Covil do Dragão',
    description: 'O Dragão Ancião protege o tesouro final!',
    enemies: [
      { definitionId: 'dragon', position: { q: 0, r: -2 } },
    ],
  },
];

export function getFloorConfig(floor: number): FloorConfig {
  return FLOOR_CONFIGS[floor - 1] || FLOOR_CONFIGS[0];
}

export function createFloorEnemies(floor: number): Enemy[] {
  const config = getFloorConfig(floor);
  return config.enemies.map((enemyConfig, index) => 
    createEnemy(enemyConfig.definitionId, `enemy_${floor}_${index}`, enemyConfig.position)
  );
}

// Cria uma instância de inimigo com deck embaralhado
export function createEnemy(definitionId: string, instanceId: string, position: HexPosition): Enemy {
  const def = ENEMY_DEFINITIONS[definitionId];
  if (!def) throw new Error(`Enemy definition not found: ${definitionId}`);
  
  const hp = Math.floor(Math.random() * (def.maxHp - def.minHp + 1)) + def.minHp;
  
  // Shuffle the action cards to create the draw pile
  const shuffledDeck = shuffleArray(def.actionCards);
  
  // Draw the first card
  const [firstCard, ...remainingDeck] = shuffledDeck;
  
  return {
    id: instanceId,
    name: def.name,
    emoji: def.emoji,
    hp,
    maxHp: hp,
    block: 0,
    attackRange: def.attackRange,
    currentActionCard: firstCard,
    actionDrawPile: remainingDeck,
    actionDiscardPile: [],
    position,
    initiativeDice: def.initiativeDice ?? [6, 6, 6],
  };
}

// Draw the next action card for an enemy
// Returns updated enemy with new current card, draw pile, and discard pile
export function drawNextActionCard(enemy: Enemy): {
  currentActionCard: EnemyActionCard;
  actionDrawPile: EnemyActionCard[];
  actionDiscardPile: EnemyActionCard[];
} {
  // Move current card to discard pile
  const newDiscardPile = enemy.currentActionCard 
    ? [...enemy.actionDiscardPile, enemy.currentActionCard]
    : [...enemy.actionDiscardPile];
  
  let newDrawPile = [...enemy.actionDrawPile];
  
  // If draw pile is empty, shuffle discard pile into draw pile
  if (newDrawPile.length === 0) {
    newDrawPile = shuffleArray(newDiscardPile);
    newDiscardPile.length = 0; // Clear discard pile
  }
  
  // Draw the next card
  const [nextCard, ...remainingDeck] = newDrawPile;
  
  return {
    currentActionCard: nextCard,
    actionDrawPile: remainingDeck,
    actionDiscardPile: newDiscardPile.length === 0 ? [] : newDiscardPile,
  };
}

// Obter definição de inimigo pelo nome
export function getEnemyDefinitionByName(name: string): EnemyDefinition | undefined {
  return Object.values(ENEMY_DEFINITIONS).find(def => def.name === name);
}

// Obter todas as cartas de ação de um inimigo pelo nome
export function getEnemyActionCards(name: string): EnemyActionCard[] {
  const def = getEnemyDefinitionByName(name);
  return def?.actionCards || [];
}
