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

// Cria uma instância de inimigo
export function createEnemy(definitionId: string, instanceId: string, position: HexPosition): Enemy {
  const def = ENEMY_DEFINITIONS[definitionId];
  if (!def) throw new Error(`Enemy definition not found: ${definitionId}`);
  
  const hp = Math.floor(Math.random() * (def.maxHp - def.minHp + 1)) + def.minHp;
  const firstActionCard = def.actionCards[0];
  
  return {
    id: instanceId,
    name: def.name,
    emoji: def.emoji,
    hp,
    maxHp: hp,
    block: 0,
    currentActionCard: firstActionCard,
    position,
  };
}

// Determina a próxima carta de ação do inimigo baseado no turno
export function getEnemyActionCard(definitionId: string, turn: number): EnemyActionCard {
  const def = ENEMY_DEFINITIONS[definitionId];
  if (!def) throw new Error(`Enemy definition not found: ${definitionId}`);
  
  const patternIndex = turn % def.actionCards.length;
  return def.actionCards[patternIndex];
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
