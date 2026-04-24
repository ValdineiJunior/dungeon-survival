import type { RewardRarity } from '@/app/types/game';

export const INITIAL_PLAYER_GOLD = 100;

export const MERCHANT_PRICE_NORMAL = 50;
export const MERCHANT_PRICE_RARE = 75;

export function merchantPriceForRarity(rarity: RewardRarity): number {
  return rarity === 'rare' ? MERCHANT_PRICE_RARE : MERCHANT_PRICE_NORMAL;
}

/** Gold dropped after clearing a map monster room (`floor` = encounter index, 1-based). */
export function mapMonsterGoldLoot(floor: number): number {
  return 20 + 5 * (floor - 1);
}
