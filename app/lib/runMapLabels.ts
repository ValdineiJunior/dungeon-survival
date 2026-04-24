import type { MapRoomLocation, RunMapNode } from '@/app/types/game';

export function runMapLocationLabel(loc: MapRoomLocation): string {
  switch (loc) {
    case 'monster':
      return 'Monstro';
    case 'treasure':
      return 'Tesouro';
    case 'merchant':
      return 'Mercador';
    case 'rest':
      return 'Descanso';
    case 'boss':
      return 'Chefe';
    default:
      return loc;
  }
}

/** Single emoji shown inside each map node (matches location type). */
export function runMapLocationEmoji(loc: MapRoomLocation): string {
  switch (loc) {
    case 'monster':
      return '⚔️';
    case 'treasure':
      return '🎁';
    case 'merchant':
      return '💰';
    case 'rest':
      return '💤';
    case 'boss':
      return '👑';
    default:
      return '❔';
  }
}

/** Accessible title for list / screen readers (emoji + text + coordinates). */
export function runMapNodeChoiceTitle(n: RunMapNode): string {
  const emoji = runMapLocationEmoji(n.location);
  if (n.location === 'boss') {
    return `${emoji} ${runMapLocationLabel('boss')} (andar ${n.floor})`;
  }
  return `${emoji} ${runMapLocationLabel(n.location)} — andar ${n.floor}, col ${n.col}`;
}

/** Glyph drawn inside map circles. */
export function runMapNodeGraphCaption(n: RunMapNode): string {
  return runMapLocationEmoji(n.location);
}
