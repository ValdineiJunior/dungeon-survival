'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/app/lib/gameStore';
import { Hand } from '@/app/components/Hand';
import { EnemyCard } from '@/app/components/EnemyCard';
import { PlayerStatus } from '@/app/components/PlayerStatus';
import { HexGrid } from '@/app/components/HexGrid';
import { Card, HexPosition } from '@/app/types/game';

export default function GamePage() {
  const {
    player,
    hand,
    drawPile,
    discardPile,
    enemies,
    hexMap,
    phase,
    turn,
    selectedCard,
    validMovePositions,
    targetableEnemyIds,
    startCombat,
    selectCard,
    cancelSelection,
    moveToPosition,
    selectTarget,
    endTurn,
    resetGame,
  } = useGameStore();

  // Start combat when page loads
  useEffect(() => {
    if (enemies.length === 0 && phase !== 'victory' && phase !== 'defeat') {
      startCombat(['slime', 'goblin']);
    }
  }, [enemies.length, phase, startCombat]);

  const handleSelectCard = (card: Card) => {
    if (selectedCard?.id === card.id) {
      cancelSelection();
    } else {
      selectCard(card);
    }
  };

  const handleHexClick = (position: HexPosition) => {
    if (phase === 'selectingMovement' && selectedCard?.type === 'movement') {
      moveToPosition(position);
    }
  };

  const handleEnemyClick = (enemyId: string) => {
    if (phase === 'selectingTarget') {
      selectTarget(enemyId);
    }
  };

  const handleRestart = () => {
    resetGame();
    startCombat(['slime', 'goblin']);
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'playerTurn': return 'Your turn';
      case 'enemyTurn': return 'Enemy turn';
      case 'selectingMovement': return 'Select destination';
      case 'selectingTarget': return '🎯 Select target';
      case 'victory': return '🎉 Victory!';
      case 'defeat': return '💀 Defeat';
      default: return phase;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'playerTurn': return 'bg-green-600 text-white';
      case 'selectingMovement': return 'bg-blue-600 text-white';
      case 'selectingTarget': return 'bg-yellow-500 text-black';
      case 'victory': return 'bg-amber-500 text-black';
      case 'defeat': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-400 tracking-wider">
            ⬡ Dungeon Survival
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Turn {turn}</span>
            <span className={`px-3 py-1 rounded text-sm font-bold ${getPhaseColor()}`}>
              {getPhaseLabel()}
            </span>
          </div>
        </div>
      </header>

      {/* Combat area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full p-4">
        
        {/* Main layout: Hex Map + Enemies side by side */}
        <div className="flex-1 flex gap-6 py-4">
          {/* Hexagonal Map */}
          <div className="flex-1 flex items-center justify-center">
            <HexGrid
              map={hexMap}
              player={player}
              enemies={enemies}
              validMovePositions={validMovePositions}
              targetableEnemyIds={targetableEnemyIds}
              onHexClick={handleHexClick}
              onEnemyClick={handleEnemyClick}
            />
          </div>
          
          {/* Side panel with enemies */}
          <div className="w-72 flex flex-col gap-4">
            <h3 className="text-amber-400 font-bold text-center">⚔️ Enemies</h3>
            <div className="flex flex-col gap-3">
              {enemies.map((enemy) => (
                <EnemyCard
                  key={enemy.id}
                  enemy={enemy}
                  isTargetable={targetableEnemyIds.includes(enemy.id)}
                  onClick={() => handleEnemyClick(enemy.id)}
                />
              ))}
            </div>
            
            {enemies.length === 0 && phase !== 'victory' && phase !== 'defeat' && (
              <div className="text-slate-500 text-center">Loading...</div>
            )}
          </div>
        </div>

        {/* End game screen */}
        {(phase === 'victory' || phase === 'defeat') && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
            <div className="text-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl">
              <div className="text-6xl mb-4">
                {phase === 'victory' ? '🏆' : '💀'}
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${
                phase === 'victory' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {phase === 'victory' ? 'Victory!' : 'Defeat'}
              </h2>
              <p className="text-slate-300 mb-6">
                {phase === 'victory' 
                  ? 'You defeated all enemies!' 
                  : 'You were defeated...'}
              </p>
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Player status */}
        <div className="mb-4">
          <PlayerStatus
            player={player}
            deckCount={drawPile.length}
            discardCount={discardPile.length}
          />
        </div>

        {/* Selection instructions */}
        {phase === 'selectingMovement' && (
          <div className="mb-2 text-center">
            <span className="px-4 py-2 bg-blue-600/50 rounded-lg text-blue-200">
              ⬡ Click on a green hexagon to move • 
              <button 
                onClick={cancelSelection}
                className="ml-2 underline hover:text-white"
              >
                Cancel
              </button>
            </span>
          </div>
        )}
        
        {phase === 'selectingTarget' && (
          <div className="mb-2 text-center">
            <span className="px-4 py-2 bg-yellow-600/50 rounded-lg text-yellow-200">
              🎯 Click on an enemy to attack with <strong>{selectedCard?.name}</strong> ({selectedCard?.damage} damage) • 
              <button 
                onClick={cancelSelection}
                className="ml-2 underline hover:text-white"
              >
                Cancel
              </button>
            </span>
          </div>
        )}

        {/* Hand of cards */}
        <div className="bg-slate-900/50 rounded-t-3xl border-t border-x border-slate-700 backdrop-blur-sm">
          <Hand
            cards={hand}
            energy={player.energy}
            selectedCard={selectedCard}
            onSelectCard={handleSelectCard}
            disabled={phase !== 'playerTurn' && phase !== 'selectingMovement' && phase !== 'selectingTarget'}
          />
          
          {/* End turn button */}
          <div className="flex justify-center pb-4">
            <button
              onClick={endTurn}
              disabled={phase !== 'playerTurn'}
              className={`
                px-8 py-3 rounded-lg font-bold text-lg
                transition-all duration-200
                ${phase === 'playerTurn'
                  ? 'bg-amber-500 hover:bg-amber-400 text-black hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              End Turn
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
