"use client";

import { HexMap, HexPosition, Enemy, Player } from "@/app/types/game";
import {
  hexToPixel,
  getMapBounds,
  hexKey,
  hexEquals,
} from "@/app/lib/hexUtils";

interface HexGridProps {
  map: HexMap;
  player: Player;
  playerEmoji: string;
  enemies: Enemy[];
  validMovePositions: HexPosition[];
  targetableEnemyIds: string[];
  onHexClick: (position: HexPosition) => void;
  onEnemyClick: (enemyId: string) => void;
  onViewLog?: () => void;
}

export function HexGrid({
  map,
  player,
  playerEmoji,
  enemies,
  validMovePositions,
  targetableEnemyIds,
  onHexClick,
  onEnemyClick,
  onViewLog,
}: HexGridProps) {
  const bounds = getMapBounds(map);
  const width = bounds.maxX - bounds.minX + 30;
  const height = bounds.maxY - bounds.minY + 30;
  const offsetX = -bounds.minX + 15;
  const offsetY = -bounds.minY + 15;

  // Check if position is valid for movement
  const isValidMove = (pos: HexPosition) => {
    return validMovePositions.some((p) => hexEquals(p, pos));
  };

  // Check if enemy is targetable
  const isEnemyTargetable = (enemyId: string) => {
    return targetableEnemyIds.includes(enemyId);
  };

  // Get content of a hex
  const getHexContent = (pos: HexPosition) => {
    if (hexEquals(player.position, pos)) {
      return { emoji: playerEmoji, type: "player" as const };
    }

    const enemyIndex = enemies.findIndex((e) => hexEquals(e.position, pos));
    if (enemyIndex !== -1) {
      const enemy = enemies[enemyIndex];
      return {
        emoji: enemy.emoji,
        type: "enemy" as const,
        enemy,
        orderNumber: enemyIndex + 1,
        isTargetable: isEnemyTargetable(enemy.id),
      };
    }

    return { emoji: "", type: "empty" as const };
  };

  // Render tiles
  const tiles = Array.from(map.tiles.values());

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Title */}
      <div className="text-amber-400 font-bold text-lg tracking-wider">
        🏰 Sala da Masmorra
      </div>

      {/* Hex map container */}
      <div
        className="relative border-4 border-stone-600 rounded-2xl bg-stone-950/50 overflow-hidden shadow-2xl"
        style={{ width: width + "px", height: height + "px" }}
      >
        {tiles.map((tile) => {
          const pixel = hexToPixel({ q: tile.q, r: tile.r });
          const content = getHexContent({ q: tile.q, r: tile.r });
          const isValid = isValidMove({ q: tile.q, r: tile.r });
          const isPlayer = content.type === "player";
          const isEnemy = content.type === "enemy";
          const isTargetable = content.type === "enemy" && content.isTargetable;

          // Colors based on state
          let bgColor = "bg-stone-800";
          let hoverClass = "hover:bg-stone-700";
          let extraClasses = "";

          if (isPlayer) {
            bgColor = "bg-blue-900/70";
            hoverClass = "";
          } else if (isEnemy) {
            if (isTargetable) {
              bgColor = "bg-orange-700/80";
              hoverClass = "hover:bg-orange-600 cursor-pointer";
              extraClasses =
                "animate-pulse ring-2 ring-yellow-400 ring-offset-2 ring-offset-stone-900";
            } else {
              bgColor = "bg-red-900/70";
              hoverClass = "";
            }
          } else if (isValid) {
            bgColor = "bg-green-700/60";
            hoverClass = "hover:bg-green-600/80 cursor-pointer";
            extraClasses = "animate-pulse";
          }

          const handleClick = () => {
            if (isTargetable && content.enemy) {
              onEnemyClick(content.enemy.id);
            } else {
              onHexClick({ q: tile.q, r: tile.r });
            }
          };

          return (
            <button
              key={hexKey({ q: tile.q, r: tile.r })}
              onClick={handleClick}
              disabled={!isValid && !isTargetable && content.type === "empty"}
              className={`
                absolute
                w-12 h-12
                flex items-center justify-center
                ${bgColor} ${hoverClass} ${extraClasses}
                transition-all duration-150
                text-lg
              `}
              style={{
                left: pixel.x + offsetX - 26 + "px",
                top: pixel.y + offsetY - 26 + "px",
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
              title={
                isTargetable
                  ? `🎯 Atacar ${content.enemy?.name}`
                  : isEnemy && content.enemy
                    ? `${content.enemy.name} (#${content.orderNumber})`
                    : `(${tile.q}, ${tile.r})`
              }
            >
              {isEnemy && content.orderNumber ? (
                <span className="relative">
                  {content.emoji}
                  <span className="absolute -bottom-1 -right-2 w-3.5 h-3.5 flex items-center justify-center bg-amber-400 text-black text-[8px] font-bold rounded-full border border-amber-600">
                    {content.orderNumber}
                  </span>
                </span>
              ) : (
                content.emoji || (isValid ? "•" : "")
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm text-slate-400 items-center">
        <span className="flex items-center gap-1">
          <span className="text-blue-500">⬡</span> Você
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-500">⬡</span> Inimigo
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-500">⬡</span> Movimento válido
        </span>
        {targetableEnemyIds.length > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">🎯</span> Alvo
          </span>
        )}
        {onViewLog && (
          <button
            onClick={onViewLog}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          >
            📜 Log
          </button>
        )}
      </div>
    </div>
  );
}
