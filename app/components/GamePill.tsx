import type { ReactNode } from "react";
import { EnemyIntent } from "@/app/types/game";

/** Shared base for stat and action pills — matches card accent weight (border + shadow). */
export const gamePillBaseClasses =
  "inline-flex min-w-0 items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors sm:text-xs";

/**
 * Accent border + deeper fill + shadow — shared by attack actions and HP (red family).
 */
const attackLikePill =
  "border-red-500 bg-red-700 text-white shadow-md shadow-red-600/30";

/**
 * Same pattern as defend actions — shared by block stat (always; value may be 0).
 */
const defendLikePill =
  "border-blue-500 bg-blue-700 text-white shadow-md shadow-blue-600/30";

/** Matches dice d12 rarity (orange) — range stat always uses this. */
const rangeLikePill =
  "border-orange-500 bg-orange-800 text-white shadow-md shadow-orange-600/30";

/** Matches dice d10 rarity (purple) — initiative always uses this. */
const initiativeLikePill =
  "border-purple-500 bg-purple-800 text-white shadow-md shadow-purple-600/35";

/**
 * Action pills: colors aligned with `Card` type accents —
 * attack (red), defend / skill (blue), move / movement (green), power (buff yellow), debuff (purple).
 */
const actionPillClasses: Record<EnemyIntent, string> = {
  attack: attackLikePill,
  defend: defendLikePill,
  buff: "border-yellow-500 bg-yellow-600 text-slate-900 shadow-md shadow-yellow-500/35",
  debuff:
    "border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-600/30",
  move: "border-green-500 bg-green-700 text-white shadow-md shadow-green-600/30",
};

const inactivePillClass =
  "border-gray-600 bg-gray-600 text-slate-300";

/** HP tiers stay in the attack palette: lighter border, darker fill, red-only shadows. */
function hpPillClass(hp: number, maxHp: number): string {
  if (hp <= 0) return inactivePillClass;
  const pct = (hp / maxHp) * 100;
  if (pct > 50) return attackLikePill;
  if (pct > 25)
    return "border-red-500 bg-red-800 text-white shadow-md shadow-red-800/35";
  return "border-red-600 bg-red-950 text-white shadow-md shadow-red-950/40";
}

function energyPillClass(energy: number): string {
  return energy > 0
    ? "border-amber-500 bg-amber-400 text-slate-900 shadow-md shadow-amber-400/35"
    : inactivePillClass;
}


type GamePillCommon = {
  className?: string;
  /** Optional override; sensible defaults are set per variant when omitted. */
  title?: string;
  shrink?: boolean;
};

export type GamePillProps = GamePillCommon &
  (
    | {
        variant: "action";
        action: EnemyIntent;
        children: ReactNode;
      }
    | {
        variant: "hp";
        hp: number;
        maxHp: number;
        children?: ReactNode;
      }
    | {
        variant: "block";
        block: number;
        children?: ReactNode;
      }
    | {
        variant: "energy";
        energy: number;
        maxEnergy: number;
        children?: ReactNode;
      }
    | {
        variant: "range";
        attackRange: number;
        children?: ReactNode;
      }
    | {
        variant: "initiative";
        rolled: boolean;
        children: ReactNode;
      }
  );

function defaultTitle(props: GamePillProps): string | undefined {
  switch (props.variant) {
    case "hp":
      return `Vida: ${props.hp} de ${props.maxHp}`;
    case "block":
      return `Bloqueio: ${props.block}`;
    case "energy":
      return `Energia: ${props.energy} de ${props.maxEnergy}`;
    case "range":
      return props.attackRange > 1
        ? `Alcance: ${props.attackRange} hexes (ataque à distância)`
        : `Alcance: ${props.attackRange} (corpo a corpo)`;
    case "initiative":
      return props.rolled
        ? `Iniciativa: ${props.children}`
        : "Total da iniciativa (ainda não rolado)";
    default:
      return undefined;
  }
}

function resolveContent(props: GamePillProps): ReactNode {
  switch (props.variant) {
    case "hp":
      return props.children ?? `${props.hp}/${props.maxHp}`;
    case "block":
      return props.children ?? String(props.block);
    case "energy":
      return props.children ?? `${props.energy}/${props.maxEnergy}`;
    case "range":
      return props.children ?? String(props.attackRange);
    default:
      return props.children;
  }
}

function resolveColorClass(props: GamePillProps): string {
  switch (props.variant) {
    case "action":
      return actionPillClasses[props.action];
    case "hp":
      return hpPillClass(props.hp, props.maxHp);
    case "block":
      return defendLikePill;
    case "energy":
      return energyPillClass(props.energy);
    case "range":
      return rangeLikePill;
    case "initiative":
      return initiativeLikePill;
    default:
      return "";
  }
}

export function GamePill(props: GamePillProps) {
  const {
    className = "",
    title: titleProp,
    shrink,
  } = props;
  const colorClass = resolveColorClass(props);
  const content = resolveContent(props);
  const title = titleProp ?? defaultTitle(props);

  return (
    <span
      className={`${gamePillBaseClasses} ${shrink ? "shrink-0 " : ""}${colorClass} ${className}`.trim()}
      title={title}
    >
      {content}
    </span>
  );
}
