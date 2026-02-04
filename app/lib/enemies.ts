import { Enemy, EnemyIntent, HexPosition } from '@/app/types/game';

// Definições de inimigos
export interface EnemyDefinition {
  id: string;
  name: string;
  emoji: string;
  minHp: number;
  maxHp: number;
  attackRange: number; // Alcance de ataque em hexes
  pattern: { intent: EnemyIntent; value: number }[];
}

export const ENEMY_DEFINITIONS: Record<string, EnemyDefinition> = {
  slime: {
    id: 'slime',
    name: 'Gosma',
    emoji: '🟢',
    minHp: 12,
    maxHp: 16,
    attackRange: 1,
    pattern: [
      { intent: 'attack', value: 5 },
      { intent: 'move', value: 2 },
      { intent: 'attack', value: 5 },
      { intent: 'defend', value: 3 },
    ],
  },
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    emoji: '👺',
    minHp: 20,
    maxHp: 26,
    attackRange: 1,
    pattern: [
      { intent: 'attack', value: 8 },
      { intent: 'move', value: 3 },
      { intent: 'attack', value: 6 },
      { intent: 'defend', value: 5 },
    ],
  },
  skeleton: {
    id: 'skeleton',
    name: 'Esqueleto',
    emoji: '💀',
    minHp: 25,
    maxHp: 32,
    attackRange: 2,
    pattern: [
      { intent: 'attack', value: 6 },
      { intent: 'attack', value: 6 },
      { intent: 'move', value: 2 },
      { intent: 'attack', value: 12 },
      { intent: 'defend', value: 8 },
    ],
  },
};

// Cria uma instância de inimigo
export function createEnemy(definitionId: string, instanceId: string, position: HexPosition): Enemy {
  const def = ENEMY_DEFINITIONS[definitionId];
  if (!def) throw new Error(`Enemy definition not found: ${definitionId}`);
  
  const hp = Math.floor(Math.random() * (def.maxHp - def.minHp + 1)) + def.minHp;
  const firstAction = def.pattern[0];
  
  return {
    id: instanceId,
    name: def.name,
    emoji: def.emoji,
    hp,
    maxHp: hp,
    block: 0,
    intent: firstAction.intent,
    intentValue: firstAction.value,
    position,
  };
}

// Determina a próxima ação do inimigo baseado no turno
export function getEnemyAction(definitionId: string, turn: number): { intent: EnemyIntent; value: number } {
  const def = ENEMY_DEFINITIONS[definitionId];
  if (!def) throw new Error(`Enemy definition not found: ${definitionId}`);
  
  const patternIndex = turn % def.pattern.length;
  return def.pattern[patternIndex];
}

// Obter definição de inimigo pelo nome
export function getEnemyDefinitionByName(name: string): EnemyDefinition | undefined {
  return Object.values(ENEMY_DEFINITIONS).find(def => def.name === name);
}
