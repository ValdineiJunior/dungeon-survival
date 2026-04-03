/**
 * Avatares de falantes na história.
 * Heróis: public/heroes. Outros: public/characters.
 */

import type { StorySpeakerId } from "@/app/types/story";

export const SPEAKER_AVATAR_SRC: Record<StorySpeakerId, string> = {
  warrior: "/heroes/warrior.png",
  archer: "/heroes/archer.png",
  mage: "/heroes/mage.png",
  gunner: "/heroes/gunner.png",
  dwarf: "/heroes/dwarf.png",
  host: "/characters/host.png",
};

export function getSpeakerAvatarSrc(id: StorySpeakerId): string {
  return SPEAKER_AVATAR_SRC[id];
}
