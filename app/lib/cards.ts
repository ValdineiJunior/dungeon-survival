import { Card, CharacterClass, CharacterClassDefinition } from '@/app/types/game';

// === CHARACTER CLASS DEFINITIONS ===
export const CHARACTER_CLASSES: Record<CharacterClass, CharacterClassDefinition> = {
  warrior: {
    id: 'warrior',
    name: 'Guerreiro',
    description: 'Especialista em combate corpo a corpo. Usa espadas e escudos para atacar inimigos adjacentes.',
    emoji: '⚔️',
    baseHp: 90,
    baseEnergy: 3,
    innateAbilities: [
      {
        type: 'passiveBlock',
        value: 1,
        name: 'Postura Defensiva',
        description: 'Ganha 1 de bloqueio no início de cada turno',
        emoji: '🛡️',
      },
    ],
  },
  archer: {
    id: 'archer',
    name: 'Arqueiro',
    description: 'Atacante à distância. Usa arco e flechas para atingir inimigos de longe.',
    emoji: '🏹',
    baseHp: 70,
    baseEnergy: 3,
    innateAbilities: [
      {
        type: 'bonusDraw',
        value: 1,
        name: 'Agilidade',
        description: 'Compra 1 carta extra no início de cada turno',
        emoji: '🃏',
      },
    ],
  },
  mage: {
    id: 'mage',
    name: 'Mago',
    description: 'Conjurador de magias. Lança feitiços poderosos à distância.',
    emoji: '🔮',
    baseHp: 60,
    baseEnergy: 4,
    innateAbilities: [
      {
        type: 'energyRegen',
        value: 1,
        name: 'Canalização Arcana',
        description: 'Ganha 1 energia extra no primeiro turno de cada sala',
        emoji: '✨',
      },
    ],
  },
};

// === WARRIOR CARDS (Range 1 - Melee) ===
export const WARRIOR_CARDS: Card[] = [
  {
    id: 'sword_slash_1',
    name: 'Corte de Espada',
    cost: 1,
    type: 'attack',
    damage: 8,
    range: 1,
    description: 'Causa 8 de dano. Alcance: 1',
  },
  {
    id: 'sword_slash_2',
    name: 'Corte de Espada',
    cost: 1,
    type: 'attack',
    damage: 8,
    range: 1,
    description: 'Causa 8 de dano. Alcance: 1',
  },
  {
    id: 'sword_slash_3',
    name: 'Corte de Espada',
    cost: 1,
    type: 'attack',
    damage: 8,
    range: 1,
    description: 'Causa 8 de dano. Alcance: 1',
  },
    {
    id: 'sword_slash_4',
    name: 'Corte de Espada',
    cost: 1,
    type: 'attack',
    damage: 8,
    range: 1,
    description: 'Causa 8 de dano. Alcance: 1',
  },
  {
    id: 'heavy_strike_1',
    name: 'Golpe Pesado',
    cost: 2,
    type: 'attack',
    damage: 14,
    range: 1,
    description: 'Causa 14 de dano. Alcance: 1',
  },
  {
    id: 'warrior_defend_1',
    name: 'Defesa Firme',
    cost: 1,
    type: 'skill',
    block: 7,
    description: 'Ganha 7 de bloqueio.',
  },
  {
    id: 'warrior_defend_2',
    name: 'Defesa Firme',
    cost: 1,
    type: 'skill',
    block: 7,
    description: 'Ganha 7 de bloqueio.',
  },
  {
    id: 'warrior_defend_3',
    name: 'Defesa Firme',
    cost: 1,
    type: 'skill',
    block: 7,
    description: 'Ganha 7 de bloqueio.',
  },
  {
    id: 'warrior_charge_1',
    name: 'Investida',
    cost: 1,
    type: 'movement',
    movement: 3,
    description: 'Mova até 3 espaços.',
  },
  {
    id: 'warrior_charge_2',
    name: 'Investida',
    cost: 1,
    type: 'movement',
    movement: 3,
    description: 'Mova até 3 espaços.',
  },
];

// === ARCHER CARDS (Range 2+ - Ranged) ===
export const ARCHER_CARDS: Card[] = [
  {
    id: 'arrow_shot_1',
    name: 'Tiro de Flecha',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 3,
    minRange: 2,
    description: 'Causa 6 de dano. Alcance: 2-3',
  },
  {
    id: 'arrow_shot_2',
    name: 'Tiro de Flecha',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 3,
    minRange: 2,
    description: 'Causa 6 de dano. Alcance: 2-3',
  },
  {
    id: 'arrow_shot_3',
    name: 'Tiro de Flecha',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 3,
    minRange: 2,
    description: 'Causa 6 de dano. Alcance: 2-3',
  },
    {
    id: 'arrow_shot_4',
    name: 'Tiro de Flecha',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 3,
    minRange: 2,
    description: 'Causa 6 de dano. Alcance: 2-3',
  },
  {
    id: 'piercing_arrow_1',
    name: 'Flecha Perfurante',
    cost: 2,
    type: 'attack',
    damage: 10,
    range: 4,
    minRange: 2,
    description: 'Causa 10 de dano. Alcance: 2-4',
  },
  {
    id: 'archer_dodge_1',
    name: 'Esquiva',
    cost: 1,
    type: 'skill',
    block: 5,
    description: 'Ganha 5 de bloqueio.',
  },
  {
    id: 'archer_dodge_2',
    name: 'Esquiva',
    cost: 1,
    type: 'skill',
    block: 5,
    description: 'Ganha 5 de bloqueio.',
  },
  {
    id: 'archer_dodge_3',
    name: 'Esquiva',
    cost: 1,
    type: 'skill',
    block: 5,
    description: 'Ganha 5 de bloqueio.',
  },
  {
    id: 'archer_sprint_1',
    name: 'Correr',
    cost: 1,
    type: 'movement',
    movement: 4,
    description: 'Mova até 4 espaços.',
  },
  {
    id: 'archer_sprint_2',
    name: 'Correr',
    cost: 1,
    type: 'movement',
    movement: 4,
    description: 'Mova até 4 espaços.',
  },
];

// === MAGE CARDS (Range 2+ - Ranged, same as archer for now) ===
export const MAGE_CARDS: Card[] = [
  {
    id: 'fireball_1',
    name: 'Bola de Fogo',
    cost: 1,
    type: 'attack',
    damage: 7,
    range: 3,
    minRange: 2,
    description: 'Causa 7 de dano. Alcance: 2-3',
  },
  {
    id: 'fireball_2',
    name: 'Bola de Fogo',
    cost: 1,
    type: 'attack',
    damage: 7,
    range: 3,
    minRange: 2,
    description: 'Causa 7 de dano. Alcance: 2-3',
  },
  {
    id: 'fireball_3',
    name: 'Bola de Fogo',
    cost: 1,
    type: 'attack',
    damage: 7,
    range: 3,
    minRange: 2,
    description: 'Causa 7 de dano. Alcance: 2-3',
  },
    {
    id: 'fireball_4',
    name: 'Bola de Fogo',
    cost: 1,
    type: 'attack',
    damage: 7,
    range: 3,
    minRange: 2,
    description: 'Causa 7 de dano. Alcance: 2-3',
  },
  {
    id: 'lightning_bolt_1',
    name: 'Relâmpago',
    cost: 2,
    type: 'attack',
    damage: 12,
    range: 4,
    minRange: 2,
    description: 'Causa 12 de dano. Alcance: 2-4',
  },
  {
    id: 'mage_barrier_1',
    name: 'Barreira Mágica',
    cost: 1,
    type: 'skill',
    block: 6,
    description: 'Ganha 6 de bloqueio.',
  },
  {
    id: 'mage_barrier_2',
    name: 'Barreira Mágica',
    cost: 1,
    type: 'skill',
    block: 6,
    description: 'Ganha 6 de bloqueio.',
  },
  {
    id: 'mage_barrier_3',
    name: 'Barreira Mágica',
    cost: 1,
    type: 'skill',
    block: 6,
    description: 'Ganha 6 de bloqueio.',
  },
  {
    id: 'mage_blink_1',
    name: 'Piscar',
    cost: 1,
    type: 'movement',
    movement: 4,
    description: 'Move até 4 espaços.',
  },
  {
    id: 'mage_blink_2',
    name: 'Piscar',
    cost: 1,
    type: 'movement',
    movement: 4,
    description: 'Move até 4 espaços.',
  },
];

// === DEFAULT (Starter) CARDS (one set of 3 cards per class) ===
// These are simple default cards: Attack, Defense, Move - all cost 1
export const WARRIOR_DEFAULT_CARDS: Card[] = [
  {
    id: 'warrior_default_attack',
    name: 'Punhal Arremessado',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 2,
    description: '[Carta Padrão] Causa 6 de dano. Alcance: 2',
  },
  {
    id: 'warrior_default_defend',
    name: 'Traje de Couro',
    cost: 1,
    type: 'skill',
    block: 5,
    description: '[Carta Padrão] Ganha 5 de bloqueio.',
  },
  {
    id: 'warrior_default_move',
    name: 'Passo Lento',
    cost: 1,
    type: 'movement',
    movement: 1,
    description: '[Carta Padrão] Mova até 1 espaço.',
  },
];

export const ARCHER_DEFAULT_CARDS: Card[] = [
  {
    id: 'archer_default_attack',
    name: 'Risco da adaga',
    cost: 1,
    type: 'attack',
    damage: 5,
    range: 1,
    description: '[Carta Padrão] Causa 5 de dano. Alcance: 1',
  },
  {
    id: 'archer_default_defend',
    name: 'Traje de Couro',
    cost: 1,
    type: 'skill',
    block: 3,
    description: '[Carta Padrão] Ganha 3 de bloqueio.',
  },
  {
    id: 'archer_default_move',
    name: 'Passo Silencioso',
    cost: 1,
    type: 'movement',
    movement: 2,
    description: '[Carta Padrão] Mova até 2 espaços.',
  },
];

export const MAGE_DEFAULT_CARDS: Card[] = [
  {
    id: 'mage_default_attack',
    name: 'Toque Arcano',
    cost: 1,
    type: 'attack',
    damage: 5,
    range: 1,
    description: '[Carta Padrão] Causa 5 de dano. Alcance: 1',
  },
  {
    id: 'mage_default_defend',
    name: 'Escudo Arcano',
    cost: 1,
    type: 'skill',
    block: 4,
    description: '[Carta Padrão] Ganha 4 de bloqueio.',
  },
  {
    id: 'mage_default_move',
    name: 'Deslocamento Arcano',
    cost: 1,
    type: 'movement',
    movement: 2,
    description: '[Carta Padrão] Mova até 2 espaços.',
  },
];

// Get cards for a specific class
export function getClassCards(characterClass: CharacterClass): Card[] {
  switch (characterClass) {
    case 'warrior':
      return WARRIOR_CARDS;
    case 'archer':
      return ARCHER_CARDS;
    case 'mage':
      return MAGE_CARDS;
    default:
      return WARRIOR_CARDS;
  }
}

// Create a deck for a specific class
export function createClassDeck(characterClass: CharacterClass): Card[] {
  const cards = getClassCards(characterClass);
  return cards.map(card => ({ ...card }));
}

// Legacy starter cards (kept for compatibility)
export const STARTER_CARDS: Card[] = [
  // 4 ataques básicos (com alcance)
  {
    id: 'strike_1',
    name: 'Golpe',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 1, // Apenas adjacente
    description: 'Causa 6 de dano. Alcance: 1',
  },
  {
    id: 'strike_2',
    name: 'Golpe',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 1,
    description: 'Causa 6 de dano. Alcance: 1',
  },
  {
    id: 'strike_3',
    name: 'Golpe',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 1,
    description: 'Causa 6 de dano. Alcance: 1',
  },
  {
    id: 'strike_4',
    name: 'Golpe',
    cost: 1,
    type: 'attack',
    damage: 6,
    range: 1,
    description: 'Causa 6 de dano. Alcance: 1',
  },
  // 3 defesas básicas
  {
    id: 'defend_1',
    name: 'Defender',
    cost: 1,
    type: 'skill',
    block: 5,
    description: 'Ganha 5 de bloqueio.',
  },
  {
    id: 'defend_2',
    name: 'Defender',
    cost: 1,
    type: 'skill',
    block: 5,
    description: 'Ganha 5 de bloqueio.',
  },
  {
    id: 'defend_3',
    name: 'Defender',
    cost: 1,
    type: 'skill',
    block: 5,
    description: 'Ganha 5 de bloqueio.',
  },
  // 3 cartas de movimento
  {
    id: 'move_1',
    name: 'Andar',
    cost: 1,
    type: 'movement',
    movement: 2,
    description: 'Mova até 2 espaços.',
  },
  {
    id: 'move_2',
    name: 'Andar',
    cost: 1,
    type: 'movement',
    movement: 2,
    description: 'Mova até 2 espaços.',
  },
  {
    id: 'move_3',
    name: 'Andar',
    cost: 1,
    type: 'movement',
    movement: 2,
    description: 'Mova até 2 espaços.',
  },
  // 1 carta de movimento rápido
  {
    id: 'dash_1',
    name: 'Correr',
    cost: 1,
    type: 'movement',
    movement: 4,
    description: 'Mova até 4 espaços.',
  },
  // 1 ataque à distância
  {
    id: 'throw_1',
    name: 'Arremesso',
    cost: 2,
    type: 'attack',
    damage: 8,
    range: 3,
    description: 'Causa 8 de dano. Alcance: 3',
  },
];

// Função para criar uma cópia do deck inicial
export function createStarterDeck(): Card[] {
  return STARTER_CARDS.map(card => ({ ...card }));
}

// Embaralhar array (Fisher-Yates shuffle)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
