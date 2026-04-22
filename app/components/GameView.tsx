"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { Hand } from "@/app/components/Hand";
import { EnemyCard } from "@/app/components/EnemyCard";
import { EnemyCardsContainer } from "@/app/components/EnemyCardsContainer";
import { PlayerStatus } from "@/app/components/PlayerStatus";
import { HexGrid } from "@/app/components/HexGrid";
import { CharacterSelect } from "@/app/components/CharacterSelect";
import { CardListModal } from "@/app/components/CardListModal";
import { CardRewardModal } from "@/app/components/CardRewardModal";
import { EnemyActionsModal } from "@/app/components/EnemyActionsModal";
import { GameLogModal } from "@/app/components/GameLogModal";
import { RunMapModal } from "@/app/components/RunMapModal";
import { SmallDefaultCard } from "@/app/components/SmallDefaultCard";
import { BurnCardModal } from "@/app/components/BurnCardModal";
import {
  InitiativeRollModal,
  InitiativeOrderModal,
} from "@/app/components/InitiativeModals";
import { MiniInitiativeOrderStrip } from "@/app/components/MiniInitiativeOrderStrip";
import { Card, HexPosition, CharacterClass, Enemy } from "@/app/types/game";
import { CHARACTER_CLASSES } from "@/app/lib/cards";
import { getFloorConfig } from "@/app/lib/enemies";

export type GameViewProps = {
  /** When set (e.g. game embedded on `/`), abandoning returns to hub without a full navigation. */
  onExitToHub?: () => void;
};

export default function GameView(props: GameViewProps = {}) {
  const { onExitToHub } = props;
  const router = useRouter();
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDrawPileModal, setShowDrawPileModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showBurnedModal, setShowBurnedModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  // Kept for future debug: EnemyActionsModal. To show it, add onViewActions={() => setSelectedEnemyForActions(enemy)} to EnemyCard
  const [selectedEnemyForActions, setSelectedEnemyForActions] =
    useState<Enemy | null>(null);

  const {
    player,
    hand,
    deck,
    drawPile,
    discardPile,
    burnedPile,
    cardsToBurn,
    enemies,
    hexMap,
    phase,
    turn,
    floor,
    selectedCard,
    validMovePositions,
    targetableEnemyIds,
    movementPath,
    remainingMovement,
    gameLog,
    runMap,
    rewardCards,
    defaultHand,
    selectDefaultCard,
    selectedCardIsDefault,
    selectCharacter,
    startCombat,
    selectCard,
    cancelSelection,
    moveToPosition,
    addHexToMovementPath,
    undoMovementStep,
    completeMovement,
    selectTarget,
    confirmSkill,
    confirmBurnCard,
    endTurn,
    selectRewardCard,
    advanceFloor,
    resetGame,
    rollInitiative,
    confirmInitiativeModal,
    turnOrder,
    activeTurnIndex,
  } = useGameStore();

  const handleCharacterSelect = (characterClass: CharacterClass) => {
    selectCharacter(characterClass);
    startCombat();
  };

  const handleSelectCard = (card: Card) => {
    if (selectedCard?.id === card.id) {
      cancelSelection();
    } else {
      selectCard(card);
    }
  };

  const handleHexClick = (position: HexPosition) => {
    if (phase === "selectingMovement" && selectedCard?.type === "movement") {
      addHexToMovementPath(position);
    }
  };

  const handleEnemyClick = (enemyId: string) => {
    if (phase === "selectingTarget") {
      selectTarget(enemyId);
    }
  };

  const handleRestart = () => {
    resetGame();
  };

  const handleAbandonQuest = () => {
    setShowAbandonModal(false);
    resetGame();
    if (onExitToHub) {
      onExitToHub();
    } else {
      router.push("/");
    }
  };

  // Show character select screen
  if (phase === "characterSelect") {
    return <CharacterSelect onSelect={handleCharacterSelect} />;
  }

  const classDef = CHARACTER_CLASSES[player.characterClass];
  const floorConfig = getFloorConfig(floor);
  const playerInitiativeEntry = turnOrder.find(
    (entry) => entry.id === "player",
  );
  const initiativeDiceFaces = CHARACTER_CLASSES[player.characterClass]
    .initiativeDice ?? [6, 6, 6];

  const getPhaseLabel = () => {
    switch (phase) {
      case "playerTurn":
        return "Seu Turno";
      case "viewingInitiative":
        return "Ordem de turno";
      case "enemyTurn":
        return "Turno Inimigo";
      case "selectingMovement":
        return "Selecione Destino";
      case "selectingTarget":
        return "🎯 Selecione Alvo";
      case "confirmingSkill":
        return "Confirmar Habilidade";
      case "selectingReward":
        return "🎁 Selecione Recompensa";
      case "floorComplete":
        return "🏆 Andar Completo!";
      case "victory":
        return "🎉 Vitória!";
      case "defeat":
        return "💀 Derrota";
      default:
        return phase;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "playerTurn":
        return "bg-green-600 text-white";
      case "viewingInitiative":
        return "bg-slate-600 text-white";
      case "selectingMovement":
        return "bg-blue-600 text-white";
      case "selectingTarget":
        return "bg-yellow-500 text-black";
      case "confirmingSkill":
        return "bg-purple-600 text-white";
      case "selectingReward":
        return "bg-indigo-600 text-white";
      case "floorComplete":
        return "bg-emerald-500 text-white";
      case "victory":
        return "bg-amber-500 text-black";
      case "defeat":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const defaultActionsDisabled =
    phase !== "playerTurn" &&
    phase !== "selectingMovement" &&
    phase !== "selectingTarget" &&
    phase !== "confirmingSkill";

  const isSelectionInstructionPhase =
    phase === "selectingMovement" ||
    phase === "selectingTarget" ||
    phase === "confirmingSkill";

  const activeTurnOrderEntry = turnOrder[activeTurnIndex];
  const enemyResolvingInInitiativeView =
    phase === "viewingInitiative" &&
    activeTurnOrderEntry?.entityType === "enemy";

  const showMiniInitiativeInStatusBar =
    turnOrder.length > 0 &&
    (phase === "playerTurn" ||
      phase === "enemyTurn" ||
      phase === "viewingInitiative");

  const showStatusPhasePill =
    phase !== "enemyTurn" && !enemyResolvingInInitiativeView;

  const pileButtonClass =
    "min-h-9 md:min-h-11 w-full min-w-0 px-2 py-1.5 md:px-1.5 md:py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-[11px] md:text-sm transition-colors flex flex-row items-center justify-center gap-1 md:justify-between md:gap-2 whitespace-nowrap";

  return (
    <div
      className={`
        flex min-h-screen flex-col bg-linear-to-b from-slate-950 via-slate-900 to-slate-950
        max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:min-h-0 max-lg:overflow-hidden
      `}
    >
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-lg bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* Combat area — max-lg: encaixa no viewport; mapa rola por dentro */}
      <main className="relative z-10 mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col overflow-hidden p-3 md:p-4">
        {/* Main layout: PlayerStatus | HexGrid | EnemyCards */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-hidden py-2 md:gap-4 md:py-4 lg:flex-row lg:overflow-visible">
          {/* Mobile: 2 colunas com gap sem estourar 100% (evita w-1/2 + gap > largura) */}
          <div className="grid w-full min-w-0 shrink-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:w-72 lg:shrink-0">
            <div className="min-w-0">
              <PlayerStatus
                player={player}
                deckCount={deck.length}
                discardCount={discardPile.length}
                classDef={classDef}
                initiativeTotal={playerInitiativeEntry?.total}
                onViewDeck={() => setShowDeckModal(true)}
                onViewDiscard={() => setShowDiscardModal(true)}
              />
            </div>

            {/* Inimigos ao lado do status só no mobile */}
            <div className="min-w-0 lg:hidden">
              <div className="flex h-full min-h-0 flex-col gap-3">
                <EnemyCardsContainer>
                  {enemies.map((enemy, index) => {
                    const initiativeEntry = turnOrder.find(
                      (e) => e.id === enemy.id,
                    );
                    return (
                      <EnemyCard
                        key={enemy.id}
                        enemy={enemy}
                        orderNumber={index + 1}
                        isTargetable={targetableEnemyIds.includes(enemy.id)}
                        onClick={() => handleEnemyClick(enemy.id)}
                        phase={phase}
                        initiativeDice={
                          initiativeEntry
                            ? {
                                dice: initiativeEntry.dice,
                                total: initiativeEntry.total,
                                highestDie: initiativeEntry.highestDie,
                                diceFaces: initiativeEntry.diceFaces,
                              }
                            : undefined
                        }
                      />
                    );
                  })}
                </EnemyCardsContainer>

                {enemies.length === 0 &&
                  phase !== "victory" &&
                  phase !== "defeat" &&
                  phase !== "floorComplete" && (
                    <div className="text-slate-500 text-center">
                      Carregando...
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Centro: mapa hex (tamanho fixo em px; área rolável só aqui no mobile) */}
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-auto overscroll-contain rounded-lg border border-slate-600/50 bg-slate-900/30 [-webkit-overflow-scrolling:touch] max-lg:min-h-0">
              <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center p-2 sm:p-3 md:p-4">
                <HexGrid
                  map={hexMap}
                  player={player}
                  playerEmoji={CHARACTER_CLASSES[player.characterClass].emoji}
                  playerImageUrl={
                    CHARACTER_CLASSES[player.characterClass].imageUrl
                  }
                  enemies={enemies}
                  validMovePositions={validMovePositions}
                  targetableEnemyIds={targetableEnemyIds}
                  movementPath={movementPath}
                  onHexClick={handleHexClick}
                  onEnemyClick={handleEnemyClick}
                />
              </div>
            </div>
          </div>

          {/* Right panel - Enemies (for large screens) */}
          <div className="hidden min-h-0 w-72 flex-col gap-3 lg:flex">
            <EnemyCardsContainer>
              {enemies.map((enemy, index) => {
                const initiativeEntry = turnOrder.find(
                  (e) => e.id === enemy.id,
                );
                return (
                  <EnemyCard
                    key={enemy.id}
                    enemy={enemy}
                    orderNumber={index + 1}
                    isTargetable={targetableEnemyIds.includes(enemy.id)}
                    onClick={() => handleEnemyClick(enemy.id)}
                    phase={phase}
                    initiativeDice={
                      initiativeEntry
                        ? {
                            dice: initiativeEntry.dice,
                            total: initiativeEntry.total,
                            highestDie: initiativeEntry.highestDie,
                            diceFaces: initiativeEntry.diceFaces,
                          }
                        : undefined
                    }
                  />
                );
              })}
            </EnemyCardsContainer>

            {enemies.length === 0 &&
              phase !== "victory" &&
              phase !== "defeat" &&
              phase !== "floorComplete" && (
                <div className="text-slate-500 text-center">Carregando...</div>
              )}
          </div>
        </div>

        {/* Floor Complete screen */}
        {phase === "floorComplete" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
            <div className="text-center p-5 md:p-8 bg-slate-800 rounded-2xl border-2 border-emerald-600 shadow-2xl max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">
                Andar {floor} Completo!
              </h2>
              <p className="text-slate-400 text-sm mb-4">{floorConfig.name}</p>
              <p className="text-slate-300 mb-2">
                Você derrotou todos os inimigos deste andar!
              </p>
              <p className="text-amber-400 mb-6">
                Preparado para o próximo desafio?
              </p>
              <div className="bg-slate-900/50 rounded-xl p-4 md:p-4 mb-6">
                <p className="text-slate-400 text-sm mb-2">Próximo andar:</p>
                <p className="text-lg font-bold text-amber-300">
                  {getFloorConfig(floor + 1).name}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {getFloorConfig(floor + 1).description}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 md:px-4 md:py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors"
                >
                  Desistir
                </button>
                <button
                  onClick={advanceFloor}
                  className="px-4 py-2.5 md:px-6 md:py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors"
                >
                  Avançar ao Andar {floor + 1} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End game screen */}
        {(phase === "victory" || phase === "defeat") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
            <div className="text-center p-5 md:p-8 bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl max-w-md">
              <div className="text-6xl mb-4">
                {phase === "victory" ? "🐉" : "💀"}
              </div>
              <h2
                className={`text-4xl font-bold mb-4 ${
                  phase === "victory" ? "text-amber-400" : "text-red-400"
                }`}
              >
                {phase === "victory" ? "Vitória Total!" : "Derrota"}
              </h2>
              <p className="text-slate-300 mb-6">
                {phase === "victory"
                  ? "Você derrotou o Dragão Ancião e conquistou a masmorra!"
                  : "Você foi derrotado... A masmorra cobra seu preço."}
              </p>
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 md:px-6 md:py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Abandon Quest Confirmation Modal */}
        {showAbandonModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30">
            <div className="text-center p-5 md:p-8 bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl max-w-md">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">
                Abandonar Missão?
              </h2>
              <p className="text-slate-300 mb-6">
                Tem certeza que deseja abandonar? Todo o progresso desta batalha
                será perdido.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowAbandonModal(false)}
                  className="px-4 py-2.5 md:px-6 md:py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-colors"
                >
                  Continuar Jogando
                </button>
                <button
                  onClick={handleAbandonQuest}
                  className="px-4 py-2.5 md:px-6 md:py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
                >
                  Abandonar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status ou instruções de seleção — acima da mão, altura fixa (ex-instruções) */}
        <div className="flex h-10 w-full shrink-0 items-stretch justify-center px-0.5 md:px-1">
          <div
            className={`
              flex h-full min-h-0 w-full max-w-full items-center overflow-x-auto overflow-y-hidden rounded-lg border border-slate-600/80 bg-slate-900/70 px-2 py-0 backdrop-blur-sm
              md:px-2 md:py-0.5
              [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            `}
          >
            {isSelectionInstructionPhase ? (
              <>
                {phase === "selectingMovement" && (
                  <div
                    role="region"
                    aria-label="Movimento"
                    className="flex h-full min-h-0 w-full min-w-0 items-center gap-1 overflow-x-auto px-0.5 py-0.5 text-[10px] leading-tight text-blue-200 sm:gap-2 sm:text-sm md:px-2 md:py-1"
                  >
                    <div className="min-w-0 flex-1 rounded-md bg-blue-600/50 px-1 py-0.5 sm:px-2 md:py-1">
                      {remainingMovement > 0 ? (
                        <span>
                          ⬡ Passo {movementPath.length + 1}/
                          {selectedCard?.movement} • Clique em um hexágono verde
                        </span>
                      ) : (
                        <span>
                          ⬡ Movimento completo! Clique em &quot;Confirmar&quot;
                          para aplicar
                        </span>
                      )}
                    </div>
                    {movementPath.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={undoMovementStep}
                          className="shrink-0 rounded-md bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-orange-500 sm:px-2 sm:text-xs"
                        >
                          ↶ Desfazer
                        </button>
                        <button
                          type="button"
                          onClick={completeMovement}
                          className="shrink-0 rounded-md bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-green-500 sm:px-2 sm:text-xs"
                        >
                          ✓ Confirmar
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={cancelSelection}
                      className="ml-auto shrink-0 text-[10px] underline hover:text-white sm:text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {phase === "selectingTarget" && (
                  <div
                    role="region"
                    aria-label="Selecionar alvo"
                    className="flex h-full min-h-0 w-full min-w-0 items-center gap-1 overflow-x-auto px-0.5 py-0.5 text-[10px] leading-tight text-yellow-200 sm:gap-2 sm:text-sm md:px-2 md:py-1"
                    title={
                      selectedCard?.range != null && selectedCard.range > 1
                        ? `Ataque à distância (alcance ${selectedCard.range}). Adjacente: role 1d6 — 1–2 erra, 3–6 acerta.`
                        : undefined
                    }
                  >
                    <span className="min-w-0 flex-1 rounded-md bg-yellow-600/50 px-1 py-0.5 sm:px-2 md:py-1">
                      🎯 Clique em um inimigo para atacar com{" "}
                      <strong>{selectedCard?.name}</strong> (
                      {selectedCard?.damage} dano)
                      {selectedCard?.range != null &&
                        selectedCard.range > 1 && (
                          <span className="text-amber-200/90">
                            {" "}
                            • Ataque à distância (alcance {selectedCard.range}).
                            Se o alvo estiver adjacente: role 1d6 — 1 ou 2 =
                            erra, 3–6 = acerta.
                          </span>
                        )}
                    </span>
                    <button
                      type="button"
                      onClick={cancelSelection}
                      className="ml-auto shrink-0 text-[10px] underline hover:text-white sm:text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {phase === "confirmingSkill" && (
                  <div
                    role="region"
                    aria-label="Confirmar habilidade"
                    className="flex h-full min-h-0 w-full min-w-0 items-center gap-1 overflow-x-auto px-0.5 py-0.5 text-[10px] leading-tight text-cyan-200 sm:gap-2 sm:text-sm md:px-2 md:py-1"
                  >
                    <span className="min-w-0 flex-1 rounded-md bg-cyan-600/50 px-1 py-0.5 sm:px-2 md:py-1">
                      🛡️ Usar <strong>{selectedCard?.name}</strong> (+
                      {selectedCard?.block} bloqueio)?
                    </span>
                    <button
                      type="button"
                      title="Confirmar"
                      onClick={confirmSkill}
                      className="shrink-0 rounded-md bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-black hover:bg-cyan-400 sm:px-2 sm:text-xs"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={cancelSelection}
                      className="ml-auto shrink-0 text-[10px] underline hover:text-white sm:text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="mx-auto flex min-w-max max-w-full items-center justify-center gap-x-2 sm:gap-x-4 text-[11px] leading-tight sm:text-sm"
              >
                <span className="shrink-0 font-bold tracking-wide text-amber-400">
                  <span className="sm:hidden">⬡</span>
                  <span className="hidden sm:inline">⬡ Dungeon Survival</span>
                </span>
                <span className="shrink-0 text-slate-600" aria-hidden>
                  |
                </span>
                <span
                  className="shrink-0 text-slate-300"
                  title={`${floorConfig.name} — andar ${floor} de 4`}
                >
                  <span className="text-slate-500">Andar </span>
                  <span className="font-bold text-amber-400">{floor}/4</span>
                  <span className="ml-1 hidden text-slate-500 md:inline">
                    · {floorConfig.name}
                  </span>
                </span>
                <span className="shrink-0 text-slate-600" aria-hidden>
                  |
                </span>
                <span className="shrink-0 tabular-nums text-slate-400">
                  Turno {turn}
                </span>
                {showMiniInitiativeInStatusBar && (
                  <>
                    <span className="shrink-0 text-slate-600" aria-hidden>
                      |
                    </span>
                    <MiniInitiativeOrderStrip
                      turnOrder={turnOrder}
                      playerCharacterClass={player.characterClass}
                      activeTurnIndex={activeTurnIndex}
                      enemies={enemies}
                    />
                  </>
                )}
                {showStatusPhasePill && (
                  <>
                    <span className="shrink-0 text-slate-600" aria-hidden>
                      |
                    </span>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold sm:text-xs ${getPhaseColor()}`}
                    >
                      {getPhaseLabel()}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mão / iniciativa; barra principal com 5 botões */}
        <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 md:gap-4">
          <div className="flex h-fit min-h-0 w-full min-w-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 px-1 py-0.5 backdrop-blur-sm md:px-1.5 md:py-0.5">
            {phase === "rollingInitiative" ? (
              <InitiativeRollModal
                turn={turn}
                onRoll={rollInitiative}
                diceFaces={initiativeDiceFaces}
              />
            ) : phase === "viewingInitiative" ? (
              <InitiativeOrderModal
                turnOrder={turnOrder}
                turn={turn}
                playerCharacterClass={player.characterClass}
                enemies={enemies}
              />
            ) : (
              <Hand
                cards={hand}
                energy={player.energy}
                selectedCard={selectedCard}
                onSelectCard={handleSelectCard}
                disabled={defaultActionsDisabled}
              />
            )}
          </div>

          <div className="grid w-full min-w-0 grid-cols-5 gap-2">
            <div className="relative flex min-h-9 min-w-0 md:min-h-11 [&>button]:h-full [&>button]:min-h-9 md:[&>button]:min-h-11">
              <button
                type="button"
                title="Menu de ações"
                onClick={() => setShowActionMenu((prev) => !prev)}
                className={`${pileButtonClass} h-full hover:text-white`}
              >
                <span className="flex min-w-0 items-center gap-1 md:gap-2">
                  <span className="text-sm leading-none md:text-sm">☰</span>
                  <span className="hidden md:inline truncate">Menu</span>
                </span>
              </button>

              {showActionMenu && (
                <div className="absolute bottom-full left-0 z-30 mb-2 flex w-44 max-w-[80vw] flex-col gap-1 rounded-lg border border-slate-600/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-start gap-1.5 rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📜</span>
                      <span>Log</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={!runMap}
                    onClick={() => {
                      if (!runMap) return;
                      setShowMapModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-start gap-1.5 rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🗺️</span>
                      <span>Mapa</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAbandonModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-start gap-1.5 rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>❌</span>
                      <span>Abandonar</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDrawPileModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-between rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🗂️</span>
                      <span>Compra</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-800 px-1.5 py-px text-[10px] font-bold tabular-nums">
                      {drawPile.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeckModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-between rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📚</span>
                      <span>Deck</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-800 px-1.5 py-px text-[10px] font-bold tabular-nums">
                      {deck.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDiscardModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-between rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🗑️</span>
                      <span>Descarte</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-800 px-1.5 py-px text-[10px] font-bold tabular-nums">
                      {discardPile.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBurnedModal(true);
                      setShowActionMenu(false);
                    }}
                    className="flex min-h-8 w-full items-center justify-between rounded-lg bg-slate-700 px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🔥</span>
                      <span>Queimadas</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-800 px-1.5 py-px text-[10px] font-bold tabular-nums">
                      {burnedPile.length}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {defaultHand.map((entry) => (
              <div
                key={entry.id}
                className="flex min-h-9 min-w-0 md:min-h-11 [&>button]:h-full [&>button]:min-h-9 md:[&>button]:min-h-11"
              >
                <SmallDefaultCard
                  entry={entry}
                  currentEnergy={player.energy}
                  disabled={defaultActionsDisabled}
                  selected={
                    selectedCard?.id === entry.card.id &&
                    !!selectedCardIsDefault
                  }
                  onClick={() => selectDefaultCard(entry.id)}
                />
              </div>
            ))}

            <div className="flex min-h-9 min-w-0 md:min-h-11">
              <button
                type="button"
                title={
                  phase === "rollingInitiative" || phase === "viewingInitiative"
                    ? "Começar turno"
                    : "Finalizar turno"
                }
                onClick={
                  phase === "viewingInitiative"
                    ? confirmInitiativeModal
                    : endTurn
                }
                disabled={
                  phase !== "playerTurn" && phase !== "viewingInitiative"
                }
                className={`flex h-full w-full min-h-9 flex-col items-center justify-center gap-0 rounded-lg border-2 px-1 py-0.5 text-center text-[9px] font-bold leading-tight sm:text-[10px] md:min-h-11 md:py-1 md:text-xs ${
                  phase === "playerTurn" || phase === "viewingInitiative"
                    ? "border-amber-400 bg-amber-500 text-black hover:bg-amber-400"
                    : "cursor-not-allowed border-gray-500 bg-gray-600 text-gray-400"
                }`}
              >
                <span>
                  {phase === "rollingInitiative" ||
                  phase === "viewingInitiative"
                    ? "Começar"
                    : "Finalizar"}
                </span>
                <span className="opacity-90">turno</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Deck View Modal */}
      {showDeckModal && (
        <CardListModal
          title="📚 Deck Completo"
          cards={deck}
          onClose={() => setShowDeckModal(false)}
          showColors
        />
      )}

      {/* Draw Pile Modal */}
      {showDrawPileModal && (
        <CardListModal
          title="🗂️ Pilha de Compra"
          cards={drawPile}
          onClose={() => setShowDrawPileModal(false)}
        />
      )}

      {/* Discard Pile Modal */}
      {showDiscardModal && (
        <CardListModal
          title="🗑️ Pilha de Descarte"
          cards={discardPile}
          onClose={() => setShowDiscardModal(false)}
        />
      )}

      {/* Burned Pile Modal */}
      {showBurnedModal && (
        <CardListModal
          title="🔥 Cartas Queimadas"
          cards={burnedPile}
          onClose={() => setShowBurnedModal(false)}
        />
      )}

      {/* Initiative panels are rendered inline in the hand area above */}

      {/* Burn Selection Modal */}
      {phase === "selectingBurn" && (
        <BurnCardModal
          hand={hand.filter((c) => c.id !== selectedCard?.id)}
          cardsToBurn={cardsToBurn}
          onConfirm={confirmBurnCard}
          onCancel={cancelSelection}
        />
      )}

      {/* Card Reward Modal */}
      {phase === "selectingReward" && rewardCards.length === 2 && (
        <CardRewardModal
          cards={[rewardCards[0], rewardCards[1]]}
          onSelectCard={selectRewardCard}
        />
      )}

      {/* Enemy Actions Modal */}
      {selectedEnemyForActions && (
        <EnemyActionsModal
          enemyName={selectedEnemyForActions.name}
          enemyEmoji={selectedEnemyForActions.emoji}
          currentActionCard={selectedEnemyForActions.currentActionCard}
          drawPile={selectedEnemyForActions.actionDrawPile}
          discardPile={selectedEnemyForActions.actionDiscardPile}
          onClose={() => setSelectedEnemyForActions(null)}
        />
      )}

      {/* Game Log Modal */}
      {showLogModal && (
        <GameLogModal logs={gameLog} onClose={() => setShowLogModal(false)} />
      )}

      {showMapModal && runMap && (
        <RunMapModal runMap={runMap} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
}
