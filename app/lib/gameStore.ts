import { create } from 'zustand';
import { Card, Enemy, GamePhase, GameState, Player, HexPosition, HexMap } from '@/app/types/game';
import { createStarterDeck, shuffleArray } from './cards';
import { createEnemy, getEnemyAction, getEnemyDefinitionByName, ENEMY_DEFINITIONS } from './enemies';
import { 
  createHexMap, 
  hexDistance, 
  hexEquals, 
  getReachableHexes,
  hexNeighbors,
  isValidHex,
  getTile
} from './hexUtils';

// Configurações do mapa hexagonal
const MAP_RADIUS = 4;

const INITIAL_PLAYER: Player = {
  hp: 80,
  maxHp: 80,
  energy: 3,
  maxEnergy: 3,
  block: 0,
  position: { q: -2, r: 0 },
};

const HAND_SIZE = 5;

// Verificar se uma posição está ocupada
function isPositionOccupied(position: HexPosition, player: Player, enemies: Enemy[]): boolean {
  if (hexEquals(player.position, position)) {
    return true;
  }
  return enemies.some(e => hexEquals(e.position, position));
}

// Obter posições bloqueadas (jogador + inimigos)
function getBlockedPositions(player: Player, enemies: Enemy[]): HexPosition[] {
  return [player.position, ...enemies.map(e => e.position)];
}

// Encontrar inimigos no alcance
function getEnemiesInRange(playerPos: HexPosition, enemies: Enemy[], range: number): Enemy[] {
  return enemies.filter(e => hexDistance(playerPos, e.position) <= range);
}

interface GameActions {
  startCombat: (enemyIds: string[]) => void;
  selectCard: (card: Card) => void;
  cancelSelection: () => void;
  moveToPosition: (position: HexPosition) => void;
  selectTarget: (enemyId: string) => void;  // NEW: Select enemy target
  playCard: (cardId: string, targetEnemyId?: string) => void;
  endTurn: () => void;
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

// Função para comprar cartas
function drawCards(state: GameState, amount: number): { hand: Card[]; drawPile: Card[]; discardPile: Card[] } {
  let { hand, drawPile, discardPile } = state;
  hand = [...hand];
  drawPile = [...drawPile];
  discardPile = [...discardPile];
  
  for (let i = 0; i < amount; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break;
      drawPile = shuffleArray(discardPile);
      discardPile = [];
    }
    
    const card = drawPile.pop();
    if (card) {
      hand.push(card);
    }
  }
  
  return { hand, drawPile, discardPile };
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Estado inicial
  player: { ...INITIAL_PLAYER },
  deck: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  enemies: [],
  hexMap: createHexMap(MAP_RADIUS),
  phase: 'playerTurn',
  turn: 1,
  selectedCard: null,
  validMovePositions: [],
  targetableEnemyIds: [],
  
  startCombat: (enemyIds: string[]) => {
    const deck = createStarterDeck();
    const drawPile = shuffleArray([...deck]);
    const hexMap = createHexMap(MAP_RADIUS);
    
    const enemyPositions: HexPosition[] = [
      { q: 2, r: -1 },
      { q: 2, r: 1 },
      { q: 3, r: 0 },
    ];
    
    const enemies = enemyIds.map((id, index) => 
      createEnemy(id, `${id}_${index}`, enemyPositions[index] || { q: 3, r: index - 1 })
    );
    
    const initialState: Partial<GameState> = {
      player: { ...INITIAL_PLAYER },
      deck,
      hand: [],
      drawPile,
      discardPile: [],
      enemies,
      hexMap,
      phase: 'playerTurn',
      turn: 1,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
    };
    
    const cardState = drawCards(initialState as GameState, HAND_SIZE);
    
    set({
      ...initialState,
      ...cardState,
    });
  },
  
  selectCard: (card: Card) => {
    const state = get();
    if (state.phase !== 'playerTurn') return;
    if (card.cost > state.player.energy) return;
    
    if (card.type === 'movement' && card.movement) {
      // Movement card: show valid move positions
      const blocked = getBlockedPositions(state.player, state.enemies);
      const validPositions = getReachableHexes(
        state.player.position,
        card.movement,
        state.hexMap,
        blocked
      );
      
      set({
        selectedCard: card,
        validMovePositions: validPositions,
        targetableEnemyIds: [],
        phase: 'selectingMovement',
      });
    } else if (card.type === 'attack' && card.damage) {
      // Attack card: show targetable enemies
      const range = card.range || 1;
      const enemiesInRange = getEnemiesInRange(state.player.position, state.enemies, range);
      
      if (enemiesInRange.length === 0) {
        // No enemies in range - can't use this card
        return;
      } else if (enemiesInRange.length === 1) {
        // Only one enemy in range - attack directly
        get().playCard(card.id, enemiesInRange[0].id);
      } else {
        // Multiple enemies in range - let player choose
        set({
          selectedCard: card,
          validMovePositions: [],
          targetableEnemyIds: enemiesInRange.map(e => e.id),
          phase: 'selectingTarget',
        });
      }
    } else if (card.type === 'skill') {
      // Skills don't need target selection
      get().playCard(card.id);
    }
  },
  
  cancelSelection: () => {
    set({
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      phase: 'playerTurn',
    });
  },
  
  moveToPosition: (position: HexPosition) => {
    const state = get();
    if (state.phase !== 'selectingMovement') return;
    if (!state.selectedCard) return;
    
    const isValid = state.validMovePositions.some(p => hexEquals(p, position));
    if (!isValid) return;
    
    const cardIndex = state.hand.findIndex(c => c.id === state.selectedCard!.id);
    if (cardIndex === -1) return;
    
    const newHand = [...state.hand];
    const [playedCard] = newHand.splice(cardIndex, 1);
    
    const newPlayer = {
      ...state.player,
      position,
      energy: state.player.energy - playedCard.cost,
    };
    
    set({
      player: newPlayer,
      hand: newHand,
      discardPile: [...state.discardPile, playedCard],
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      phase: 'playerTurn',
    });
  },
  
  // NEW: Select an enemy to attack
  selectTarget: (enemyId: string) => {
    const state = get();
    if (state.phase !== 'selectingTarget') return;
    if (!state.selectedCard) return;
    if (!state.targetableEnemyIds.includes(enemyId)) return;
    
    // Execute the attack on the selected target
    get().playCard(state.selectedCard.id, enemyId);
  },
  
  playCard: (cardId: string, targetEnemyId?: string) => {
    const state = get();
    
    if (state.phase !== 'playerTurn' && state.phase !== 'selectingMovement' && state.phase !== 'selectingTarget') return;
    
    const cardIndex = state.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const card = state.hand[cardIndex];
    if (card.cost > state.player.energy) return;
    
    const newHand = [...state.hand];
    newHand.splice(cardIndex, 1);
    
    const newPlayer = {
      ...state.player,
      energy: state.player.energy - card.cost,
    };
    
    let newEnemies = [...state.enemies];
    
    if (card.type === 'attack' && card.damage) {
      const range = card.range || 1;
      
      let targetId = targetEnemyId;
      if (!targetId) {
        const inRange = getEnemiesInRange(state.player.position, newEnemies, range);
        targetId = inRange[0]?.id;
      }
      
      if (targetId) {
        const targetIndex = newEnemies.findIndex(e => e.id === targetId);
        
        if (targetIndex !== -1) {
          const target = { ...newEnemies[targetIndex] };
          
          if (hexDistance(state.player.position, target.position) <= range) {
            let damage = card.damage;
            
            if (target.block > 0) {
              const blockedDamage = Math.min(damage, target.block);
              target.block -= blockedDamage;
              damage -= blockedDamage;
            }
            
            target.hp = Math.max(0, target.hp - damage);
            newEnemies[targetIndex] = target;
            newEnemies = newEnemies.filter(e => e.hp > 0);
          }
        }
      }
    }
    
    if (card.block) {
      newPlayer.block += card.block;
    }
    
    const newDiscardPile = [...state.discardPile, card];
    const phase: GamePhase = newEnemies.length === 0 ? 'victory' : 'playerTurn';
    
    set({
      hand: newHand,
      player: newPlayer,
      enemies: newEnemies,
      discardPile: newDiscardPile,
      phase,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
    });
  },
  
  endTurn: () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;
    
    let discardPile = [...state.discardPile, ...state.hand];
    
    // === TURNO DOS INIMIGOS ===
    let player = { ...state.player };
    let enemies = state.enemies.map(e => ({ ...e }));
    let phase: GamePhase = 'playerTurn';
    
    for (const enemy of enemies) {
      const def = getEnemyDefinitionByName(enemy.name);
      const attackRange = def?.attackRange || 1;
      
      if (enemy.intent === 'attack') {
        if (hexDistance(enemy.position, player.position) <= attackRange) {
          let damage = enemy.intentValue;
          
          if (player.block > 0) {
            const blockedDamage = Math.min(damage, player.block);
            player.block -= blockedDamage;
            damage -= blockedDamage;
          }
          
          player.hp = Math.max(0, player.hp - damage);
          
          if (player.hp <= 0) {
            phase = 'defeat';
            break;
          }
        }
      } else if (enemy.intent === 'defend') {
        enemy.block += enemy.intentValue;
      } else if (enemy.intent === 'move') {
        const maxMove = enemy.intentValue;
        let bestPos = enemy.position;
        let bestDist = hexDistance(enemy.position, player.position);
        
        for (let step = 0; step < maxMove; step++) {
          const neighbors = hexNeighbors(bestPos);
          let moved = false;
          
          for (const neighbor of neighbors) {
            if (
              isValidHex(state.hexMap, neighbor) &&
              !isPositionOccupied(neighbor, player, enemies.filter(e => e.id !== enemy.id))
            ) {
              const tile = getTile(state.hexMap, neighbor);
              if (tile && tile.type === 'floor') {
                const dist = hexDistance(neighbor, player.position);
                if (dist < bestDist) {
                  bestDist = dist;
                  bestPos = neighbor;
                  moved = true;
                }
              }
            }
          }
          
          if (!moved) break;
        }
        
        enemy.position = bestPos;
      }
    }
    
    if (phase !== 'defeat') {
      const newTurn = state.turn + 1;
      
      enemies = enemies.map(enemy => {
        const defEntry = Object.entries(ENEMY_DEFINITIONS).find(
          ([, def]) => def.name === enemy.name
        );
        
        if (defEntry) {
          const [defId] = defEntry;
          const nextAction = getEnemyAction(defId, newTurn);
          return {
            ...enemy,
            intent: nextAction.intent,
            intentValue: nextAction.value,
          };
        }
        return enemy;
      });
      
      player.block = 0;
      player.energy = player.maxEnergy;
      
      const cardState = drawCards(
        { ...state, discardPile, hand: [] } as GameState,
        HAND_SIZE
      );
      
      set({
        player,
        enemies,
        hand: cardState.hand,
        drawPile: cardState.drawPile,
        discardPile: cardState.discardPile,
        turn: newTurn,
        phase,
        selectedCard: null,
        validMovePositions: [],
        targetableEnemyIds: [],
      });
    } else {
      set({ player, phase });
    }
  },
  
  resetGame: () => {
    set({
      player: { ...INITIAL_PLAYER },
      deck: [],
      hand: [],
      drawPile: [],
      discardPile: [],
      enemies: [],
      hexMap: createHexMap(MAP_RADIUS),
      phase: 'playerTurn',
      turn: 1,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
    });
  },
}));
