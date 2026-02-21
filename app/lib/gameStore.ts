import { create } from 'zustand';
import { Card, Enemy, GamePhase, GameState, Player, HexPosition, HexMap, CharacterClass, EnemyAction, MAX_FLOOR, InnateAbility, GameLogEntry, LogEntryType } from '@/app/types/game';
import { createClassDeck, shuffleArray, CHARACTER_CLASSES } from './cards';
import { pickRewardCards } from './cardRewards';
import { createEnemy, drawNextActionCard, getEnemyDefinitionByName, ENEMY_DEFINITIONS, createFloorEnemies, getFloorConfig } from './enemies';
import { 
  createHexMap, 
  hexDistance, 
  hexEquals, 
  getReachableHexes,
  hexNeighbors,
  hexesInRange,
  isValidHex,
  getTile
} from './hexUtils';

// Helper to get innate ability value by type
function getInnateAbilityValue(characterClass: CharacterClass, abilityType: InnateAbility['type']): number {
  const classDef = CHARACTER_CLASSES[characterClass];
  const ability = classDef.innateAbilities.find(a => a.type === abilityType);
  return ability?.value ?? 0;
}

// Helper to create log entries
let logIdCounter = 0;
function createLogEntry(
  turn: number,
  floor: number,
  type: LogEntryType,
  message: string,
  details?: GameLogEntry['details']
): GameLogEntry {
  return {
    id: `log_${++logIdCounter}`,
    turn,
    floor,
    type,
    message,
    details,
    timestamp: Date.now(),
  };
}

// Configurações do mapa hexagonal
const MAP_RADIUS = 4;

// Create initial player based on character class
function createInitialPlayer(characterClass: CharacterClass): Player {
  const classDef = CHARACTER_CLASSES[characterClass];
  return {
    characterClass,
    hp: classDef.baseHp,
    maxHp: classDef.baseHp,
    energy: classDef.baseEnergy,
    maxEnergy: classDef.baseEnergy,
    block: 0,
    position: { q: -2, r: 0 },
  };
}

// Default player for initial state
const INITIAL_PLAYER: Player = {
  characterClass: 'warrior',
  hp: 90,
  maxHp: 90,
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

// Obter vizinhos válidos (não bloqueados, dentro do mapa)
function getValidNeighbors(pos: HexPosition, hexMap: HexMap, blocked: HexPosition[]): HexPosition[] {
  const neighbors = hexNeighbors(pos);
  return neighbors.filter(neighbor => {
    const tile = getTile(hexMap, neighbor);
    if (!tile || tile.type === 'wall' || tile.type === 'pit') return false;
    return !blocked.some(p => hexEquals(p, neighbor));
  });
}

// Find shortest path from start to any of the target positions using BFS
function findPathToClosestTarget(
  hexMap: HexMap,
  start: HexPosition,
  targets: HexPosition[],
  blocked: HexPosition[]
): HexPosition[] | null {
  const targetKeys = new Set(targets.map(t => `${t.q},${t.r}`));
  const visited = new Set<string>();
  const parent = new Map<string, string | null>();
  const q: HexPosition[] = [start];
  const startKey = `${start.q},${start.r}`;
  visited.add(startKey);
  parent.set(startKey, null);

  while (q.length > 0) {
    const current = q.shift()!;
    const currentKey = `${current.q},${current.r}`;

    if (targetKeys.has(currentKey)) {
      // reconstruct path
      const path: HexPosition[] = [];
      let k: string | null = currentKey;
      while (k) {
        const [qv, rv] = k.split(',').map(Number);
        path.unshift({ q: qv, r: rv });
        k = parent.get(k) ?? null;
      }
      return path;
    }

    const neighbors = hexNeighbors(current);
    for (const n of neighbors) {
      const key = `${n.q},${n.r}`;
      if (visited.has(key)) continue;
      // skip blocked, non-floor, or out-of-map
      if (blocked.some(b => hexEquals(b, n))) continue;
      if (!isValidHex(hexMap, n)) continue;
      const tile = getTile(hexMap, n);
      if (!tile || tile.type === 'wall' || tile.type === 'pit') continue;

      visited.add(key);
      parent.set(key, currentKey);
      q.push(n);
    }
  }

  return null;
}

// Encontrar inimigos no alcance (considerando minRange e maxRange)
function getEnemiesInRange(playerPos: HexPosition, enemies: Enemy[], range: number, minRange: number = 1): Enemy[] {
  return enemies.filter(e => {
    const distance = hexDistance(playerPos, e.position);
    return distance >= minRange && distance <= range;
  });
}

interface GameActions {
  selectCharacter: (characterClass: CharacterClass) => void;
  startCombat: () => void;
  selectCard: (card: Card) => void;
  cancelSelection: () => void;
  moveToPosition: (position: HexPosition) => void;
  addHexToMovementPath: (position: HexPosition) => void;
  undoMovementStep: () => void;
  completeMovement: () => void;
  selectTarget: (enemyId: string) => void;
  confirmSkill: () => void;
  playCard: (cardId: string, targetEnemyId?: string) => void;
  endTurn: () => Promise<void>;
  selectRewardCard: (card: Card) => void;
  advanceFloor: () => void;
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
  // Estado inicial - começa na seleção de personagem
  player: { ...INITIAL_PLAYER },
  deck: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  enemies: [],
  hexMap: createHexMap(MAP_RADIUS),
  phase: 'characterSelect',
  turn: 1,
  floor: 1,
  selectedCard: null,
  validMovePositions: [],
  targetableEnemyIds: [],
  gameLog: [],
  movementPath: [],
  remainingMovement: 0,
  rewardCards: [],

  selectCharacter: (characterClass: CharacterClass) => {
    const player = createInitialPlayer(characterClass);
    set({ player });
  },

  startCombat: () => {
    const state = get();
    const characterClass = state.player.characterClass;
    const floor = state.floor;
    const classDef = CHARACTER_CLASSES[characterClass];
    
    const deck = createClassDeck(characterClass);
    const drawPile = shuffleArray([...deck]);
    const hexMap = createHexMap(MAP_RADIUS);
    
    // Create enemies based on current floor
    const enemies = createFloorEnemies(floor);
    
    const player = createInitialPlayer(characterClass);
    
    // Apply innate abilities for turn 1
    const passiveBlock = getInnateAbilityValue(characterClass, 'passiveBlock');
    const energyRegen = getInnateAbilityValue(characterClass, 'energyRegen');
    const bonusDraw = getInnateAbilityValue(characterClass, 'bonusDraw');
    
    player.block = passiveBlock;
    player.energy = player.maxEnergy + energyRegen; // Extra energy on first turn
    
    // Create initial game log
    const gameLog: GameLogEntry[] = [];
    logIdCounter = 0; // Reset counter for new game
    
    gameLog.push(createLogEntry(1, floor, 'floorStart',
      `🏰 Andar ${floor} - ${classDef.emoji} ${classDef.name} entra na masmorra`));
    gameLog.push(createLogEntry(1, floor, 'turnStart', `=== Turno 1 ===`));
    
    if (passiveBlock > 0) {
      gameLog.push(createLogEntry(1, floor, 'innateAbility',
        `🛡️ Postura Defensiva: +${passiveBlock} bloqueio`));
    }
    if (energyRegen > 0) {
      gameLog.push(createLogEntry(1, floor, 'innateAbility',
        `✨ Canalização Arcana: +${energyRegen} energia extra`));
    }
    
    const initialState: Partial<GameState> = {
      player,
      deck,
      hand: [],
      drawPile,
      discardPile: [],
      enemies,
      hexMap,
      gameLog,
      phase: 'playerTurn',
      turn: 1,
      floor,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
      rewardCards: [],
    };
    
    // Draw cards including bonus draw from innate ability
    const cardState = drawCards(initialState as GameState, HAND_SIZE + bonusDraw);
    
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
      // Movement card: start step-by-step movement
      // Show valid adjacent hexes for the first step
      const blocked = getBlockedPositions(state.player, state.enemies);
      const validNextPositions = getValidNeighbors(state.player.position, state.hexMap, blocked);
      
      set({
        selectedCard: card,
        validMovePositions: validNextPositions,
        targetableEnemyIds: [],
        phase: 'selectingMovement',
        movementPath: [],  // Start with empty path
        remainingMovement: card.movement,
      });
    } else if (card.type === 'attack' && card.damage) {
      // Attack card: show targetable enemies
      const range = card.range || 1;
      const minRange = card.minRange || 1;
      const enemiesInRange = getEnemiesInRange(state.player.position, state.enemies, range, minRange);
      
      if (enemiesInRange.length === 0) {
        // No enemies in range - can't use this card
        return;
      }
      
      // Always let player confirm target selection
      set({
        selectedCard: card,
        validMovePositions: [],
        targetableEnemyIds: enemiesInRange.map(e => e.id),
        phase: 'selectingTarget',
      });
    } else if (card.type === 'skill') {
      // Skill card: show confirmation
      set({
        selectedCard: card,
        validMovePositions: [],
        targetableEnemyIds: [],
        phase: 'confirmingSkill',
      });
    }
  },
  
  cancelSelection: () => {
    set({
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      phase: 'playerTurn',
      movementPath: [],
      remainingMovement: 0,
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
    
    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const tilesMovedCount = hexDistance(state.player.position, position);
    const newPlayer = {
      ...state.player,
      position,
      energy: state.player.energy - playedCard.cost,
    };
    
    // Log the movement
    const newLog = [...state.gameLog];
    newLog.push(createLogEntry(state.turn, state.floor, 'playerMove',
      `${classDef.emoji} ${classDef.name} move ${tilesMovedCount} para (${position.q}, ${position.r})`, {
      position,
    }));
    
    set({
      player: newPlayer,
      hand: newHand,
      discardPile: [...state.discardPile, playedCard],
      gameLog: newLog,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      phase: 'playerTurn',
    });
  },
  
  // Add a hex to the movement path (step-by-step movement)
  addHexToMovementPath: (position: HexPosition) => {
    const state = get();
    if (state.phase !== 'selectingMovement') return;
    if (!state.selectedCard || state.selectedCard.type !== 'movement') return;
    if (state.remainingMovement <= 0) return;
    
    // Check if position is valid (adjacent to current position or last position in path)
    const blocked = getBlockedPositions(state.player, state.enemies);
    const currentPos = state.movementPath.length > 0 
      ? state.movementPath[state.movementPath.length - 1]
      : state.player.position;
    
    const validNeighbors = getValidNeighbors(currentPos, state.hexMap, blocked);
    const isValid = validNeighbors.some(p => hexEquals(p, position));
    if (!isValid) return;
    
    // Check if position is already in path
    if (state.movementPath.some(p => hexEquals(p, position))) return;
    
    // Add position to path
    const newPath = [...state.movementPath, position];
    const newRemaining = state.remainingMovement - 1;
    
    // Get next valid positions (adjacent to the new position)
    const nextBlocked = [...blocked, ...newPath]; // Block positions in our path
    let nextValidPositions: HexPosition[] = [];
    
    // Only show next valid positions if there are remaining movement points
    if (newRemaining > 0) {
      nextValidPositions = getValidNeighbors(position, state.hexMap, nextBlocked);
    }
    
    set({
      movementPath: newPath,
      remainingMovement: newRemaining,
      validMovePositions: nextValidPositions,
    });
  },
  
  // Undo the last step in movement
  undoMovementStep: () => {
    const state = get();
    if (state.phase !== 'selectingMovement') return;
    if (state.movementPath.length === 0) return;
    
    // Remove last position from path
    const newPath = state.movementPath.slice(0, -1);
    const newRemaining = state.remainingMovement + 1;
    
    // Get valid neighbors from the new current position
    const blocked = getBlockedPositions(state.player, state.enemies);
    const currentPos = newPath.length > 0
      ? newPath[newPath.length - 1]
      : state.player.position;
    
    const nextBlocked = [...blocked, ...newPath]; // Block positions in our path
    const validPositions = getValidNeighbors(currentPos, state.hexMap, nextBlocked);
    
    set({
      movementPath: newPath,
      remainingMovement: newRemaining,
      validMovePositions: validPositions,
    });
  },
  
  // Complete the movement and apply it
  completeMovement: () => {
    const state = get();
    if (state.phase !== 'selectingMovement') return;
    if (!state.selectedCard || state.selectedCard.type !== 'movement') return;
    if (state.movementPath.length === 0) return;
    
    const cardIndex = state.hand.findIndex(c => c.id === state.selectedCard!.id);
    if (cardIndex === -1) return;
    
    const newHand = [...state.hand];
    const [playedCard] = newHand.splice(cardIndex, 1);
    
    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const finalPosition = state.movementPath[state.movementPath.length - 1];
    const tilesMovedCount = state.movementPath.length;
    
    const newPlayer = {
      ...state.player,
      position: finalPosition,
      energy: state.player.energy - playedCard.cost,
    };
    
    // Log the movement
    const newLog = [...state.gameLog];
    newLog.push(createLogEntry(state.turn, state.floor, 'playerMove',
      `${classDef.emoji} ${classDef.name} se move ${tilesMovedCount} hex para (${finalPosition.q}, ${finalPosition.r})`, {
      position: finalPosition,
    }));
    
    set({
      player: newPlayer,
      hand: newHand,
      discardPile: [...state.discardPile, playedCard],
      gameLog: newLog,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      phase: 'playerTurn',
      movementPath: [],
      remainingMovement: 0,
    });
  },
  
  // Select an enemy to attack
  selectTarget: (enemyId: string) => {
    const state = get();
    if (state.phase !== 'selectingTarget') return;
    if (!state.selectedCard) return;
    if (!state.targetableEnemyIds.includes(enemyId)) return;
    
    // Execute the attack on the selected target
    get().playCard(state.selectedCard.id, enemyId);
  },
  
  // Confirm skill card use
  confirmSkill: () => {
    const state = get();
    if (state.phase !== 'confirmingSkill') return;
    if (!state.selectedCard) return;
    
    // Execute the skill
    get().playCard(state.selectedCard.id);
  },
  
  playCard: (cardId: string, targetEnemyId?: string) => {
    const state = get();
    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    
    if (state.phase !== 'playerTurn' && state.phase !== 'selectingMovement' && state.phase !== 'selectingTarget' && state.phase !== 'confirmingSkill') return;
    
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
    const newLog = [...state.gameLog];
    
    if (card.type === 'attack' && card.damage) {
      const range = card.range || 1;
      const minRange = card.minRange || 1;
      
      let targetId = targetEnemyId;
      if (!targetId) {
        const inRange = getEnemiesInRange(state.player.position, newEnemies, range, minRange);
        targetId = inRange[0]?.id;
      }
      
      if (targetId) {
        const targetIndex = newEnemies.findIndex(e => e.id === targetId);
        
        if (targetIndex !== -1) {
          const target = { ...newEnemies[targetIndex] };
          const distance = hexDistance(state.player.position, target.position);
          
          if (distance >= minRange && distance <= range) {
            const originalDamage = card.damage;
            let damage = card.damage;
            let blockedAmount = 0;
            
            if (target.block > 0) {
              blockedAmount = Math.min(damage, target.block);
              target.block -= blockedAmount;
              damage -= blockedAmount;
            }
            
            target.hp = Math.max(0, target.hp - damage);
            
            // Log the attack
            const logMessage = blockedAmount > 0
              ? `${classDef.emoji} ${classDef.name} ataca ${target.emoji} ${target.name} com ${card.name}: ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
              : `${classDef.emoji} ${classDef.name} ataca ${target.emoji} ${target.name} com ${card.name}: ${originalDamage} dano`;
            
            newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack', logMessage, {
              attacker: classDef.name,
              target: target.name,
              damage: originalDamage,
              blocked: blockedAmount,
              finalDamage: damage,
            }));
            
            // Check if enemy was defeated
            if (target.hp <= 0) {
              newLog.push(createLogEntry(state.turn, state.floor, 'enemyDefeated', 
                `💀 ${target.emoji} ${target.name} foi derrotado!`, {
                target: target.name,
              }));
            }
            
            newEnemies[targetIndex] = target;
            newEnemies = newEnemies.filter(e => e.hp > 0);
          }
        }
      }
    }
    
    if (card.block) {
      newPlayer.block += card.block;
      
      // Log the block
      newLog.push(createLogEntry(state.turn, state.floor, 'playerBlock',
        `${classDef.emoji} ${classDef.name} usa ${card.name}: +${card.block} bloqueio (total: ${newPlayer.block})`, {
        block: card.block,
      }));
    }
    
    const newDiscardPile = [...state.discardPile, card];
    
    // Check if floor is cleared
    let phase: GamePhase = 'playerTurn';
    if (newEnemies.length === 0) {
      // If final floor, victory! Otherwise, floor complete
      phase = state.floor >= MAX_FLOOR ? 'victory' : 'floorComplete';
    }
    
    set({
      hand: newHand,
      player: newPlayer,
      enemies: newEnemies,
      discardPile: newDiscardPile,
      gameLog: newLog,
      phase,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
    });
  },
  
  endTurn: async () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;
    
    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const discardPile = [...state.discardPile, ...state.hand];
    const newLog = [...state.gameLog];
    
    // Log turn end
    newLog.push(createLogEntry(state.turn, state.floor, 'turnEnd',
      `--- Fim do turno ${state.turn} do jogador ---`));
    
    // === TURNO DOS INIMIGOS ===
    const player = { ...state.player };
    let enemies = state.enemies.map(e => ({ ...e }));
    let phase: GamePhase = 'playerTurn';
    
    // Helper sleep for animation
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // Helper function to execute a single enemy action
    const executeEnemyAction = async (enemy: Enemy, action: EnemyAction): Promise<boolean> => {
      const def = getEnemyDefinitionByName(enemy.name);
      const attackRange = def?.attackRange || 1;
      
      if (action.type === 'attack') {
        if (hexDistance(enemy.position, player.position) <= attackRange) {
          const originalDamage = action.value;
          let damage = action.value;
          let blockedAmount = 0;
          
          if (player.block > 0) {
            blockedAmount = Math.min(damage, player.block);
            player.block -= blockedAmount;
            damage -= blockedAmount;
          }
          
          player.hp = Math.max(0, player.hp - damage);
          
          // Log enemy attack
          const logMessage = blockedAmount > 0
            ? `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name}: ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
            : `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name}: ${originalDamage} dano`;
          
          newLog.push(createLogEntry(state.turn, state.floor, 'enemyAttack', logMessage, {
            attacker: enemy.name,
            target: classDef.name,
            damage: originalDamage,
            blocked: blockedAmount,
            finalDamage: damage,
          }));
          
          if (player.hp <= 0) {
            return false; // Player defeated
          }
        } else {
          // Enemy out of range
          newLog.push(createLogEntry(state.turn, state.floor, 'enemyAttack',
            `${enemy.emoji} ${enemy.name} tenta atacar mas está fora de alcance`));
        }
      } else if (action.type === 'defend') {
        enemy.block += action.value;
        newLog.push(createLogEntry(state.turn, state.floor, 'enemyBlock',
          `${enemy.emoji} ${enemy.name} se defende: +${action.value} bloqueio`, {
          block: action.value,
        }));
      } else if (action.type === 'move') {
        const maxMove = action.value;
        let bestPos = enemy.position;
        let bestDist = hexDistance(enemy.position, player.position);
        const startPos = { ...enemy.position };

        // Try to find a shortest path to any tile within the enemy's attack range
        // Prefer tiles at exact distance == attackRange so ranged enemies keep distance
        const allCandidateTiles = hexesInRange(player.position, attackRange).filter(t => {
          // skip player's tile
          if (hexEquals(t, player.position)) return false;
          const tile = getTile(state.hexMap, t);
          if (!tile || tile.type === 'wall' || tile.type === 'pit') return false;
          const otherEnemies = enemies.filter(e => e.id !== enemy.id);
          if (otherEnemies.some(e => hexEquals(e.position, t))) return false;
          return true;
        });

        // prefer tiles at exact distance == attackRange (keep optimal firing distance)
        const preferred = allCandidateTiles.filter(t => hexDistance(t, player.position) === attackRange);
        const targetTiles = preferred.length > 0 ? preferred : allCandidateTiles;

        let path: HexPosition[] | null = null;
        if (targetTiles.length > 0) {
          const blocked = getBlockedPositions(player, enemies.filter(e => e.id !== enemy.id));
          path = findPathToClosestTarget(state.hexMap, enemy.position, targetTiles, blocked);
        }

        // If we found a path to an adjacent tile, follow it (up to maxMove)
        if (path && path.length > 1) {
          // path includes start; get next steps
          const steps = path.slice(1, 1 + maxMove);
          const ANIM_DELAY = 250;
          for (const stepPos of steps) {
            enemies = enemies.map(e => e.id === enemy.id ? { ...e, position: stepPos } : e);
            set({ enemies });
            enemy.position = stepPos;
            // eslint-disable-next-line no-await-in-loop
            await sleep(ANIM_DELAY);
          }

          const finalPos = steps[steps.length - 1];
          newLog.push(createLogEntry(state.turn, state.floor, 'enemyMove',
            `${enemy.emoji} ${enemy.name} move ${steps.length} para (${finalPos.q}, ${finalPos.r})`, {
            position: finalPos,
          }));
        } else {
          // Fallback: greedy single-step moves as before
          const greedySteps: HexPosition[] = [];
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
            greedySteps.push(bestPos);
          }

          if (greedySteps.length > 0) {
            const ANIM_DELAY = 250;
            for (const stepPos of greedySteps) {
              enemies = enemies.map(e => e.id === enemy.id ? { ...e, position: stepPos } : e);
              set({ enemies });
              enemy.position = stepPos;
              // eslint-disable-next-line no-await-in-loop
              await sleep(ANIM_DELAY);
            }

            const finalPos = greedySteps[greedySteps.length - 1];
            newLog.push(createLogEntry(state.turn, state.floor, 'enemyMove',
              `${enemy.emoji} ${enemy.name} move ${greedySteps.length} para (${finalPos.q}, ${finalPos.r})`, {
              position: finalPos,
            }));
          }
        }
      }
      return true; // Continue
    };
    
    // Execute all actions for each enemy (awaiting animations when needed)
    for (const enemy of enemies) {
      if (!enemy.currentActionCard) continue;

      // Reset enemy block at the start of their turn
      enemy.block = 0;

      // Execute each action in the enemy's action card
      for (const action of enemy.currentActionCard.actions) {
        // eslint-disable-next-line no-await-in-loop
        const continueGame = await executeEnemyAction(enemy, action);
        if (!continueGame) {
          phase = 'defeat';
          break;
        }
      }

      if (phase === 'defeat') break;
    }
    
    if (phase !== 'defeat') {
      const newTurn = state.turn + 1;
      
      // Update enemies: draw next action card from their deck
      enemies = enemies.map(enemy => {
        const nextCardState = drawNextActionCard(enemy);
        return {
          ...enemy,
          currentActionCard: nextCardState.currentActionCard,
          actionDrawPile: nextCardState.actionDrawPile,
          actionDiscardPile: nextCardState.actionDiscardPile,
        };
      });
      
      // Apply innate abilities at start of player turn
      const passiveBlock = getInnateAbilityValue(player.characterClass, 'passiveBlock');
      const bonusDraw = getInnateAbilityValue(player.characterClass, 'bonusDraw');
      
      player.block = passiveBlock; // Passive block replaces 0
      player.energy = player.maxEnergy;
      
      // Log turn start and innate abilities
      newLog.push(createLogEntry(newTurn, state.floor, 'turnStart',
        `=== Turno ${newTurn} ===`));
      
      if (passiveBlock > 0) {
        newLog.push(createLogEntry(newTurn, state.floor, 'innateAbility',
          `🛡️ Postura Defensiva: +${passiveBlock} bloqueio`));
      }
      
      const cardState = drawCards(
        { ...state, discardPile, hand: [] } as GameState,
        HAND_SIZE + bonusDraw
      );
      
      set({
        player,
        enemies,
        hand: cardState.hand,
        drawPile: cardState.drawPile,
        discardPile: cardState.discardPile,
        gameLog: newLog,
        turn: newTurn,
        phase,
        selectedCard: null,
        validMovePositions: [],
        targetableEnemyIds: [],
        movementPath: [],
        remainingMovement: 0,
      });
    } else {
      set({ player, phase, gameLog: newLog });
    }
  },
  
  advanceFloor: () => {
    const state = get();
    if (state.phase !== 'floorComplete') return;
    
    const nextFloor = state.floor + 1;
    const player = { ...state.player };
    const classDef = CHARACTER_CLASSES[player.characterClass];
    const newLog = [...state.gameLog];
    
    // Apply room healing innate ability before advancing
    const roomHealing = getInnateAbilityValue(player.characterClass, 'roomHealing');
    if (roomHealing > 0) {
      player.hp = Math.min(player.maxHp, player.hp + roomHealing);
      newLog.push(createLogEntry(1, nextFloor, 'innateAbility',
        `❤️‍🩹 Resistência: +${roomHealing} HP recuperado`));
    }
    
    // Reset player position for new floor
    player.position = { q: -2, r: 0 };
    
    // Apply innate abilities for turn 1 of new floor
    const passiveBlock = getInnateAbilityValue(player.characterClass, 'passiveBlock');
    const energyRegen = getInnateAbilityValue(player.characterClass, 'energyRegen');
    const bonusDraw = getInnateAbilityValue(player.characterClass, 'bonusDraw');
    
    player.block = passiveBlock;
    player.energy = player.maxEnergy + energyRegen; // Extra energy on first turn
    
    // Log floor advancement
    newLog.push(createLogEntry(1, nextFloor, 'floorStart',
      `🏰 Andar ${nextFloor} - ${classDef.emoji} ${classDef.name} avança`));
    newLog.push(createLogEntry(1, nextFloor, 'turnStart', `=== Turno 1 ===`));
    
    if (passiveBlock > 0) {
      newLog.push(createLogEntry(1, nextFloor, 'innateAbility',
        `🛡️ Postura Defensiva: +${passiveBlock} bloqueio`));
    }
    if (energyRegen > 0) {
      newLog.push(createLogEntry(1, nextFloor, 'innateAbility',
        `✨ Canalização Arcana: +${energyRegen} energia extra`));
    }
    
    // Create new enemies for the next floor
    const enemies = createFloorEnemies(nextFloor);
    
    // Shuffle all cards back into draw pile
    const allCards = [...state.hand, ...state.drawPile, ...state.discardPile];
    const drawPile = shuffleArray(allCards);
    
    // Draw new hand with bonus draw
    const cardState = drawCards({
      ...state,
      hand: [],
      drawPile,
      discardPile: [],
    } as GameState, HAND_SIZE + bonusDraw);
    
    // Generate reward cards for all floors except after the final floor
    let rewardCards: Card[] = [];
    if (nextFloor <= MAX_FLOOR) {
      const [card1, card2] = pickRewardCards(player.characterClass);
      rewardCards = [card1, card2];
      newLog.push(createLogEntry(1, nextFloor, 'rewardStart',
        '🎁 Selecione uma carta para sua mão'));
    }
    
    set({
      floor: nextFloor,
      player,
      enemies,
      hand: cardState.hand,
      drawPile: cardState.drawPile,
      discardPile: cardState.discardPile,
      gameLog: newLog,
      rewardCards,
      phase: rewardCards.length > 0 ? 'selectingReward' : 'playerTurn',
      turn: 1,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
    });
  },

  selectRewardCard: (card: Card) => {
    const state = get();
    if (state.phase !== 'selectingReward' || state.rewardCards.length === 0) return;
    
    const newLog = [...state.gameLog];
    
    // Add card to deck with unique ID
    const newCard = {
      ...card,
      id: `${card.id}_${Date.now()}`,
    };
    const deck = [...state.deck, newCard];
    
    newLog.push(createLogEntry(state.turn, state.floor, 'cardReward',
      `✨ ${card.name} adicionado ao baralho`));
    
    set({
      deck,
      rewardCards: [],
      gameLog: newLog,
      phase: 'playerTurn',
    });
  },

  resetGame: () => {
    logIdCounter = 0; // Reset log counter
    set({
      player: { ...INITIAL_PLAYER },
      deck: [],
      hand: [],
      drawPile: [],
      discardPile: [],
      enemies: [],
      hexMap: createHexMap(MAP_RADIUS),
      gameLog: [],
      phase: 'characterSelect',
      turn: 1,
      floor: 1,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
      rewardCards: [],
    });
  },
}));
