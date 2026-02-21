import { Card, CharacterClass } from '@/app/types/game';

// === NORMAL REWARD CARDS ===
// These are stronger versions or upgrades of base cards, available after floor 1

export const NORMAL_REWARD_CARDS: Card[] = [
  // Warrior upgrades
  {
    id: 'sword_slash_strong_1',
    name: 'Corte de Espada Forte',
    cost: 1,
    type: 'attack',
    damage: 12,
    range: 1,
    description: 'Causa 12 de dano. Alcance: 1',
  },
  {
    id: 'riposte_1',
    name: 'Contra-Ataque',
    cost: 2,
    type: 'attack',
    damage: 10,
    range: 1,
    description: 'Causa 10 de dano. Alcance: 1',
  },
  {
    id: 'shield_block_1',
    name: 'Bloqueio de Escudo',
    cost: 1,
    type: 'skill',
    block: 8,
    description: 'Ganha 8 de bloqueio.',
  },
  {
    id: 'shield_block_2',
    name: 'Bloqueio de Escudo',
    cost: 1,
    type: 'skill',
    block: 8,
    description: 'Ganha 8 de bloqueio.',
  },
  {
    id: 'dash_2',
    name: 'Correr',
    cost: 1,
    type: 'movement',
    movement: 3,
    description: 'Mova até 3 espaços.',
  },
  {
    id: 'dash_3',
    name: 'Correr Rápido',
    cost: 1,
    type: 'movement',
    movement: 4,
    description: 'Mova até 4 espaços.',
  },
  // Archer upgrades
  {
    id: 'arrow_shot_1',
    name: 'Tiro de Flecha',
    cost: 1,
    type: 'attack',
    damage: 10,
    range: 2,
    description: 'Causa 10 de dano. Alcance: 2',
  },
  {
    id: 'arrow_shot_2',
    name: 'Tiro de Flecha',
    cost: 1,
    type: 'attack',
    damage: 10,
    range: 2,
    description: 'Causa 10 de dano. Alcance: 2',
  },
  {
    id: 'piercing_shot_1',
    name: 'Tiro Penetrante',
    cost: 2,
    type: 'attack',
    damage: 15,
    range: 3,
    description: 'Causa 15 de dano. Alcance: 3',
  },
  {
    id: 'evasion_1',
    name: 'Evasão',
    cost: 1,
    type: 'skill',
    block: 6,
    description: 'Ganha 6 de bloqueio.',
  },
  {
    id: 'evasion_2',
    name: 'Evasão',
    cost: 1,
    type: 'skill',
    block: 6,
    description: 'Ganha 6 de bloqueio.',
  },
  {
    id: 'sprint_1',
    name: 'Corrida Rápida',
    cost: 1,
    type: 'movement',
    movement: 5,
    description: 'Mova até 5 espaços.',
  },
  // Mage upgrades
  {
    id: 'fireball_1',
    name: 'Bola de Fogo',
    cost: 2,
    type: 'attack',
    damage: 12,
    range: 3,
    description: 'Causa 12 de dano. Alcance: 3',
  },
  {
    id: 'fireball_2',
    name: 'Bola de Fogo',
    cost: 2,
    type: 'attack',
    damage: 12,
    range: 3,
    description: 'Causa 12 de dano. Alcance: 3',
  },
  {
    id: 'frostbolt_1',
    name: 'Raio de Gelo',
    cost: 2,
    type: 'attack',
    damage: 10,
    range: 4,
    description: 'Causa 10 de dano. Alcance: 4',
  },
  {
    id: 'mana_shield_1',
    name: 'Escudo de Mana',
    cost: 1,
    type: 'skill',
    block: 7,
    description: 'Ganha 7 de bloqueio.',
  },
  {
    id: 'mana_shield_2',
    name: 'Escudo de Mana',
    cost: 1,
    type: 'skill',
    block: 7,
    description: 'Ganha 7 de bloqueio.',
  },
  {
    id: 'teleport_1',
    name: 'Teleporte',
    cost: 1,
    type: 'movement',
    movement: 6,
    description: 'Mova até 6 espaços.',
  },
];

// === RARE REWARD CARDS ===
// Powerful cards available after each floor

export const RARE_REWARD_CARDS: Card[] = [
  // Warrior rares
  {
    id: 'whirlwind_1',
    name: 'Ataque em Espiral',
    cost: 3,
    type: 'attack',
    damage: 20,
    range: 1,
    description: 'Causa 20 de dano. Alcance: 1',
  },
  {
    id: 'shield_mastery_1',
    name: 'Mestria com Escudo',
    cost: 1,
    type: 'skill',
    block: 12,
    description: 'Ganha 12 de bloqueio.',
  },
  {
    id: 'full_dash_1',
    name: 'Investida Total',
    cost: 1,
    type: 'movement',
    movement: 5,
    description: 'Mova até 5 espaços.',
  },
  // Archer rares
  {
    id: 'multi_shot_1',
    name: 'Tiro Múltiplo',
    cost: 2,
    type: 'attack',
    damage: 18,
    range: 3,
    description: 'Causa 18 de dano. Alcance: 3',
  },
  {
    id: 'eagle_eye_1',
    name: 'Visão da Águia',
    cost: 1,
    type: 'skill',
    block: 10,
    description: 'Ganha 10 de bloqueio.',
  },
  {
    id: 'swift_step_1',
    name: 'Sempre Ágil',
    cost: 1,
    type: 'movement',
    movement: 6,
    description: 'Mova até 6 espaços.',
  },
  // Mage rares
  {
    id: 'meteor_shower_1',
    name: 'Chuva de Meteoros',
    cost: 3,
    type: 'attack',
    damage: 25,
    range: 4,
    description: 'Causa 25 de dano. Alcance: 4',
  },
  {
    id: 'arcane_reflection_1',
    name: 'Refluxo Arcano',
    cost: 1,
    type: 'skill',
    block: 10,
    description: 'Ganha 10 de bloqueio.',
  },
  {
    id: 'arcane_jump_1',
    name: 'Salto Arcano',
    cost: 1,
    type: 'movement',
    movement: 7,
    description: 'Mova até 7 espaços.',
  },
  // Cross-class rare
  {
    id: 'power_surge_1',
    name: 'Surto de Energia',
    cost: 2,
    type: 'power',
    damage: 15,
    block: 8,
    description: 'Causa 15 de dano e ganha 8 de bloqueio.',
  },
];

export interface CardRewardPool {
  normal: Card[];
  rare: Card[];
}

// Get the reward pool for a character class
export function getRewardPool(characterClass: CharacterClass): CardRewardPool {
  return {
    normal: NORMAL_REWARD_CARDS,
    rare: RARE_REWARD_CARDS,
  };
}

// Pick two random reward cards (with probability weighting: 70% normal, 30% rare)
export function pickRewardCards(characterClass: CharacterClass): [Card, Card] {
  const pool = getRewardPool(characterClass);
  const allCards = [...pool.normal, ...pool.rare];

  // Create weighted selection: 70% normal, 30% rare
  const weights = allCards.map(card => 
    pool.normal.includes(card) ? 0.7 : 0.3
  );

  // Normalize weights
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map(w => w / totalWeight);

  // Pick first card
  const card1 = weightedRandomPick(allCards, normalizedWeights);
  
  // Remove card1 from options and pick second
  const remainingCards = allCards.filter(c => c.id !== card1.id);
  const remainingWeights = normalizedWeights.filter((_, i) => allCards[i].id !== card1.id);
  const remainingNormalized = remainingWeights.map(w => w / remainingWeights.reduce((a, b) => a + b, 0));
  const card2 = weightedRandomPick(remainingCards, remainingNormalized);

  return [card1, card2];
}

// Helper: weighted random selection
function weightedRandomPick<T>(items: T[], weights: number[]): T {
  const random = Math.random();
  let sum = 0;

  for (let i = 0; i < items.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return items[i];
    }
  }

  return items[items.length - 1];
}
