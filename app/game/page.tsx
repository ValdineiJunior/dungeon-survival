"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { Hand } from "@/app/components/Hand";
import { EnemyCard } from "@/app/components/EnemyCard";
import { PlayerStatus } from "@/app/components/PlayerStatus";
import { HexGrid } from "@/app/components/HexGrid";
import { CharacterSelect } from "@/app/components/CharacterSelect";
import { CardListModal } from "@/app/components/CardListModal";
import { CardRewardModal } from "@/app/components/CardRewardModal";
import { EnemyActionsModal } from "@/app/components/EnemyActionsModal";
import { GameLogModal } from "@/app/components/GameLogModal";
import { SmallDefaultCard } from "@/app/components/SmallDefaultCard";
import { BurnCardModal } from "@/app/components/BurnCardModal";
import {
  InitiativeRollModal,
  InitiativeOrderModal,
} from "@/app/components/InitiativeModals";
import { Card, HexPosition, CharacterClass, Enemy } from "@/app/types/game";
import { CHARACTER_CLASSES } from "@/app/lib/cards";
import { getFloorConfig } from "@/app/lib/enemies";

export default function GamePage() {
  const router = useRouter();
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDrawPileModal, setShowDrawPileModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showBurnedModal, setShowBurnedModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
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
    resetGame();
    router.push("/");
  };

  // Show character select screen
  if (phase === "characterSelect") {
    return <CharacterSelect onSelect={handleCharacterSelect} />;
  }

  const classDef = CHARACTER_CLASSES[player.characterClass];
  const floorConfig = getFloorConfig(floor);
  const initiativeDiceFaces = CHARACTER_CLASSES[player.characterClass]
    .initiativeDice ?? [6, 6, 6];

  const getPhaseLabel = () => {
    switch (phase) {
      case "playerTurn":
        return "Seu Turno";
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

  const pileButtonClass =
    "min-h-11 w-full min-w-0 px-1 py-2 md:px-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs md:text-sm transition-colors flex flex-row items-center justify-center gap-1 md:justify-between md:gap-2 whitespace-nowrap";

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-lg bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* Combat area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full p-4">
        {/* Main layout: PlayerStatus | HexGrid | EnemyCards */}
        <div className="flex min-w-0 w-full flex-1 flex-col gap-4 py-4 lg:flex-row">
          {/* Mobile: 2 colunas com gap sem estourar 100% (evita w-1/2 + gap > largura) */}
          <div className="grid min-w-0 w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:w-72 lg:shrink-0">
            <div className="min-w-0">
              <PlayerStatus
                player={player}
                deckCount={deck.length}
                discardCount={discardPile.length}
                classDef={classDef}
                onViewDeck={() => setShowDeckModal(true)}
                onViewDiscard={() => setShowDiscardModal(true)}
              />
            </div>

            {/* Inimigos ao lado do status só no mobile */}
            <div className="min-w-0 lg:hidden">
              <div className="flex flex-col gap-3 h-full">
                <div className="flex flex-col gap-3">
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
                </div>

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

          {/* Centro: status em uma linha + mapa hex */}
          <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-2">
            <div
              className="shrink-0 w-full overflow-x-auto rounded-lg border border-slate-600/80 bg-slate-900/70 px-2 py-1.5 backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="status"
              aria-live="polite"
            >
              <div className="flex min-w-max items-center justify-center gap-x-2 sm:gap-x-4 text-[11px] leading-tight sm:text-sm">
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
                <span className="shrink-0 text-slate-600" aria-hidden>
                  |
                </span>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold sm:text-xs ${getPhaseColor()}`}
                >
                  {getPhaseLabel()}
                </span>
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 justify-center">
              <HexGrid
                map={hexMap}
                player={player}
                playerEmoji={CHARACTER_CLASSES[player.characterClass].emoji}
                playerImageUrl={CHARACTER_CLASSES[player.characterClass].imageUrl}
                enemies={enemies}
                validMovePositions={validMovePositions}
                targetableEnemyIds={targetableEnemyIds}
                movementPath={movementPath}
                onHexClick={handleHexClick}
                onEnemyClick={handleEnemyClick}
              />
            </div>
          </div>

          {/* Right panel - Enemies (for large screens) */}
          <div className="w-72 hidden lg:flex flex-col gap-3">
            <div className="flex flex-col gap-3">
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
            </div>

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
            <div className="text-center p-8 bg-slate-800 rounded-2xl border-2 border-emerald-600 shadow-2xl max-w-md">
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
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
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
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors"
                >
                  Desistir
                </button>
                <button
                  onClick={advanceFloor}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors"
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
            <div className="text-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl max-w-md">
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
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Abandon Quest Confirmation Modal */}
        {showAbandonModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30">
            <div className="text-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl max-w-md">
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
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-colors"
                >
                  Continuar Jogando
                </button>
                <button
                  onClick={handleAbandonQuest}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
                >
                  Abandonar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selection instructions - fixed height to prevent layout shift */}
        <div className="h-10 flex items-center justify-center">
          {phase === "selectingMovement" && (
            <div className="px-4 py-2 bg-blue-600/50 rounded-lg text-blue-200 text-sm flex items-center gap-3">
              {remainingMovement > 0 ? (
                <span>
                  ⬡ Passo {movementPath.length + 1}/{selectedCard?.movement} •
                  Clique em um hexágono verde
                </span>
              ) : (
                <span>
                  ⬡ Movimento completo! Clique em &quot;Confirmar&quot; para
                  aplicar
                </span>
              )}
              {movementPath.length > 0 && (
                <>
                  <button
                    onClick={undoMovementStep}
                    className="px-2 py-0.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold text-xs"
                  >
                    ↶ Desfazer
                  </button>
                  <button
                    onClick={completeMovement}
                    className="px-2 py-0.5 bg-green-600 hover:bg-green-500 text-white rounded font-bold text-xs"
                  >
                    ✓ Confirmar
                  </button>
                </>
              )}
              <button
                onClick={cancelSelection}
                className="ml-auto underline hover:text-white text-xs"
              >
                Cancelar
              </button>
            </div>
          )}

          {phase === "selectingTarget" && (
            <span className="px-4 py-2 bg-yellow-600/50 rounded-lg text-yellow-200 text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
              🎯 Clique em um inimigo para atacar com{" "}
              <strong>{selectedCard?.name}</strong> ({selectedCard?.damage}{" "}
              dano)
              {selectedCard?.range != null && selectedCard.range > 1 && (
                <span className="text-amber-200/90 text-xs">
                  • Ataque à distância (alcance {selectedCard.range}). Se o alvo
                  estiver adjacente: role 1d6 — 1 ou 2 = erra, 3–6 = acerta.
                </span>
              )}
              <button
                onClick={cancelSelection}
                className="ml-1 underline hover:text-white"
              >
                Cancelar
              </button>
            </span>
          )}

          {phase === "confirmingSkill" && (
            <span className="px-4 py-2 bg-cyan-600/50 rounded-lg text-cyan-200 text-sm">
              🛡️ Usar <strong>{selectedCard?.name}</strong> (+
              {selectedCard?.block} bloqueio)?
              <button
                onClick={confirmSkill}
                className="ml-2 px-2 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded font-bold"
              >
                Confirmar
              </button>
              <button
                onClick={cancelSelection}
                className="ml-2 underline hover:text-white"
              >
                Cancelar
              </button>
            </span>
          )}
        </div>

        {/* Mão / iniciativa; barra de ações em 2 linhas de 5 colunas */}
        <div className="flex flex-col gap-2 md:gap-4 w-full min-w-0">
          <div className="w-full min-w-0 bg-slate-900/50 rounded-2xl border border-slate-700 backdrop-blur-sm min-h-40 md:min-h-52 flex items-center justify-center px-1">
            {phase === "rollingInitiative" ? (
              <InitiativeRollModal
                turn={turn}
                onRoll={rollInitiative}
                diceFaces={initiativeDiceFaces}
              />
            ) : phase === "viewingInitiative" ? (
              <InitiativeOrderModal turnOrder={turnOrder} turn={turn} />
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

          <div className="flex flex-col gap-2 w-full min-w-0">
            {/* Linha 1: Log | ações padrão (ataque/defesa/movimento) | Começar/Finalizar turno */}
            <div className="grid w-full min-w-0 grid-cols-5 gap-2">
              <div className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11">
                <button
                  type="button"
                  title="Log de batalha"
                  onClick={() => setShowLogModal(true)}
                  className={`${pileButtonClass} h-full min-h-11 hover:text-white`}
                >
                  <span className="flex min-w-0 items-center gap-1 md:gap-2">
                    <span className="text-base leading-none md:text-sm">📜</span>
                    <span className="hidden md:inline truncate">Log</span>
                  </span>
                </button>
              </div>
              {defaultHand.map((entry) => (
                <div
                  key={entry.id}
                  className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11"
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
              <div className="min-h-11 min-w-0 flex">
                <button
                  type="button"
                  title={
                    phase === "rollingInitiative" ||
                    phase === "viewingInitiative"
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
                  className={`flex h-full min-h-11 w-full flex-col items-center justify-center gap-0 rounded-lg border-2 px-0.5 py-1 text-center leading-tight font-bold text-[10px] sm:text-xs ${
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

            {/* Linha 2: Abandonar | Compra | Deck | Descarte | Queimadas */}
            <div className="grid w-full min-w-0 grid-cols-5 gap-2">
              <div className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11">
                <button
                  type="button"
                  title="Abandonar missão"
                  onClick={() => setShowAbandonModal(true)}
                  className={`${pileButtonClass} h-full min-h-11 hover:bg-red-600 hover:text-white`}
                >
                  <span className="flex min-w-0 items-center gap-1 md:gap-2">
                    <span className="text-base leading-none md:text-sm">❌</span>
                    <span className="hidden md:inline truncate">Abandonar</span>
                  </span>
                </button>
              </div>
              <div className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11">
                <button
                  type="button"
                  title="Pilha de compra"
                  onClick={() => setShowDrawPileModal(true)}
                  className={`${pileButtonClass} h-full min-h-11 hover:text-amber-400`}
                >
                  <span className="flex min-w-0 items-center gap-1 md:gap-2">
                    <span className="text-base leading-none md:text-sm">🗂️</span>
                    <span className="hidden md:inline truncate">Compra</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded-full tabular-nums md:px-2">
                    {drawPile.length}
                  </span>
                </button>
              </div>
              <div className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11">
                <button
                  type="button"
                  title="Deck completo"
                  onClick={() => setShowDeckModal(true)}
                  className={`${pileButtonClass} h-full min-h-11 hover:text-amber-400`}
                >
                  <span className="flex min-w-0 items-center gap-1 md:gap-2">
                    <span className="text-base leading-none md:text-sm">📚</span>
                    <span className="hidden md:inline truncate">Deck</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded-full tabular-nums md:px-2">
                    {deck.length}
                  </span>
                </button>
              </div>
              <div className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11">
                <button
                  type="button"
                  title="Descarte"
                  onClick={() => setShowDiscardModal(true)}
                  className={`${pileButtonClass} h-full min-h-11 hover:text-amber-400`}
                >
                  <span className="flex min-w-0 items-center gap-1 md:gap-2">
                    <span className="text-base leading-none md:text-sm">🗑️</span>
                    <span className="hidden md:inline truncate">Descarte</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded-full tabular-nums md:px-2">
                    {discardPile.length}
                  </span>
                </button>
              </div>
              <div className="min-h-11 min-w-0 flex [&>button]:h-full [&>button]:min-h-11">
                <button
                  type="button"
                  title="Cartas queimadas"
                  onClick={() => setShowBurnedModal(true)}
                  className={`${pileButtonClass} h-full min-h-11 hover:text-orange-500`}
                >
                  <span className="flex min-w-0 items-center gap-1 md:gap-2">
                    <span className="text-base leading-none md:text-sm">🔥</span>
                    <span className="hidden md:inline truncate">Queimadas</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded-full tabular-nums text-orange-400 md:px-2">
                    {burnedPile.length}
                  </span>
                </button>
              </div>
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
    </div>
  );
}
