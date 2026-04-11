"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { HexMap, HexPosition, Enemy, Player } from "@/app/types/game";
import {
  hexToPixel,
  getMapBounds,
  hexKey,
  hexEquals,
} from "@/app/lib/hexUtils";
import { ENEMY_IMAGE_FILES } from "@/app/lib/enemies";

/** Slightly smaller than “fit” so the map doesn’t dominate the center column. */
const HEX_GRID_DISPLAY_SCALE = 1;

interface HexGridProps {
  map: HexMap;
  player: Player;
  playerEmoji: string;
  /** Hero image URL (e.g. from CHARACTER_CLASSES[].imageUrl). If set, shown on the player hex instead of emoji. */
  playerImageUrl?: string;
  enemies: Enemy[];
  validMovePositions: HexPosition[];
  targetableEnemyIds: string[];
  onHexClick: (position: HexPosition) => void;
  onEnemyClick: (enemyId: string) => void;
  movementPath?: HexPosition[]; // Path of hexes selected for current movement
}

export function HexGrid({
  map,
  player,
  playerEmoji,
  playerImageUrl,
  enemies,
  validMovePositions,
  targetableEnemyIds,
  onHexClick,
  onEnemyClick,
  movementPath = [],
}: HexGridProps) {
  /** Position hex hitbox (w-14 = 56px) on grid from hexToPixel; tuned for pointy-top clip-path. */
  const HEX_OFFSET_X = -30;
  const HEX_OFFSET_Y = -33;

  const bounds = getMapBounds(map);
  const width = bounds.maxX - bounds.minX + 4;
  const height = bounds.maxY - bounds.minY + 4;
  const offsetX = -bounds.minX + 0;
  const offsetY = -bounds.minY + 4;

  // Check if position is in the current movement path
  const isInMovementPath = (pos: HexPosition, pathIndex: number) => {
    return movementPath.some(
      (p, index) => hexEquals(p, pos) && index === pathIndex,
    );
  };

  // Get the position in the movement path (for numbering)
  const getPathPosition = (pos: HexPosition): number | null => {
    const index = movementPath.findIndex((p) => hexEquals(p, pos));
    return index >= 0 ? index + 1 : null;
  };

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

  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const computeScale = () => {
      const cw = el.clientWidth;
      if (cw <= 0 || width <= 0 || height <= 0) return;

      const vh =
        typeof window !== "undefined"
          ? (window.visualViewport?.height ?? window.innerHeight)
          : height;
      const horizontalPad = 8;
      const maxDisplayH = vh * 0.52;
      const s =
        Math.min(1, (cw - horizontalPad) / width, maxDisplayH / height) *
        HEX_GRID_DISPLAY_SCALE;
      setScale((prev) => (Math.abs(prev - s) < 0.0005 ? prev : s));
    };

    computeScale();
    const ro = new ResizeObserver(computeScale);
    ro.observe(el);
    window.visualViewport?.addEventListener("resize", computeScale);
    window.addEventListener("orientationchange", computeScale);
    return () => {
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", computeScale);
      window.removeEventListener("orientationchange", computeScale);
    };
  }, [width, height]);

  return (
    <div
      ref={wrapRef}
      className="flex w-full max-w-full min-w-0 flex-col items-center gap-4"
    >
      {/*
        Mapa em pixels fixos: em mobile ultrapassa a tela.
        Viewport “caixa” = largura do pai × fração da altura da tela; escala uniforme.
      */}
      <div
        className="relative mx-auto shrink-0"
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          <div
            className="relative border-4 border-stone-600 rounded-md md:rounded-2xl bg-stone-950/50 overflow-hidden shadow-2xl"
            style={{ width: width + "px", height: height + "px" }}
          >
            {tiles.map((tile) => {
              const pixel = hexToPixel({ q: tile.q, r: tile.r });
              const content = getHexContent({ q: tile.q, r: tile.r });
              const isValid = isValidMove({ q: tile.q, r: tile.r });
              const isPlayer = content.type === "player";
              const isEnemy = content.type === "enemy";
              const isTargetable =
                content.type === "enemy" && content.isTargetable;
              const pathPosition = getPathPosition({ q: tile.q, r: tile.r });
              const isInPath = pathPosition !== null;

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
                    "animate-pulse ring-2 ring-yellow-400 ring-offset-1 ring-offset-stone-900";
                } else {
                  bgColor = "bg-red-900/70";
                  hoverClass = "";
                }
              } else if (isInPath) {
                // Hex is in the movement path
                bgColor = "bg-cyan-600/70";
                hoverClass = "";
                extraClasses = "ring-2 ring-cyan-400";
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
                  disabled={
                    !isValid && !isTargetable && content.type === "empty"
                  }
                  className={`
                absolute
                h-14 w-14
                flex items-center justify-center
                ${bgColor} ${hoverClass} ${extraClasses}
                transition-all duration-150
                text-base
              `}
                  style={{
                    left: pixel.x + offsetX + HEX_OFFSET_X + "px",
                    top: pixel.y + offsetY + HEX_OFFSET_Y + "px",
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                  title={
                    isTargetable
                      ? `🎯 Atacar ${content.enemy?.name}`
                      : isEnemy && content.enemy
                        ? `${content.enemy.name} (#${content.orderNumber})`
                        : isInPath
                          ? `Passo ${pathPosition}`
                          : `(${tile.q}, ${tile.r})`
                  }
                >
                  {isEnemy && content.enemy ? (
                    <span className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[inherit]">
                      {ENEMY_IMAGE_FILES[content.enemy.name] ? (
                        <img
                          src={`/enemies/${ENEMY_IMAGE_FILES[content.enemy.name]}`}
                          alt={content.enemy.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-base">{content.emoji}</span>
                      )}
                      <span
                        className="absolute bottom-2 right-0.5 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-amber-600 bg-amber-400 text-[8px] font-bold text-black shadow-sm"
                        style={{ minWidth: "0.875rem", minHeight: "0.875rem" }}
                      >
                        {content.orderNumber}
                      </span>
                    </span>
                  ) : isPlayer ? (
                    <span className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[inherit]">
                      {playerImageUrl ? (
                        <img
                          src={playerImageUrl}
                          alt="Hero"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-base">{content.emoji}</span>
                      )}
                    </span>
                  ) : isInPath ? (
                    <span className="text-xs font-bold text-cyan-300">
                      {pathPosition}
                    </span>
                  ) : (
                    content.emoji || (isValid ? "•" : "")
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
