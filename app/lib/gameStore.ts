import { create } from 'zustand';
import { Card, Enemy, GamePhase, GameState, Player, HexPosition, HexMap, CharacterClass, EnemyAction, MAX_FLOOR, InnateAbility, GameLogEntry, LogEntryType, DefaultHandCard, InitiativeResult, MAP_ROOMS_BEFORE_BOSS, RunCombatKind } from '@/app/types/game';
import { generateRunMap } from '@/app/lib/mapGeneration';
import { getNextMapChoices } from '@/app/lib/mapPath';
import { createClassDeck, shuffleArray, CHARACTER_CLASSES, WARRIOR_DEFAULT_CARDS, ARCHER_DEFAULT_CARDS, MAGE_DEFAULT_CARDS } from './cards';
import { pickRewardCards, pickMerchantOffers } from './cardRewards';
import { mapMonsterGoldLoot, merchantPriceForRarity, INITIAL_PLAYER_GOLD } from './goldEconomy';
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
    gold: INITIAL_PLAYER_GOLD,
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
  gold: INITIAL_PLAYER_GOLD,
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

// Encontrar inimigos no alcance (1 até range; ataques à distância podem acertar adjacente)
function getEnemiesInRange(playerPos: HexPosition, enemies: Enemy[], range: number): Enemy[] {
  return enemies.filter(e => {
    const distance = hexDistance(playerPos, e.position);
    return distance >= 1 && distance <= range;
  });
}

interface GameActions {
  selectCharacter: (characterClass: CharacterClass) => void;
  startCombat: () => void;
  rollInitiative: (selectedDiceIndices: number[]) => void;
  confirmInitiativeModal: () => Promise<void>;
  _processTurnAt: (index: number) => Promise<void>;
  selectCard: (card: Card) => void;
  cancelSelection: () => void;
  moveToPosition: (position: HexPosition) => void;
  addHexToMovementPath: (position: HexPosition) => void;
  undoMovementStep: () => void;
  completeMovement: () => void;
  selectTarget: (enemyId: string) => void;
  confirmSkill: () => void;
  confirmBurnCard: (handCardIdToBurn: string) => void;
  playCard: (cardId: string, targetEnemyId?: string) => void;
  playDefaultCard: (cardId: string) => void;
  selectDefaultCard: (defaultId: string) => void;
  playSelectedDefaultCard: (targetEnemyId?: string) => void;
  endTurn: () => void;
  selectRewardCard: (card: Card) => void;
  advanceFloor: () => void;
  selectMapNode: (nextNodeId: string) => void;
  confirmRestSite: () => void;
  startBossFightFromIntro: () => void;
  continueAfterMapMonster: () => void;
  buyMerchantCard: (offerIndex: number) => void;
  leaveMerchant: () => void;
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

function combatClearPhase(state: GameState, enemiesRemaining: number): GamePhase {
  if (enemiesRemaining > 0) return 'playerTurn';
  if (state.runCombatKind === 'boss') return 'victory';
  if (state.runCombatKind === 'mapMonster') return 'floorComplete';
  return state.floor >= MAX_FLOOR ? 'victory' : 'floorComplete';
}

function playerWithMapMonsterLoot(player: Player, state: GameState, phase: GamePhase): Player {
  if (phase !== 'floorComplete' || state.runCombatKind !== 'mapMonster') return player;
  const loot = mapMonsterGoldLoot(state.floor);
  return { ...player, gold: player.gold + loot };
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Estado inicial - começa na seleção de personagem
  player: { ...INITIAL_PLAYER },
  deck: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  burnedPile: [],
  defaultHand: [],
  runMap: null,
  mapCurrentNodeId: null,
  mapRoomsCompleted: 0,
  mapMonsterCombatsCompleted: 0,
  runCombatKind: 'none' as RunCombatKind,
  enemies: [],
  hexMap: createHexMap(MAP_RADIUS),
  phase: 'characterSelect',
  turn: 1,
  floor: 1,
  turnOrder: [],
  activeTurnIndex: 0,
  selectedCard: null,
  selectedCardIsDefault: false,
  cardsToBurn: 0,
  validMovePositions: [],
  targetableEnemyIds: [],
  gameLog: [],
  movementPath: [],
  remainingMovement: 0,
  rewardCards: [],
  merchantOffers: [],

  selectCharacter: (characterClass: CharacterClass) => {
    const player = createInitialPlayer(characterClass);
    set({ player });
  },

  startCombat: () => {
    const state = get();
    const characterClass = state.player.characterClass;
    const classDef = CHARACTER_CLASSES[characterClass];

    const deck = createClassDeck(characterClass);
    const drawPile = shuffleArray([...deck]);
    const hexMap = createHexMap(MAP_RADIUS);
    const runMap = generateRunMap();

    const player = createInitialPlayer(characterClass);

    const gameLog: GameLogEntry[] = [];
    logIdCounter = 0;

    gameLog.push(createLogEntry(1, 1, 'floorStart',
      `🏰 ${classDef.emoji} ${classDef.name} entra na masmorra — escolha o próximo nó no mapa.`));

    set({
      player,
      deck,
      hand: [],
      drawPile,
      discardPile: [],
      burnedPile: [],
      enemies: [],
      hexMap,
      runMap,
      mapCurrentNodeId: null,
      mapRoomsCompleted: 0,
      mapMonsterCombatsCompleted: 0,
      runCombatKind: 'none',
      gameLog,
      phase: 'selectingMapNode',
      turn: 1,
      floor: 1,
      turnOrder: [],
      activeTurnIndex: 0,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      cardsToBurn: 0,
      movementPath: [],
      remainingMovement: 0,
      rewardCards: [],
      merchantOffers: [],
      defaultHand: (characterClass === 'warrior' ? WARRIOR_DEFAULT_CARDS : characterClass === 'archer' ? ARCHER_DEFAULT_CARDS : MAGE_DEFAULT_CARDS).map(c => ({
        id: `default_${c.id}`,
        card: { ...c },
        usedThisTurn: false,
      })),
    });
  },

  selectMapNode: (nextNodeId: string) => {
    const state = get();
    if (state.phase !== 'selectingMapNode' || !state.runMap) return;
    const choices = getNextMapChoices(state.runMap, state.mapCurrentNodeId);
    if (!choices.some((n) => n.id === nextNodeId)) return;

    const byId = new Map(state.runMap.nodes.map((n) => [n.id, n]));
    const node = byId.get(nextNodeId);
    if (!node) return;

    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const newLog = [...state.gameLog];

    if (node.location === 'monster') {
      const encounterIndex = state.mapMonsterCombatsCompleted + 1;
      const enemies = createFloorEnemies(encounterIndex);
      const player = { ...state.player };
      player.position = { q: -2, r: 0 };
      const energyRegen = getInnateAbilityValue(state.player.characterClass, 'energyRegen');
      player.block = 0;
      player.energy = player.maxEnergy + energyRegen;

      newLog.push(createLogEntry(1, encounterIndex, 'floorStart',
        `🏰 Sala de combate (${encounterIndex}/10) — ${classDef.emoji} ${classDef.name}`));
      newLog.push(createLogEntry(1, encounterIndex, 'turnStart', `=== Turno 1 — Rolagem de Iniciativa ===`));
      if (energyRegen > 0) {
        newLog.push(createLogEntry(1, encounterIndex, 'innateAbility',
          `✨ Canalização Arcana: +${energyRegen} energia extra`));
      }

      set({
        mapCurrentNodeId: nextNodeId,
        player,
        enemies,
        floor: encounterIndex,
        runCombatKind: 'mapMonster',
        phase: 'rollingInitiative',
        turn: 1,
        turnOrder: [],
        activeTurnIndex: 0,
        selectedCard: null,
        validMovePositions: [],
        targetableEnemyIds: [],
        movementPath: [],
        remainingMovement: 0,
        rewardCards: [],
        merchantOffers: [],
        gameLog: newLog,
      });
      return;
    }

    if (node.location === 'merchant') {
      const merchantOffers = pickMerchantOffers(state.player.characterClass, 6);
      newLog.push(createLogEntry(state.turn, state.floor, 'rewardStart', '🛒 Mercador'));
      set({
        mapCurrentNodeId: nextNodeId,
        merchantOffers,
        rewardCards: [],
        phase: 'selectingMerchant',
        gameLog: newLog,
      });
      return;
    }

    if (node.location === 'treasure') {
      const [card1, card2] = pickRewardCards(state.player.characterClass);
      newLog.push(createLogEntry(state.turn, state.floor, 'rewardStart', '🎁 Escolha uma carta'));
      set({
        mapCurrentNodeId: nextNodeId,
        rewardCards: [card1, card2],
        merchantOffers: [],
        phase: 'selectingReward',
        gameLog: newLog,
      });
      return;
    }

    if (node.location === 'rest') {
      set({
        mapCurrentNodeId: nextNodeId,
        phase: 'restSite',
        gameLog: newLog,
      });
      return;
    }
  },

  confirmRestSite: () => {
    const state = get();
    if (state.phase !== 'restSite' || !state.runMap) return;

    const player = { ...state.player };
    const before = player.hp;
    const heal = Math.min(10, player.maxHp - player.hp);
    player.hp = Math.min(player.maxHp, player.hp + 10);

    const newLog = [...state.gameLog];
    newLog.push(createLogEntry(state.turn, state.floor, 'innateAbility',
      `💤 Descanso: +${heal} HP (${before} → ${player.hp})`, { healing: heal }));

    const nextRooms = state.mapRoomsCompleted + 1;
    const nextPhase: GamePhase =
      nextRooms >= MAP_ROOMS_BEFORE_BOSS ? 'bossRoomIntro' : 'selectingMapNode';

    const defaultHandReset = (state.player.characterClass === 'warrior'
      ? WARRIOR_DEFAULT_CARDS
      : state.player.characterClass === 'archer'
        ? ARCHER_DEFAULT_CARDS
        : MAGE_DEFAULT_CARDS
    ).map((c) => ({
      id: `default_${c.id}`,
      card: { ...c },
      usedThisTurn: false,
    }));

    set({
      player,
      mapRoomsCompleted: nextRooms,
      phase: nextPhase,
      gameLog: newLog,
      defaultHand: defaultHandReset,
    });
  },

  startBossFightFromIntro: () => {
    const state = get();
    if (state.phase !== 'bossRoomIntro' || !state.runMap) return;

    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const enemies = [
      createEnemy(state.runMap.bossDefinitionId, 'boss_0', { q: 0, r: -2 }),
    ];
    const player = { ...state.player };
    player.position = { q: -2, r: 0 };
    const energyRegen = getInnateAbilityValue(state.player.characterClass, 'energyRegen');
    player.block = 0;
    player.energy = player.maxEnergy + energyRegen;

    const newLog = [...state.gameLog];
    newLog.push(createLogEntry(1, MAX_FLOOR, 'floorStart',
      `🐉 Confronto final — ${classDef.emoji} ${classDef.name}`));
    newLog.push(createLogEntry(1, MAX_FLOOR, 'turnStart', `=== Turno 1 — Rolagem de Iniciativa ===`));
    if (energyRegen > 0) {
      newLog.push(createLogEntry(1, MAX_FLOOR, 'innateAbility',
        `✨ Canalização Arcana: +${energyRegen} energia extra`));
    }

    set({
      player,
      enemies,
      floor: MAX_FLOOR,
      runCombatKind: 'boss',
      phase: 'rollingInitiative',
      turn: 1,
      turnOrder: [],
      activeTurnIndex: 0,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
      rewardCards: [],
      merchantOffers: [],
      gameLog: newLog,
    });
  },

  continueAfterMapMonster: () => {
    const state = get();
    if (state.phase !== 'floorComplete' || state.runCombatKind !== 'mapMonster') return;

    const player = { ...state.player };
    const classDef = CHARACTER_CLASSES[player.characterClass];
    const newLog = [...state.gameLog];

    const roomHealing = getInnateAbilityValue(player.characterClass, 'roomHealing');
    if (roomHealing > 0) {
      player.hp = Math.min(player.maxHp, player.hp + roomHealing);
      newLog.push(createLogEntry(1, state.floor, 'innateAbility',
        `❤️‍🩹 Resistência: +${roomHealing} HP recuperado`));
    }

    player.position = { q: -2, r: 0 };
    const energyRegen = getInnateAbilityValue(player.characterClass, 'energyRegen');
    const bonusDraw = getInnateAbilityValue(player.characterClass, 'bonusDraw');
    player.block = 0;
    player.energy = player.maxEnergy + energyRegen;

    const allCards = [...state.hand, ...state.drawPile, ...state.discardPile, ...state.burnedPile];
    const drawPile = shuffleArray(allCards);
    const cardState = drawCards({
      ...state,
      hand: [],
      drawPile,
      discardPile: [],
    } as GameState, HAND_SIZE + bonusDraw);

    const mapMonsterCombatsCompleted = state.mapMonsterCombatsCompleted + 1;
    const mapRoomsCompleted = state.mapRoomsCompleted + 1;
    const nextFloorDisplay = Math.min(MAX_FLOOR, mapMonsterCombatsCompleted + 1);

    if (energyRegen > 0) {
      newLog.push(createLogEntry(1, nextFloorDisplay, 'innateAbility',
        `✨ Canalização Arcana: +${energyRegen} energia extra`));
    }

    const nextPhase: GamePhase =
      mapRoomsCompleted >= MAP_ROOMS_BEFORE_BOSS ? 'bossRoomIntro' : 'selectingMapNode';

    set({
      floor: nextFloorDisplay,
      mapMonsterCombatsCompleted,
      mapRoomsCompleted,
      player,
      enemies: [],
      hand: cardState.hand,
      drawPile: cardState.drawPile,
      discardPile: cardState.discardPile,
      burnedPile: [],
      gameLog: newLog,
      phase: nextPhase,
      turn: 1,
      runCombatKind: 'none',
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
      rewardCards: [],
      merchantOffers: [],
      turnOrder: [],
      activeTurnIndex: 0,
      defaultHand: (player.characterClass === 'warrior' ? WARRIOR_DEFAULT_CARDS : player.characterClass === 'archer' ? ARCHER_DEFAULT_CARDS : MAGE_DEFAULT_CARDS).map(c => ({
        id: `default_${c.id}`,
        card: { ...c },
        usedThisTurn: false,
      })),
    });
  },

  // === INITIATIVE SYSTEM ===

  rollInitiative: (selectedDiceIndices: number[]) => {
    const state = get();
    if (state.phase !== 'rollingInitiative') return;
    if (selectedDiceIndices.length === 0) return;

    const rollDie = (faces: number) => Math.floor(Math.random() * faces) + 1;
    const classDef = CHARACTER_CLASSES[state.player.characterClass];

    const fullPool =
      classDef.initiativeDice ?? [6, 6, 6];
    const playerDiceFaces = selectedDiceIndices
      .filter((i) => i >= 0 && i < fullPool.length)
      .map((i) => fullPool[i]);
    if (playerDiceFaces.length === 0) return;

    const playerDiceResults = playerDiceFaces.map((faces) => rollDie(faces));
    const playerTotal = playerDiceResults.reduce((a, b) => a + b, 0);
    const playerResult: InitiativeResult = {
      id: 'player',
      entityType: 'player',
      name: classDef.name,
      total: playerTotal,
      dice: playerDiceResults,
      diceFaces: playerDiceFaces,
      highestDie: Math.max(...playerDiceResults),
      hp: state.player.hp,
      emoji: classDef.emoji,
    };

    // Roll for each enemy group (same name = same roll); dice config is per enemy type (initiativeDice)
    const groupRolls = new Map<string, { total: number; dice: number[]; highestDie: number }>();
    for (const enemy of state.enemies) {
      if (!groupRolls.has(enemy.name)) {
        const enemyDiceFaces = enemy.initiativeDice ?? [6, 6, 6];
        const enemyDice = enemyDiceFaces.map((faces) => rollDie(faces));
        const total = enemyDice.reduce((a, b) => a + b, 0);
        groupRolls.set(enemy.name, { total, dice: enemyDice, highestDie: Math.max(...enemyDice) });
      }
    }

    // Build individual enemy results (each enemy uses its own initiativeDice for diceFaces display)
    const enemyResults: InitiativeResult[] = state.enemies.map(enemy => {
      const group = groupRolls.get(enemy.name)!;
      const diceFaces = enemy.initiativeDice ?? [6, 6, 6];
      return {
        id: enemy.id,
        entityType: 'enemy',
        name: enemy.name,
        total: group.total,
        dice: group.dice,
        diceFaces,
        highestDie: group.highestDie,
        hp: enemy.hp,
        emoji: enemy.emoji,
      };
    });

    // Combine and sort: higher total first, then highest die, then player wins ties, then hp
    const allResults: InitiativeResult[] = [playerResult, ...enemyResults];
    allResults.sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      if (b.highestDie !== a.highestDie) return b.highestDie - a.highestDie;
      // Player wins ties vs enemies
      if (a.entityType === 'player' && b.entityType === 'enemy') return -1;
      if (a.entityType === 'enemy' && b.entityType === 'player') return 1;
      // Among enemies, highest HP first
      return b.hp - a.hp;
    });

    set({
      turnOrder: allResults,
      activeTurnIndex: 0,
      phase: 'viewingInitiative',
    });
  },

  confirmInitiativeModal: async () => {
    const state = get();
    if (state.phase !== 'viewingInitiative') return;

    // Start processing the first entity in the order
    await get()._processTurnAt(0);
  },

  // Internal: process the entity at a given index in the turn order
  _processTurnAt: async (index: number) => {
    const state = get();
    const order = state.turnOrder;

    // Check if round is over
    if (index >= order.length) {
      // New round: bump turn counter, draw next action card for all enemies,
      // then start new initiative phase. We draw here (not after each enemy
      // turn) so the intention shown on EnemyCard stays "what they just did"
      // until the round ends, then becomes "what they'll do next round".
      const newTurn = state.turn + 1;
      const newLog = [...state.gameLog];
      newLog.push(createLogEntry(newTurn, state.floor, 'turnStart', `=== Turno ${newTurn} ===`));

      const updatedEnemies = state.enemies.map((enemy) => {
        const nextCardState = drawNextActionCard(enemy);
        return { ...enemy, ...nextCardState, block: 0 };
      });

      set({
        enemies: updatedEnemies,
        gameLog: newLog,
        turn: newTurn,
        turnOrder: [],
        activeTurnIndex: 0,
        phase: 'rollingInitiative',
        selectedCard: null,
        defaultHand: state.defaultHand.map(d => ({ ...d, usedThisTurn: false })),
      });
      return;
    }

    const current = order[index];
    set({ activeTurnIndex: index });

    if (current.entityType === 'player') {
      // Is this player's entity still valid? (always yes)
      // Apply player turn-start effects
      const bonusDraw = getInnateAbilityValue(state.player.characterClass, 'bonusDraw');

      const updatedPlayer = {
        ...state.player,
        block: 0,
        energy: state.player.maxEnergy, // Refill to limit each round; cards can grant extra for that round only
      };

      // Only discard hand and redraw when hand is empty (e.g. start of new round after we already played).
      // When we already have cards (e.g. after reward or after advancing floor), keep the hand.
      const shouldRedraw = state.hand.length === 0;
      const discardPile = shouldRedraw ? [...state.discardPile, ...state.hand] : state.discardPile;
      const cardState = shouldRedraw
        ? drawCards(
            { ...state, discardPile, hand: [] } as GameState,
            HAND_SIZE + bonusDraw
          )
        : { hand: state.hand, drawPile: state.drawPile, discardPile: state.discardPile };

      const newLog = [...state.gameLog];

      set({
        player: updatedPlayer,
        hand: cardState.hand,
        drawPile: cardState.drawPile,
        discardPile: cardState.discardPile,
        gameLog: newLog,
        phase: 'playerTurn',
        selectedCard: null,
        validMovePositions: [],
        targetableEnemyIds: [],
        movementPath: [],
        remainingMovement: 0,
        defaultHand: state.defaultHand.map(d => ({ ...d, usedThisTurn: false })),
      });
      // Player must act manually; endTurn will call _processTurnAt(index+1)
    } else {
      // Enemy turn
      const enemyId = current.id;
      let enemies = get().enemies.map(e => ({ ...e }));
      const enemy = enemies.find(e => e.id === enemyId);

      if (!enemy || enemy.hp <= 0 || !enemy.currentActionCard) {
        // Skip dead/no-card enemy
        await get()._processTurnAt(index + 1);
        return;
      }

      const classDef = CHARACTER_CLASSES[state.player.characterClass];
      const player = { ...get().player };
      const newLog = [...get().gameLog];
      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
      let phase: GamePhase = 'playerTurn'; // will remain unless defeat

      // Reset enemy block
      enemy.block = 0;
      enemies = enemies.map(e => e.id === enemy.id ? { ...e, block: 0 } : e);
      set({ enemies });

      for (const action of enemy.currentActionCard.actions) {
        if (action.type === 'attack') {
          const attackRange = enemy.attackRange;
          const distance = hexDistance(enemy.position, player.position);
          if (distance <= attackRange) {
            const isRangedVsAdjacent = attackRange > 1 && distance === 1;
            let attackHits = true;
            let adjacentRoll: number | undefined;
            if (isRangedVsAdjacent) {
              adjacentRoll = 1 + Math.floor(Math.random() * 6);
              attackHits = adjacentRoll >= 3;
              if (!attackHits) {
                newLog.push(createLogEntry(state.turn, state.floor, 'enemyAttack',
                  `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name} (alcance vs adjacente): 1d6 = ${adjacentRoll} — errou! (1-2 = erra)`));
                set({ gameLog: newLog });
              }
            }
            if (attackHits) {
              const originalDamage = action.value;
              let damage = action.value;
              let blockedAmount = 0;
              if (player.block > 0) {
                blockedAmount = Math.min(damage, player.block);
                player.block -= blockedAmount;
                damage -= blockedAmount;
              }
              player.hp = Math.max(0, player.hp - damage);

              const logMsg = isRangedVsAdjacent
                ? (blockedAmount > 0
                  ? `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                  : `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${originalDamage} dano`)
                : (blockedAmount > 0
                  ? `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name}: ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                  : `${enemy.emoji} ${enemy.name} ataca ${classDef.emoji} ${classDef.name}: ${originalDamage} dano`);

              newLog.push(createLogEntry(state.turn, state.floor, 'enemyAttack', logMsg, {
                attacker: enemy.name, target: classDef.name,
                damage: originalDamage, blocked: blockedAmount, finalDamage: damage,
              }));

              set({ player, gameLog: newLog });
              await sleep(300);

              if (player.hp <= 0) {
                phase = 'defeat';
                break;
              }
            }
          } else {
            newLog.push(createLogEntry(state.turn, state.floor, 'enemyAttack',
              `${enemy.emoji} ${enemy.name} tenta atacar mas está fora de alcance`));
            set({ gameLog: newLog });
          }
        } else if (action.type === 'defend') {
          enemy.block += action.value;
          enemies = enemies.map(e => e.id === enemy.id ? { ...e, block: enemy.block } : e);
          newLog.push(createLogEntry(state.turn, state.floor, 'enemyBlock',
            `${enemy.emoji} ${enemy.name} se defende: +${action.value} bloqueio`, { block: action.value }));
          set({ enemies, gameLog: newLog });
          await sleep(200);
        } else if (action.type === 'move') {
          const maxMove = action.value;
          const attackRange = enemy.attackRange;
          const allCandidateTiles = hexesInRange(get().player.position, attackRange).filter(t => {
            if (hexEquals(t, get().player.position)) return false;
            const tile = getTile(get().hexMap, t);
            if (!tile || tile.type === 'wall' || tile.type === 'pit') return false;
            const otherEnemies = enemies.filter(e => e.id !== enemy.id);
            if (otherEnemies.some(e => hexEquals(e.position, t))) return false;
            return true;
          });
          const preferred = allCandidateTiles.filter(t => hexDistance(t, get().player.position) === attackRange);
          const targetTiles = preferred.length > 0 ? preferred : allCandidateTiles;
          let path: HexPosition[] | null = null;
          if (targetTiles.length > 0) {
            const blocked = getBlockedPositions(player, enemies.filter(e => e.id !== enemy.id));
            path = findPathToClosestTarget(get().hexMap, enemy.position, targetTiles, blocked);
          }

          if (path && path.length > 1) {
            const steps = path.slice(1, 1 + maxMove);
            for (const stepPos of steps) {
              enemies = enemies.map(e => e.id === enemy.id ? { ...e, position: stepPos } : e);
              enemy.position = stepPos;
              set({ enemies });
              // eslint-disable-next-line no-await-in-loop
              await sleep(250);
            }
            const finalPos = steps[steps.length - 1];
            newLog.push(createLogEntry(state.turn, state.floor, 'enemyMove',
              `${enemy.emoji} ${enemy.name} move ${steps.length} para (${finalPos.q}, ${finalPos.r})`,
              { position: finalPos }));
            set({ gameLog: newLog });
          }
        }
      }

      if (phase === 'defeat') {
        set({ player, phase: 'defeat', gameLog: newLog });
        return;
      }

      // Do not draw the next card here — keep showing the intention they just
      // executed until the round ends. Cards are drawn for all enemies when the
      // round ends (see round-over branch above).
      set({ enemies, player });

      // Small pause before next entity
      await sleep(400);

      // Advance to next entity
      await get()._processTurnAt(index + 1);
    }
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
        selectedCardIsDefault: false,
        validMovePositions: validNextPositions,
        targetableEnemyIds: [],
        phase: 'selectingMovement',
        movementPath: [],  // Start with empty path
        remainingMovement: card.movement,
      });
    } else if (card.type === 'attack' && card.damage) {
      // Attack card: show targetable enemies (1 to range; ranged can target adjacent)
      const range = card.range || 1;
      const enemiesInRange = getEnemiesInRange(state.player.position, state.enemies, range);

      if (enemiesInRange.length === 0) {
        // No enemies in range - can't use this card
        return;
      }

      // Always let player confirm target selection
      set({
        selectedCard: card,
        selectedCardIsDefault: false,
        validMovePositions: [],
        targetableEnemyIds: enemiesInRange.map(e => e.id),
        phase: 'selectingTarget',
      });
    } else if (card.type === 'skill') {
      if (card.burnsCards) {
        set({
          selectedCard: card,
          selectedCardIsDefault: false,
          validMovePositions: [],
          targetableEnemyIds: [],
          cardsToBurn: card.burnsCards,
          phase: 'selectingBurn',
        });
      } else {
        // Skill card: show confirmation
        set({
          selectedCard: card,
          selectedCardIsDefault: false,
          validMovePositions: [],
          targetableEnemyIds: [],
          phase: 'confirmingSkill',
        });
      }
    }
  },

  selectDefaultCard: (defaultId: string) => {
    const state = get();
    if (state.phase !== 'playerTurn') return;
    const entry = state.defaultHand.find(d => d.id === defaultId);
    if (!entry) return;
    const card = entry.card;
    if (card.cost > state.player.energy) return;

    if (card.type === 'movement' && card.movement) {
      const blocked = getBlockedPositions(state.player, state.enemies);
      const validNextPositions = getValidNeighbors(state.player.position, state.hexMap, blocked);

      set({
        selectedCard: card,
        selectedCardIsDefault: true,
        validMovePositions: validNextPositions,
        targetableEnemyIds: [],
        phase: 'selectingMovement',
        movementPath: [],
        remainingMovement: card.movement,
      });
    } else if (card.type === 'attack' && card.damage) {
      const range = card.range || 1;
      const enemiesInRange = getEnemiesInRange(state.player.position, state.enemies, range);
      if (enemiesInRange.length === 0) return;

      set({
        selectedCard: card,
        selectedCardIsDefault: true,
        validMovePositions: [],
        targetableEnemyIds: enemiesInRange.map(e => e.id),
        phase: 'selectingTarget',
      });
    } else if (card.type === 'skill') {
      set({
        selectedCard: card,
        selectedCardIsDefault: true,
        validMovePositions: [],
        targetableEnemyIds: [],
        phase: 'confirmingSkill',
      });
    }
  },

  cancelSelection: () => {
    set({
      selectedCard: null,
      selectedCardIsDefault: false,
      validMovePositions: [],
      targetableEnemyIds: [],
      cardsToBurn: 0,
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
    const finalPosition = state.movementPath[state.movementPath.length - 1];
    const tilesMovedCount = state.movementPath.length;

    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const newLog = [...state.gameLog];

    if (state.selectedCardIsDefault) {
      // Apply movement for default card (do not remove from deck/discard)
      const card = state.selectedCard!;
      const newPlayer = {
        ...state.player,
        position: finalPosition,
        energy: state.player.energy - card.cost,
      };

      newLog.push(createLogEntry(state.turn, state.floor, 'playerMove',
        `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} e se move ${tilesMovedCount} hex para (${finalPosition.q}, ${finalPosition.r})`, {
        position: finalPosition,
      }));

      // mark default card used
      const newDefaultHand = state.defaultHand.map(d => d.card.id === card.id ? { ...d, usedThisTurn: true } : d);

      set({
        player: newPlayer,
        gameLog: newLog,
        defaultHand: newDefaultHand,
        selectedCard: null,
        selectedCardIsDefault: false,
        validMovePositions: [],
        targetableEnemyIds: [],
        phase: 'playerTurn',
        movementPath: [],
        remainingMovement: 0,
      });
    } else {
      const cardIndex = state.hand.findIndex(c => c.id === state.selectedCard!.id);
      if (cardIndex === -1) return;

      const newHand = [...state.hand];
      const [playedCard] = newHand.splice(cardIndex, 1);

      const newPlayer = {
        ...state.player,
        position: finalPosition,
        energy: state.player.energy - playedCard.cost,
      };

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
        selectedCardIsDefault: false,
        validMovePositions: [],
        targetableEnemyIds: [],
        phase: 'playerTurn',
        movementPath: [],
        remainingMovement: 0,
      });
    }
  },

  // Select an enemy to attack
  selectTarget: (enemyId: string) => {
    const state = get();
    if (state.phase !== 'selectingTarget') return;
    if (!state.selectedCard) return;
    if (!state.targetableEnemyIds.includes(enemyId)) return;
    // If selected card is from default hand, play via default flow
    if (state.selectedCardIsDefault) {
      get().playSelectedDefaultCard(enemyId);
      return;
    }

    // Execute the attack on the selected target for regular hand
    get().playCard(state.selectedCard.id, enemyId);
  },

  // Confirm skill card use
  confirmSkill: () => {
    const state = get();
    if (state.phase !== 'confirmingSkill') return;
    if (!state.selectedCard) return;
    // If it's a default card, route to default play
    if (state.selectedCardIsDefault) {
      get().playSelectedDefaultCard();
      return;
    }

    // Execute the skill for regular hand
    get().playCard(state.selectedCard.id);
  },

  // Confirm burn selection
  confirmBurnCard: (handCardIdToBurn: string) => {
    const state = get();
    if (state.phase !== 'selectingBurn') return;
    if (!state.selectedCard) return;

    const sourceCardIndex = state.hand.findIndex(c => c.id === state.selectedCard!.id);
    if (sourceCardIndex === -1) return;

    const targetCardIndex = state.hand.findIndex(c => c.id === handCardIdToBurn);
    if (targetCardIndex === -1) return;

    const newHand = [...state.hand];
    const [burnedCard] = newHand.splice(targetCardIndex, 1);

    // Burned cards stay in the deck (deck = full library); they just move to burnedPile for this room
    const newBurnedPile = [...state.burnedPile, burnedCard];

    // Decrease cards to burn count
    const newCardsToBurn = state.cardsToBurn - 1;

    if (newCardsToBurn > 0) {
      set({
        hand: newHand,
        burnedPile: newBurnedPile,
        cardsToBurn: newCardsToBurn,
      });
      return;
    }

    // Once all cards are properly burned, update state to confirmingSkill and call playCard
    set({
      hand: newHand,
      burnedPile: newBurnedPile,
      cardsToBurn: 0,
      phase: 'confirmingSkill',
    });

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

    let newHand = [...state.hand];
    newHand.splice(cardIndex, 1);

    let newEnergy = state.player.energy - card.cost;
    if (card.energy) {
      newEnergy = newEnergy + card.energy; // Energy gains are not capped by maxEnergy
    }
    const newPlayer = {
      ...state.player,
      energy: newEnergy,
    };

    let newEnemies = [...state.enemies];
    const newLog = [...state.gameLog];

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
          const distance = hexDistance(state.player.position, target.position);

          if (distance >= 1 && distance <= range) {
            const isRangedVsAdjacent = range > 1 && distance === 1;
            let attackHits = true;
            let adjacentRoll: number | undefined;

            if (isRangedVsAdjacent) {
              adjacentRoll = 1 + Math.floor(Math.random() * 6);
              attackHits = adjacentRoll >= 3;
              if (!attackHits) {
                newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack',
                  `${classDef.emoji} ${classDef.name} ataca ${target.emoji} ${target.name} com ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll} — errou! (1-2 = erra)`, {
                  attacker: classDef.name,
                  target: target.name,
                }));
              }
            }

            if (attackHits) {
              const originalDamage = card.damage;
              let damage = card.damage;
              let blockedAmount = 0;

              if (target.block > 0) {
                blockedAmount = Math.min(damage, target.block);
                target.block -= blockedAmount;
                damage -= blockedAmount;
              }

              target.hp = Math.max(0, target.hp - damage);

              if (!isRangedVsAdjacent) {
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
              } else {
                const dmgPart = blockedAmount > 0
                  ? `${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                  : `${originalDamage} dano`;
                newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack',
                  `${classDef.emoji} ${classDef.name} ataca ${target.emoji} ${target.name} com ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${dmgPart}`, {
                  attacker: classDef.name,
                  target: target.name,
                  damage: originalDamage,
                  blocked: blockedAmount,
                  finalDamage: damage,
                }));
              }

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
    }

    if (card.block) {
      newPlayer.block += card.block;

      // Log the block
      newLog.push(createLogEntry(state.turn, state.floor, 'playerBlock',
        `${classDef.emoji} ${classDef.name} usa ${card.name}: +${card.block} bloqueio (total: ${newPlayer.block})`, {
        block: card.block,
      }));
    }

    if (card.loseHp) {
      const damage = card.loseHp;
      let hpLoss = damage;
      let blocked = 0;
      if (newPlayer.block > 0) {
        blocked = Math.min(newPlayer.block, damage);
        newPlayer.block -= blocked;
        hpLoss = Math.max(0, damage - blocked);
      }
      newPlayer.hp = Math.max(0, newPlayer.hp - hpLoss);
      newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack',
        `${classDef.emoji} ${classDef.name} usa ${card.name}: perde ${hpLoss} HP${blocked > 0 ? ` (${blocked} bloqueado)` : ''}`, {
        damage: hpLoss,
      }));
    }

    if (card.energy) {
      newLog.push(createLogEntry(state.turn, state.floor, 'innateAbility',
        `${classDef.emoji} ${classDef.name} usa ${card.name}: +${card.energy} energia`, {
        healing: card.energy,
      }));
    }

    let newDrawPile = [...state.drawPile];
    let newDiscardPile = [...state.discardPile];
    let newBurnedPile = [...state.burnedPile];

    if (card.drawCards) {
      // Create temporary state state to use drawCards helper function
      const tempState = { ...state, hand: newHand, drawPile: newDrawPile, discardPile: newDiscardPile };
      const drawn = drawCards(tempState as GameState, card.drawCards);

      newHand = drawn.hand;
      newDrawPile = drawn.drawPile;
      newDiscardPile = drawn.discardPile;

      newLog.push(createLogEntry(state.turn, state.floor, 'playerDraw',
        `${classDef.emoji} ${classDef.name} usa ${card.name} e compra ${card.drawCards} carta(s).`, {
        cards: card.drawCards,
      }));
    }

    if (card.exhaust) {
      newBurnedPile = [...newBurnedPile, card];
    } else {
      newDiscardPile.push(card);
    }

    // Check for defeat (e.g. from loseHp) or floor cleared
    let phase: GamePhase = 'playerTurn';
    if (newPlayer.hp <= 0) {
      phase = 'defeat';
    } else if (newEnemies.length === 0) {
      phase = combatClearPhase(state, newEnemies.length);
    }

    const playerOut = playerWithMapMonsterLoot(newPlayer, state, phase);

    set({
      hand: newHand,
      player: playerOut,
      enemies: newEnemies,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      burnedPile: newBurnedPile,
      gameLog: newLog,
      phase,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
    });
  },

  playDefaultCard: (cardId: string) => {
    const state = get();
    if (state.phase !== 'playerTurn') return;

    const defIndex = state.defaultHand.findIndex(d => d.id === cardId);
    if (defIndex === -1) return;
    const defEntry = state.defaultHand[defIndex];
    if (defEntry.usedThisTurn) return;
    const card = defEntry.card;
    if (card.cost > state.player.energy) return;

    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const player = { ...state.player };
    let enemies = state.enemies.map(e => ({ ...e }));
    const newLog = [...state.gameLog];

    // Apply effects (attack/skill/movement)
    if (card.type === 'attack' && card.damage) {
      const range = card.range || 1;
      const inRange = getEnemiesInRange(player.position, enemies, range);
      const target = inRange[0];
      if (target) {
        const targetIndex = enemies.findIndex(e => e.id === target.id);
        if (targetIndex !== -1) {
          const tgt = { ...enemies[targetIndex] };
          const distance = hexDistance(player.position, tgt.position);
          const isRangedVsAdjacent = range > 1 && distance === 1;
          let attackHits = true;
          let adjacentRoll: number | undefined;
          if (isRangedVsAdjacent) {
            adjacentRoll = 1 + Math.floor(Math.random() * 6);
            attackHits = adjacentRoll >= 3;
            if (!attackHits) {
              newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack',
                `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll} — errou! (1-2 = erra)`, { attacker: classDef.name, target: tgt.name }));
            }
          }
          if (attackHits) {
            const originalDamage = card.damage!;
            let damage = card.damage!;
            let blockedAmount = 0;
            if (tgt.block > 0) {
              blockedAmount = Math.min(damage, tgt.block);
              tgt.block -= blockedAmount;
              damage -= blockedAmount;
            }
            tgt.hp = Math.max(0, tgt.hp - damage);
            const logMessage = isRangedVsAdjacent
              ? (blockedAmount > 0
                ? `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                : `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${originalDamage} dano`)
              : (blockedAmount > 0
                ? `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name}: ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                : `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name}: ${originalDamage} dano`);
            newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack', logMessage, {
              attacker: classDef.name,
              target: tgt.name,
              damage: originalDamage,
              blocked: blockedAmount,
              finalDamage: damage,
            }));
            if (tgt.hp <= 0) {
              newLog.push(createLogEntry(state.turn, state.floor, 'enemyDefeated', `💀 ${tgt.emoji} ${tgt.name} foi derrotado!`, { target: tgt.name }));
            }
            enemies[targetIndex] = tgt;
            enemies = enemies.filter(e => e.hp > 0);
          }
        }
      }
    }

    if (card.block) {
      player.block += card.block;
      newLog.push(createLogEntry(state.turn, state.floor, 'playerBlock',
        `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name}: +${card.block} bloqueio (total: ${player.block})`, {
        block: card.block,
      }));
    }

    if (card.type === 'movement' && card.movement) {
      // try to move towards nearest enemy up to movement value
      if (enemies.length > 0) {
        const targets = enemies.map(e => e.position);
        const path = findPathToClosestTarget(state.hexMap, player.position, targets, getBlockedPositions(player, enemies));
        if (path && path.length > 1) {
          const steps = path.slice(1, 1 + card.movement);
          const finalPos = steps[steps.length - 1];
          player.position = finalPos;
          newLog.push(createLogEntry(state.turn, state.floor, 'playerMove',
            `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} e se move ${steps.length} para (${finalPos.q}, ${finalPos.r})`, {
            position: finalPos,
          }));
        }
      }
    }

    // Consume energy and mark used
    player.energy = player.energy - card.cost;
    const newDefaultHand = state.defaultHand.map((d, i) => i === defIndex ? { ...d, usedThisTurn: true } : d);

    let phase: GamePhase = 'playerTurn';
    if (enemies.length === 0) {
      phase = combatClearPhase(state, enemies.length);
    }

    const playerOutDefault = playerWithMapMonsterLoot(player, state, phase);

    set({
      player: playerOutDefault,
      enemies,
      gameLog: newLog,
      defaultHand: newDefaultHand,
      phase,
      selectedCard: null,
      selectedCardIsDefault: false,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
    });
  },

  playSelectedDefaultCard: (targetEnemyId?: string) => {
    const state = get();
    if (!state.selectedCard || !state.selectedCardIsDefault) return;
    const card = state.selectedCard;
    if (card.cost > state.player.energy) return;

    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const player = { ...state.player };
    let enemies = state.enemies.map(e => ({ ...e }));
    const newLog = [...state.gameLog];

    if (card.type === 'attack' && card.damage) {
      const range = card.range || 1;

      let targetId = targetEnemyId;
      if (!targetId) {
        const inRange = getEnemiesInRange(player.position, enemies, range);
        targetId = inRange[0]?.id;
      }

      if (targetId) {
        const targetIndex = enemies.findIndex(e => e.id === targetId);
        if (targetIndex !== -1) {
          const target = { ...enemies[targetIndex] };
          const distance = hexDistance(player.position, target.position);
          if (distance >= 1 && distance <= range) {
            const isRangedVsAdjacent = range > 1 && distance === 1;
            let attackHits = true;
            let adjacentRoll: number | undefined;
            if (isRangedVsAdjacent) {
              adjacentRoll = 1 + Math.floor(Math.random() * 6);
              attackHits = adjacentRoll >= 3;
              if (!attackHits) {
                newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack',
                  `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll} — errou! (1-2 = erra)`, { attacker: classDef.name, target: target.name }));
              }
            }
            if (attackHits) {
              const originalDamage = card.damage!;
              let damage = card.damage!;
              let blockedAmount = 0;
              if (target.block > 0) {
                blockedAmount = Math.min(damage, target.block);
                target.block -= blockedAmount;
                damage -= blockedAmount;
              }
              target.hp = Math.max(0, target.hp - damage);
              const logMessage = isRangedVsAdjacent
                ? (blockedAmount > 0
                  ? `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                  : `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} (alcance vs adjacente): 1d6 = ${adjacentRoll!} — acertou! ${originalDamage} dano`)
                : (blockedAmount > 0
                  ? `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name}: ${originalDamage} dano - ${blockedAmount} bloqueio = ${damage} dano`
                  : `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name}: ${originalDamage} dano`);
              newLog.push(createLogEntry(state.turn, state.floor, 'playerAttack', logMessage, {
                attacker: classDef.name,
                target: target.name,
                damage: originalDamage,
                blocked: blockedAmount,
                finalDamage: damage,
              }));
              if (target.hp <= 0) {
                newLog.push(createLogEntry(state.turn, state.floor, 'enemyDefeated', `💀 ${target.emoji} ${target.name} foi derrotado!`, { target: target.name }));
              }
              enemies[targetIndex] = target;
              enemies = enemies.filter(e => e.hp > 0);
            }
          }
        }
      }
    }

    if (card.block) {
      player.block += card.block;
      newLog.push(createLogEntry(state.turn, state.floor, 'playerBlock',
        `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name}: +${card.block} bloqueio (total: ${player.block})`, {
        block: card.block,
      }));
    }

    // Movement handled via completeMovement path; if here and movement card without path, try simple path
    if (card.type === 'movement' && card.movement && state.movementPath.length === 0) {
      if (enemies.length > 0) {
        const targets = enemies.map(e => e.position);
        const path = findPathToClosestTarget(state.hexMap, player.position, targets, getBlockedPositions(player, enemies));
        if (path && path.length > 1) {
          const steps = path.slice(1, 1 + card.movement);
          const finalPos = steps[steps.length - 1];
          player.position = finalPos;
          newLog.push(createLogEntry(state.turn, state.floor, 'playerMove',
            `${classDef.emoji} ${classDef.name} usa carta padrão ${card.name} e se move ${steps.length} para (${finalPos.q}, ${finalPos.r})`, {
            position: finalPos,
          }));
        }
      }
    }

    // Consume energy and mark used
    player.energy = player.energy - card.cost;
    const newDefaultHand = state.defaultHand.map(d => d.card.id === card.id ? { ...d, usedThisTurn: true } : d);

    // Check floor cleared after attacks
    let phase: GamePhase = 'playerTurn';
    if (enemies.length === 0) {
      phase = combatClearPhase(state, enemies.length);
    }

    const playerOutSelected = playerWithMapMonsterLoot(player, state, phase);

    set({
      player: playerOutSelected,
      enemies,
      gameLog: newLog,
      defaultHand: newDefaultHand,
      selectedCard: null,
      selectedCardIsDefault: false,
      phase,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
    });
  },

  endTurn: () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;

    const classDef = CHARACTER_CLASSES[state.player.characterClass];
    const newLog = [...state.gameLog];
    newLog.push(createLogEntry(state.turn, state.floor, 'turnEnd',
      `--- ${classDef.emoji} ${classDef.name} termina o turno ---`));

    // Discard hand
    const discardPile = [...state.discardPile, ...state.hand];

    set({
      hand: [],
      discardPile,
      gameLog: newLog,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
    });

    // Continue to next entity in the turn order
    const nextIndex = state.activeTurnIndex + 1;
    // Fire and forget; async enemy animations happen in _processTurnAt
    get()._processTurnAt(nextIndex);
  },

  advanceFloor: () => {
    const state = get();
    if (state.phase !== 'floorComplete') return;
    if (state.runMap) return;

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
    const energyRegen = getInnateAbilityValue(player.characterClass, 'energyRegen');
    const bonusDraw = getInnateAbilityValue(player.characterClass, 'bonusDraw');

    player.block = 0;
    player.energy = player.maxEnergy + energyRegen; // Extra energy on first turn

    // Log floor advancement
    newLog.push(createLogEntry(1, nextFloor, 'floorStart',
      `🏰 Andar ${nextFloor} - ${classDef.emoji} ${classDef.name} avança`));
    newLog.push(createLogEntry(1, nextFloor, 'turnStart', `=== Turno 1 ===`));

    if (energyRegen > 0) {
      newLog.push(createLogEntry(1, nextFloor, 'innateAbility',
        `✨ Canalização Arcana: +${energyRegen} energia extra`));
    }

    // Create new enemies for the next floor
    const enemies = createFloorEnemies(nextFloor);

    // Burned cards return at the start of a new room: merge into draw pile (deck is unchanged — burned cards were never removed)
    const allCards = [...state.hand, ...state.drawPile, ...state.discardPile, ...state.burnedPile];
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
      burnedPile: [], // Burned cards merged into draw pile for the new room; deck unchanged
      gameLog: newLog,
      rewardCards,
      phase: rewardCards.length > 0 ? 'selectingReward' : 'rollingInitiative',
      turn: 1,
      selectedCard: null,
      validMovePositions: [],
      targetableEnemyIds: [],
      movementPath: [],
      remainingMovement: 0,
      // reset or initialize default hand for the new floor
      defaultHand: (player.characterClass === 'warrior' ? WARRIOR_DEFAULT_CARDS : player.characterClass === 'archer' ? ARCHER_DEFAULT_CARDS : MAGE_DEFAULT_CARDS).map(c => ({
        id: `default_${c.id}`,
        card: { ...c },
        usedThisTurn: false,
      })),
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

    // Collect all cards, shuffle them, and distribute again to form the starting hand
    const allCards = [...state.hand, ...state.drawPile, ...state.discardPile, newCard];
    const shuffledDrawPile = shuffleArray(allCards);

    const bonusDraw = getInnateAbilityValue(state.player.characterClass, 'bonusDraw');
    const cardState = drawCards({
      ...state,
      hand: [],
      drawPile: shuffledDrawPile,
      discardPile: [],
    } as GameState, HAND_SIZE + bonusDraw);

    newLog.push(createLogEntry(state.turn, state.floor, 'cardReward',
      `✨ ${card.name} adicionado ao baralho`));

    const mapRoomsCompleted = state.mapRoomsCompleted + 1;
    const nextPhase: GamePhase =
      state.runMap && mapRoomsCompleted >= MAP_ROOMS_BEFORE_BOSS
        ? 'bossRoomIntro'
        : state.runMap
          ? 'selectingMapNode'
          : 'rollingInitiative';

    const defaultHandReset =
      state.runMap
        ? (state.player.characterClass === 'warrior'
            ? WARRIOR_DEFAULT_CARDS
            : state.player.characterClass === 'archer'
              ? ARCHER_DEFAULT_CARDS
              : MAGE_DEFAULT_CARDS
          ).map((c) => ({
            id: `default_${c.id}`,
            card: { ...c },
            usedThisTurn: false,
          }))
        : state.defaultHand;

    set({
      deck,
      hand: cardState.hand,
      drawPile: cardState.drawPile,
      discardPile: cardState.discardPile,
      rewardCards: [],
      merchantOffers: [],
      gameLog: newLog,
      mapRoomsCompleted: state.runMap ? mapRoomsCompleted : state.mapRoomsCompleted,
      phase: nextPhase,
      defaultHand: defaultHandReset,
    });
  },

  buyMerchantCard: (offerIndex: number) => {
    const state = get();
    if (state.phase !== 'selectingMerchant') return;
    const offer = state.merchantOffers[offerIndex];
    if (!offer) return;

    const price = merchantPriceForRarity(offer.rarity);
    if (state.player.gold < price) return;

    const newLog = [...state.gameLog];
    const player = { ...state.player, gold: state.player.gold - price };
    const newCard = {
      ...offer.card,
      id: `${offer.card.id}_${Date.now()}`,
    };
    const deck = [...state.deck, newCard];
    const allCards = [...state.hand, ...state.drawPile, ...state.discardPile, newCard];
    const shuffledDrawPile = shuffleArray(allCards);

    const bonusDraw = getInnateAbilityValue(state.player.characterClass, 'bonusDraw');
    const cardState = drawCards({
      ...state,
      hand: [],
      drawPile: shuffledDrawPile,
      discardPile: [],
    } as GameState, HAND_SIZE + bonusDraw);

    const merchantOffers = state.merchantOffers.filter((_, i) => i !== offerIndex);

    newLog.push(createLogEntry(state.turn, state.floor, 'cardReward',
      `🛒 ${newCard.name} comprado por ${price} ouro`));

    if (merchantOffers.length === 0 && state.runMap) {
      const mapRoomsCompleted = state.mapRoomsCompleted + 1;
      const nextPhase: GamePhase =
        mapRoomsCompleted >= MAP_ROOMS_BEFORE_BOSS
          ? 'bossRoomIntro'
          : 'selectingMapNode';
      const defaultHandReset =
        (state.player.characterClass === 'warrior'
          ? WARRIOR_DEFAULT_CARDS
          : state.player.characterClass === 'archer'
            ? ARCHER_DEFAULT_CARDS
            : MAGE_DEFAULT_CARDS
        ).map((c) => ({
          id: `default_${c.id}`,
          card: { ...c },
          usedThisTurn: false,
        }));

      set({
        player,
        deck,
        hand: cardState.hand,
        drawPile: cardState.drawPile,
        discardPile: cardState.discardPile,
        merchantOffers: [],
        mapRoomsCompleted,
        phase: nextPhase,
        defaultHand: defaultHandReset,
        gameLog: newLog,
      });
      return;
    }

    set({
      player,
      deck,
      hand: cardState.hand,
      drawPile: cardState.drawPile,
      discardPile: cardState.discardPile,
      merchantOffers,
      gameLog: newLog,
    });
  },

  leaveMerchant: () => {
    const state = get();
    if (state.phase !== 'selectingMerchant' || !state.runMap) return;

    const newLog = [...state.gameLog];
    const mapRoomsCompleted = state.mapRoomsCompleted + 1;
    const nextPhase: GamePhase =
      mapRoomsCompleted >= MAP_ROOMS_BEFORE_BOSS
        ? 'bossRoomIntro'
        : 'selectingMapNode';

    const defaultHandReset =
      (state.player.characterClass === 'warrior'
        ? WARRIOR_DEFAULT_CARDS
        : state.player.characterClass === 'archer'
          ? ARCHER_DEFAULT_CARDS
          : MAGE_DEFAULT_CARDS
      ).map((c) => ({
        id: `default_${c.id}`,
        card: { ...c },
        usedThisTurn: false,
      }));

    set({
      merchantOffers: [],
      mapRoomsCompleted,
      phase: nextPhase,
      defaultHand: defaultHandReset,
      gameLog: newLog,
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
      defaultHand: [],
      runMap: null,
      mapCurrentNodeId: null,
      mapRoomsCompleted: 0,
      mapMonsterCombatsCompleted: 0,
      runCombatKind: 'none',
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
      turnOrder: [],
      activeTurnIndex: 0,
      burnedPile: [],
      cardsToBurn: 0,
      merchantOffers: [],
    });
  },
}));
