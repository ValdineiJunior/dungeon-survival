import { Card, CharacterClass } from '@/app/types/game';

// === REWARD CARDS PER CLASS ===

export interface CardRewardPool {
  normal: Card[];
  rare: Card[];
}

const CROSS_CLASS_RARES: Card[] = [
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

const WARRIOR_NORMAL_REWARDS: Card[] = [
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
];

const WARRIOR_RARE_REWARDS: Card[] = [
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
];

const ARCHER_NORMAL_REWARDS: Card[] = [
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
];

const ARCHER_RARE_REWARDS: Card[] = [
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
];

const MAGE_NORMAL_REWARDS: Card[] = [
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

const MAGE_RARE_REWARDS: Card[] = [
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
];

export const CLASS_REWARD_POOLS: Record<CharacterClass, CardRewardPool> = {
  warrior: {
    normal: WARRIOR_NORMAL_REWARDS,
    rare: [...WARRIOR_RARE_REWARDS, ...CROSS_CLASS_RARES],
  },
  archer: {
    normal: ARCHER_NORMAL_REWARDS,
    rare: [...ARCHER_RARE_REWARDS, ...CROSS_CLASS_RARES],
  },
  mage: {
    normal: MAGE_NORMAL_REWARDS,
    rare: [...MAGE_RARE_REWARDS, ...CROSS_CLASS_RARES],
  },
};

// Get the reward pool for a character class
export function getRewardPool(characterClass: CharacterClass): CardRewardPool {
  return CLASS_REWARD_POOLS[characterClass];
}

// Pick two random reward cards (with probability weighting: 70% normal, 30% rare)
export function pickRewardCards(characterClass: CharacterClass): [Card, Card] {
  const pool = getRewardPool(characterClass);
  
  // Create a combined list of cards with their types for weighting
  const weightedPool = [
    ...pool.normal.map(card => ({ card, type: 'normal' })),
    ...pool.rare.map(card => ({ card, type: 'rare' }))
  ];

  const pickCard = (excludedId: string | null = null): { card: Card, type: string } => {
    const availablePicks = excludedId 
      ? weightedPool.filter(item => item.card.id !== excludedId)
      : weightedPool;

    // Simple weighted random pick: 70% chance for normal, 30% for rare
    const isNormal = Math.random() < 0.7;
    let candidates = availablePicks.filter(item => item.type === (isNormal ? 'normal' : 'rare'));

    // If the chosen rarity has no candidates (e.g., all rares were picked), try the other.
    if (candidates.length === 0) {
      candidates = availablePicks.filter(item => item.type === (isNormal ? 'rare' : 'normal'));
    }
    
    // If there are still no candidates, something is wrong, but we'll fallback to any available card.
    if (candidates.length === 0) {
      if (availablePicks.length === 0) {
        // This should not happen if pools are populated. As a fallback, use a default card.
        // This part of the code needs a robust fallback, here we will throw an error.
        throw new Error("No available cards to pick for reward.");
      }
      candidates = availablePicks;
    }
    
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  const firstPick = pickCard();
  const secondPick = pickCard(firstPick.card.id);

  return [firstPick.card, secondPick.card];
}

// This helper is no longer needed with the simplified weighted pick logic.
// function weightedRandomPick<T>(items: T[], weights: number[]): T { ... }
