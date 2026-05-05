import type { Card, EnhanceableNumericCardField } from "@/app/types/game";

export function getNumericFieldValue(
  card: Card,
  field: EnhanceableNumericCardField,
): number {
  const v = card[field];
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return v;
}

/**
 * Applies a single delta to one numeric field. Result is never negative.
 * Use for temporary run effects, debuffs, etc. (delta may be negative.)
 */
export function applyCardNumericEnhancement(
  card: Card,
  field: EnhanceableNumericCardField,
  delta: number,
): Card {
  if (delta === 0 || Number.isNaN(delta)) return { ...card };
  const start = getNumericFieldValue(card, field);
  return { ...card, [field]: Math.max(0, start + delta) };
}
