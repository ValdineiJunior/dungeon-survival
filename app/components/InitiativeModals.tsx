"use client";

import { Fragment, useState } from "react";
import type { CharacterClass, Enemy, InitiativeResult } from "@/app/types/game";
import { DiceIcon } from "@/app/components/DiceIcon";
import { GamePill } from "@/app/components/GamePill";
import { CHARACTER_CLASSES } from "@/app/lib/cards";
import { ENEMY_IMAGE_FILES } from "@/app/lib/enemies";

function initiativePortraitSrc(
  entry: InitiativeResult,
  playerClass: CharacterClass,
): string | null {
  if (entry.entityType === "player") {
    return CHARACTER_CLASSES[playerClass].imageUrl;
  }
  const file = ENEMY_IMAGE_FILES[entry.name];
  return file ? `/enemies/${file}` : null;
}

/** Rótulo de ordem na iniciativa (1º, 2º, 3º em palavras; depois só ordinal numérico). */
function initiativeRankLabel(index: number): string {
  const words = ["Primeiro", "Segundo", "Terceiro"];
  if (index < words.length) return words[index];
  return `${index + 1}º`;
}

/** Mesmo índice que em EnemyCard: posição na lista `enemies` (1, 2, 3…). */
function enemyEncounterOrderNumber(
  entry: InitiativeResult,
  enemies: Enemy[],
): number | null {
  if (entry.entityType !== "enemy") return null;
  const idx = enemies.findIndex((e) => e.id === entry.id);
  return idx >= 0 ? idx + 1 : null;
}

interface InitiativeOrderCardProps {
  entry: InitiativeResult;
  index: number;
  playerCharacterClass: CharacterClass;
  /** Só inimigos: número de ordem no combate (como no EnemyCard), não a posição na iniciativa. */
  enemyEncounterNumber: number | null;
}

function InitiativeOrderCard({
  entry,
  index,
  playerCharacterClass,
  enemyEncounterNumber,
}: InitiativeOrderCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = initiativePortraitSrc(entry, playerCharacterClass);
  const showPortrait = Boolean(src) && !imgFailed;

  const frameClass =
    entry.entityType === "player"
      ? "border-emerald-500/80 bg-linear-to-b from-emerald-950/85 to-slate-950"
      : "border-red-600/70 bg-linear-to-b from-red-950/70 to-slate-950";
  const diceFaces = entry.diceFaces ?? entry.dice.map(() => 6);
  const initiativeRange = `${diceFaces.length}-${diceFaces.reduce((sum, faces) => sum + faces, 0)}`;

  return (
    <div
      className={`
        flex h-[8.75rem] w-[9rem] shrink-0 flex-col rounded-md border-2 p-0.5 shadow-md
        md:h-[10.75rem] md:w-40 md:rounded-lg md:p-1 md:shadow-lg
        ${frameClass}
      `}
    >
      {/* Primeiro / Segundo / Terceiro … acima do retrato */}
      <div className="shrink-0 px-0.5 text-center text-[9px] font-semibold leading-tight text-amber-300 md:text-[10px]">
        {initiativeRankLabel(index)}
      </div>

      {/* Retrato quadrado (como nos cards de inimigo na mesa) + número só nos inimigos (ordem no combate) */}
      <div className="relative mx-auto mt-0.5 h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-md border-2 border-slate-600 bg-slate-800 md:mt-1 md:h-24 md:w-24">
        {showPortrait ? (
          <img
            src={src!}
            alt={entry.name}
            className="h-full w-full object-cover object-top"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl md:text-2xl">
            <span aria-hidden>{entry.emoji}</span>
          </div>
        )}
        {enemyEncounterNumber != null && (
          <span
            className="absolute bottom-0 right-0 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-amber-600 bg-amber-400 text-[10px] font-bold text-black md:h-[18px] md:w-[18px] md:text-[11px]"
            title={`Ordem de turno: ${enemyEncounterNumber}`}
          >
            {enemyEncounterNumber}
          </span>
        )}
      </div>

      <div className="shrink-0 px-0.5 pt-0.5 text-center text-[9px] font-bold leading-tight text-white md:pt-1 md:text-[11px]">
        <span className="line-clamp-2">{entry.name}</span>
      </div>

      <div className="flex min-h-0 shrink-0 flex-wrap items-center justify-center gap-0.5 px-0.5 pb-px pt-px md:gap-1">
        {entry.dice.map((d, di) => {
          const faces = diceFaces[di] ?? 6;
          return (
            <Fragment key={di}>
              {di > 0 && (
                <span
                  className="shrink-0 text-[9px] font-bold text-slate-400 md:text-[10px]"
                  aria-hidden
                >
                  +
                </span>
              )}
              <DiceIcon
                faces={faces}
                value={d}
                size="xs"
                showImage={false}
                highlighted={d === entry.highestDie}
              />
            </Fragment>
          );
        })}
        <span
          className="shrink-0 px-0.5 text-[9px] font-bold text-slate-400 md:text-[10px]"
          aria-hidden
        >
          =
        </span>
        <GamePill
          variant="initiative"
          initiativeRange={initiativeRange}
          total={entry.total}
          shrink
          className="px-1.5 py-px text-[9px] md:text-[10px]"
        />
      </div>
    </div>
  );
}

// ─── Dice Choice Panel (inline, replaces hand area) ─────────────────────────

interface InitiativeRollModalProps {
  onRoll: (selectedDiceIndices: number[]) => void;
  turn: number;
  diceFaces: number[];
}

export function InitiativeRollModal({
  onRoll,
  turn,
  diceFaces,
}: InitiativeRollModalProps) {
  const pool = diceFaces.length > 0 ? diceFaces : [6];
  const [selected, setSelected] = useState<boolean[]>(() =>
    pool.map(() => true),
  );

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const selectedIndices = selected
    .map((v, i) => (v ? i : -1))
    .filter((i) => i >= 0);
  const selectedFaces = selectedIndices.map((i) => pool[i]);
  const canRoll = selectedIndices.length > 0;

  const minTotal = selectedFaces.length;
  const maxTotal =
    selectedFaces.length > 0
      ? selectedFaces.reduce((sum, faces) => sum + faces, 0)
      : 20;
  const initiativeRange = canRoll ? `${minTotal}-${maxTotal}` : "—";
  const desktopRollStatus = canRoll
    ? `Variação de iniciativa ${minTotal} – ${maxTotal}`
    : "Pelo menos um dado deve ser selecionado";

  const handleRoll = () => {
    if (!canRoll) return;
    onRoll(selectedIndices);
  };

  return (
    <div className="flex h-36 w-full max-w-full min-w-0 flex-col gap-0.5 px-1 py-0.5 md:h-44 md:gap-1 md:px-1.5 md:py-1">
      <p className="w-full px-1 text-center text-[10px] leading-tight text-slate-400 sm:text-[11px] md:text-sm">
        Selecione os dados que quer rolar. Clique para marcar/desmarcar.
      </p>

      <div
        className={`
          flex min-h-0 flex-1 w-full min-w-0 flex-row items-center justify-center gap-1.5
          md:gap-4
        `}
      >
        {/* Label — compact row, same vertical band as Hand */}
        <div className="flex shrink-0 flex-row items-center gap-1 text-center md:flex-col md:gap-0">
          <div className="text-base leading-none md:text-2xl">⌛</div>
          <div>
            <div className="text-[10px] font-bold leading-tight text-amber-400 md:text-sm">
              Iniciativa
            </div>
            <div className="text-[9px] text-slate-500 md:text-xs">
              Turno {turn}
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 text-lg text-slate-600 md:block">—</div>

        {/* Pool — one horizontal scroller like the hand */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-0 md:gap-2">
          <div
            className={`
              flex max-w-full flex-nowrap items-center justify-center gap-1 overflow-x-auto py-px
              [-webkit-overflow-scrolling:touch] touch-pan-x sm:gap-2
            `}
          >
            {pool.map((faces, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span
                    className="shrink-0 text-[11px] font-bold text-slate-400 md:text-xs"
                    aria-hidden
                  >
                    +
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`shrink-0 rounded-md border-2 transition-all duration-200 md:rounded-lg ${
                    selected[i]
                      ? "scale-100 border-amber-400 bg-amber-900/30 ring-2 ring-amber-400/50"
                      : "scale-95 border-slate-600 bg-slate-800/50 opacity-50"
                  }`}
                  title={
                    selected[i]
                      ? `d${faces} selecionado (clique para desmarcar)`
                      : `d${faces} (clique para incluir)`
                  }
                >
                  <DiceIcon faces={faces} size="md" />
                </button>
              </Fragment>
            ))}
            <span
              className="shrink-0 px-0.5 text-[11px] font-bold text-slate-400 md:text-xs"
              aria-hidden
            >
              =
            </span>
            <GamePill
              variant="initiative"
              initiativeRange={initiativeRange}
              shrink
              className="w-14 h-12 justify-center"
            />
          </div>
        </div>

        <div className="hidden shrink-0 text-lg text-slate-600 md:block">—</div>

        <button
          type="button"
          onClick={handleRoll}
          disabled={!canRoll}
          title={`Total possível: ${minTotal}–${maxTotal}. Pelo menos 1 dado.`}
          className={`
            group flex shrink-0 flex-col items-center gap-0.5 rounded-md border-2 border-blue-600 bg-blue-900/40 px-2 py-1
            transition-all duration-200 hover:border-blue-400 hover:bg-blue-800/60 hover:shadow-lg hover:shadow-blue-500/20
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
            md:w-64 md:gap-2 md:rounded-xl md:px-5 md:py-3 md:hover:scale-105
          `}
        >
          <div className="text-center text-[10px] font-bold text-blue-300 group-hover:text-white md:text-sm">
            Rolar
          </div>
          <div className="hidden text-center text-[9px] text-slate-400 md:block md:text-[10px]">
            {desktopRollStatus}
          </div>
        </button>
      </div>

      <p className="w-full px-1 text-center text-[9px] leading-tight text-amber-400/80 sm:text-[10px] md:text-xs">
        Menos dados = tende a agir depois. Mais dados = tende a agir primeiro.
      </p>
    </div>
  );
}

// ─── Turn Order Panel (inline, replaces hand area) ───────────────────────────

interface InitiativeOrderModalProps {
  turnOrder: InitiativeResult[];
  turn: number;
  playerCharacterClass: CharacterClass;
  enemies: Enemy[];
}

export function InitiativeOrderModal({
  turnOrder,
  turn,
  playerCharacterClass,
  enemies,
}: InitiativeOrderModalProps) {
  return (
    <div className="flex h-36 min-h-36 w-full max-w-full min-w-0 items-stretch gap-1.5 px-1 md:h-44 md:min-h-44 md:gap-3 md:px-1.5">
      {/* Label */}
      <div className="flex shrink-0 flex-col items-center justify-center text-center">
        <div className="mb-0.5 text-xl md:text-2xl">⚔️</div>
        <div className="text-[10px] font-bold leading-tight text-amber-400 md:text-xs">
          Ordem
        </div>
        <div className="text-[10px] text-slate-500 md:text-xs">T{turn}</div>
      </div>

      {/* Mesma faixa fixa / scroll horizontal que a mão */}
      <div
        className={`
          h-full max-w-full min-h-0 flex-1 overflow-x-auto overflow-y-hidden
          [-webkit-overflow-scrolling:touch] touch-pan-x [scrollbar-width:thin]
          [&::-webkit-scrollbar]:h-1.5
        `}
      >
        <div className="mx-auto flex h-full w-max min-w-0 items-end justify-start gap-1 md:gap-2">
          {turnOrder.map((entry, i) => (
            <InitiativeOrderCard
              key={entry.id}
              entry={entry}
              index={i}
              playerCharacterClass={playerCharacterClass}
              enemyEncounterNumber={enemyEncounterOrderNumber(entry, enemies)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
