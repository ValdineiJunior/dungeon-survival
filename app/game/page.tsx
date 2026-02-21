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
import { EnemyActionsModal } from "@/app/components/EnemyActionsModal";
import { GameLogModal } from "@/app/components/GameLogModal";
import { HowToPlayModal } from "@/app/components/HowToPlayModal";
import { Card, HexPosition, CharacterClass, Enemy } from "@/app/types/game";
import { CHARACTER_CLASSES } from "@/app/lib/cards";
import { getFloorConfig } from "@/app/lib/enemies";

export default function GamePage() {
  const router = useRouter();
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [selectedEnemyForActions, setSelectedEnemyForActions] =
    useState<Enemy | null>(null);

  const {
    player,
    hand,
    deck,
    drawPile,
    discardPile,
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
    endTurn,
    advanceFloor,
    resetGame,
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

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-lg bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-amber-400 tracking-wider">
              ⬡ Dungeon Survival
            </h1>
            <div className="px-3 py-1 rounded bg-slate-800 border border-slate-600">
              <span className="text-slate-400 text-sm">Andar </span>
              <span className="text-amber-400 font-bold">{floor}/4</span>
              <span className="text-slate-500 text-xs ml-2">
                - {floorConfig.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Turno {turn}</span>
            <span
              className={`px-3 py-1 rounded text-sm font-bold ${getPhaseColor()}`}
            >
              {getPhaseLabel()}
            </span>
            <button
              onClick={() => setShowHowToPlayModal(true)}
              className="px-3 py-1 rounded text-sm font-medium bg-slate-700 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors"
            >
              📖 Como Jogar
            </button>
            <button
              onClick={() => setShowAbandonModal(true)}
              className="px-3 py-1 rounded text-sm font-medium bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
            >
              Abandonar
            </button>
          </div>
        </div>
      </header>

      {/* Combat area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full p-4">
        {/* Main layout: PlayerStatus | HexGrid | EnemyCards */}
        <div className="flex-1 flex gap-4 py-4">
          {/* Left panel - Player Status */}
          <div className="w-72">
            <PlayerStatus
              player={player}
              deckCount={deck.length}
              discardCount={discardPile.length}
              classDef={classDef}
              onViewDeck={() => setShowDeckModal(true)}
              onViewDiscard={() => setShowDiscardModal(true)}
            />
          </div>

          {/* Center - Hexagonal Map */}
          <div className="flex-1 flex items-center justify-center">
            <HexGrid
              map={hexMap}
              player={player}
              playerEmoji={CHARACTER_CLASSES[player.characterClass].emoji}
              enemies={enemies}
              validMovePositions={validMovePositions}
              targetableEnemyIds={targetableEnemyIds}
              movementPath={movementPath}
              onHexClick={handleHexClick}
              onEnemyClick={handleEnemyClick}
              onViewLog={() => setShowLogModal(true)}
            />
          </div>

          {/* Right panel - Enemies */}
          <div className="w-72 flex flex-col gap-3">
            <h3 className="text-amber-400 font-bold text-center">
              ⚔️ Inimigos
            </h3>
            <div className="flex flex-col gap-3">
              {enemies.map((enemy, index) => (
                <EnemyCard
                  key={enemy.id}
                  enemy={enemy}
                  orderNumber={index + 1}
                  isTargetable={targetableEnemyIds.includes(enemy.id)}
                  onClick={() => handleEnemyClick(enemy.id)}
                  onViewActions={() => setSelectedEnemyForActions(enemy)}
                />
              ))}
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
                  ⬡ Passo {movementPath.length + 1}/{selectedCard?.movement} • Clique em um hexágono verde
                </span>
              ) : (
                <span>
                  ⬡ Movimento completo! Clique em &quot;Confirmar&quot; para aplicar
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
            <span className="px-4 py-2 bg-yellow-600/50 rounded-lg text-yellow-200 text-sm">
              🎯 Clique em um inimigo para atacar com{" "}
              <strong>{selectedCard?.name}</strong> ({selectedCard?.damage}{" "}
              dano) •
              <button
                onClick={cancelSelection}
                className="ml-2 underline hover:text-white"
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

        {/* Hand of cards */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-700 backdrop-blur-sm">
          <Hand
            cards={hand}
            energy={player.energy}
            selectedCard={selectedCard}
            onSelectCard={handleSelectCard}
            onEndTurn={endTurn}
            canEndTurn={phase === "playerTurn"}
            disabled={
              phase !== "playerTurn" &&
              phase !== "selectingMovement" &&
              phase !== "selectingTarget" &&
              phase !== "confirmingSkill"
            }
          />
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

      {/* Discard Pile Modal */}
      {showDiscardModal && (
        <CardListModal
          title="🗑️ Pilha de Descarte"
          cards={discardPile}
          onClose={() => setShowDiscardModal(false)}
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

      {/* How To Play Modal */}
      {showHowToPlayModal && (
        <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />
      )}
    </div>
  );
}
