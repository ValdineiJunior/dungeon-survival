'use client';

import { DungeonMap, Enemy, Player, Position } from '@/app/types/game';

interface DungeonGridProps {
  map: DungeonMap;
  player: Player;
  enemies: Enemy[];
  validMovePositions: Position[];
  onTileClick: (position: Position) => void;
  selectedPosition?: Position | null;
}

export function DungeonGrid({ 
  map, 
  player, 
  enemies, 
  validMovePositions,
  onTileClick,
  selectedPosition
}: DungeonGridProps) {
  
  // Verificar se uma posição é válida para movimento
  const isValidMove = (x: number, y: number) => {
    return validMovePositions.some(pos => pos.x === x && pos.y === y);
  };

  // Obter o conteúdo de uma célula
  const getCellContent = (x: number, y: number) => {
    // Verificar se é o jogador
    if (player.position.x === x && player.position.y === y) {
      return { emoji: '🧙', type: 'player' as const };
    }
    
    // Verificar se é um inimigo
    const enemy = enemies.find(e => e.position.x === x && e.position.y === y);
    if (enemy) {
      return { emoji: enemy.emoji, type: 'enemy' as const, enemy };
    }
    
    // Célula vazia
    const tile = map.tiles[y]?.[x];
    if (tile?.type === 'wall') {
      return { emoji: '🧱', type: 'wall' as const };
    }
    if (tile?.type === 'obstacle') {
      return { emoji: '🪨', type: 'obstacle' as const };
    }
    
    return { emoji: '', type: 'empty' as const };
  };

  // Determinar cor de fundo da célula (padrão xadrez)
  const getCellBackground = (x: number, y: number, content: ReturnType<typeof getCellContent>) => {
    const isEven = (x + y) % 2 === 0;
    const isValid = isValidMove(x, y);
    const isSelected = selectedPosition?.x === x && selectedPosition?.y === y;
    
    if (isSelected) {
      return 'bg-yellow-500/50 border-yellow-400';
    }
    
    if (isValid) {
      return 'bg-green-500/40 border-green-400 hover:bg-green-400/60 cursor-pointer';
    }
    
    if (content.type === 'player') {
      return isEven ? 'bg-blue-900/50 border-blue-500' : 'bg-blue-800/50 border-blue-500';
    }
    
    if (content.type === 'enemy') {
      return isEven ? 'bg-red-900/50 border-red-500' : 'bg-red-800/50 border-red-500';
    }
    
    if (content.type === 'wall' || content.type === 'obstacle') {
      return 'bg-slate-700 border-slate-600';
    }
    
    // Padrão xadrez para chão
    return isEven 
      ? 'bg-stone-800/80 border-stone-700 hover:bg-stone-700/80' 
      : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/80';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Título */}
      <div className="text-amber-400 font-bold text-lg tracking-wider">
        🏰 Sala da Masmorra
      </div>
      
      {/* Grid do mapa */}
      <div 
        className="inline-grid gap-0 border-4 border-stone-600 rounded-lg overflow-hidden shadow-2xl shadow-black/50"
        style={{
          gridTemplateColumns: `repeat(${map.width}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: map.height }).map((_, y) => (
          Array.from({ length: map.width }).map((_, x) => {
            const content = getCellContent(x, y);
            const bgClass = getCellBackground(x, y, content);
            const isValid = isValidMove(x, y);
            
            return (
              <button
                key={`${x}-${y}`}
                onClick={() => onTileClick({ x, y })}
                disabled={!isValid && content.type === 'empty'}
                className={`
                  w-14 h-14 
                  flex items-center justify-center
                  border
                  ${bgClass}
                  transition-all duration-150
                  text-2xl
                  ${isValid ? 'animate-pulse' : ''}
                `}
                title={content.type !== 'empty' ? `${content.type} (${x}, ${y})` : `(${x}, ${y})`}
              >
                {content.emoji || (isValid ? '•' : '')}
              </button>
            );
          })
        ))}
      </div>
      
      {/* Legenda */}
      <div className="flex gap-4 text-sm text-slate-400">
        <span>🧙 Você</span>
        <span>👺 Inimigo</span>
        <span className="text-green-400">• Movimento válido</span>
      </div>
    </div>
  );
}
