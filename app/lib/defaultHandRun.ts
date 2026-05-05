import type {
  Card,
  CharacterClass,
  DefaultHandCard,
  EnhanceableNumericCardField,
  RunDefaultCardEnhancementDeltas,
  RunDefaultCardRole,
} from "@/app/types/game";
import {
  ARCHER_DEFAULT_CARDS,
  MAGE_DEFAULT_CARDS,
  WARRIOR_DEFAULT_CARDS,
} from "@/app/lib/cards";
import { getNumericFieldValue } from "@/app/lib/cardNumericEnhance";

const ENHANCE_FIELDS: EnhanceableNumericCardField[] = [
  "cost",
  "damage",
  "range",
  "block",
  "movement",
];

export function getDefaultCardsForClass(characterClass: CharacterClass): Card[] {
  switch (characterClass) {
    case "warrior":
      return WARRIOR_DEFAULT_CARDS;
    case "archer":
      return ARCHER_DEFAULT_CARDS;
    case "mage":
      return MAGE_DEFAULT_CARDS;
    default:
      return WARRIOR_DEFAULT_CARDS;
  }
}

export function defaultTemplateRoleFromBaseCard(card: Card): RunDefaultCardRole | null {
  if (/_default_attack$/.test(card.id)) return "attack";
  if (/_default_defend$/.test(card.id)) return "defense";
  if (/_default_move$/.test(card.id)) return "movement";
  return null;
}

/** Merge run-wide accumulated deltas into a default template card (per-field from base + delta, floored at 0). */
export function applyRunDeltasToDefaultTemplateCard(
  base: Card,
  deltas: RunDefaultCardEnhancementDeltas,
): Card {
  const role = defaultTemplateRoleFromBaseCard(base);
  if (!role) return { ...base };
  const perRole = deltas[role];
  if (!perRole) return { ...base };
  let card: Card = { ...base };
  for (const field of ENHANCE_FIELDS) {
    const d = perRole[field];
    if (d == null || d === 0 || Number.isNaN(d)) continue;
    const baseVal = getNumericFieldValue(base, field);
    card = { ...card, [field]: Math.max(0, baseVal + d) };
  }
  return card;
}

export function buildDefaultHandFromClass(
  characterClass: CharacterClass,
  deltas: RunDefaultCardEnhancementDeltas,
): DefaultHandCard[] {
  return getDefaultCardsForClass(characterClass).map((c) => ({
    id: `default_${c.id}`,
    card: applyRunDeltasToDefaultTemplateCard(c, deltas),
    usedThisTurn: false,
  }));
}
