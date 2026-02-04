import { Card } from '@/app/types/game';

// Cartas iniciais do jogador
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
