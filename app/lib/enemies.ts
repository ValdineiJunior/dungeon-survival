import { Enemy, EnemyActionCard, HexPosition } from '@/app/types/game';

// Definições de inimigos
export interface EnemyDefinition {
  id: string;
  name: string;
  emoji: string;
  minHp: number;
  maxHp: number;
  attackRange: number;
  actionCards: EnemyActionCard[];
}

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
  slime: {
    id: 'slime',
    name: 'Gosma',
    emoji: '🟢',
    minHp: 12,
    maxHp: 16,
    attackRange: 1,
    actionCards: [
      {
        id: 'slime_attack',
        name: 'Golpe Viscoso',
        actions: [{ type: 'attack', value: 5 }],
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
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    emoji: '👺',
    minHp: 20,
    maxHp: 26,
    attackRange: 1,
    actionCards: [
      {
        id: 'goblin_stab',
        name: 'Facada',
        actions: [{ type: 'attack', value: 8 }],
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
    actionCards: [
      {
        id: 'skeleton_arrow',
        name: 'Flecha Óssea',
        actions: [{ type: 'attack', value: 6 }],
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
        actions: [{ type: 'attack', value: 12 }],
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
};

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
    currentActionCard: firstCard,
    actionDrawPile: remainingDeck,
    actionDiscardPile: [],
    position,
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
