import type { StoryPart, StoryVisibility } from "@/app/types/story";
import { prologo } from "./prologo";

/** Registro de todas as partes da história (prólogo, capítulos futuros, etc.) */
const ALL_PARTS: Record<string, StoryPart> = {
  prologo,
};

/**
 * Retorna as partes da história que o usuário pode ver.
 * Por enquanto retorna apenas o prólogo; depois pode ser controlado por progresso (ex: localStorage, backend).
 */
export function getVisibleStoryParts(visibility?: StoryVisibility): StoryPart[] {
  const visible = visibility ?? { prologo: true };
  return Object.keys(ALL_PARTS)
    .filter((id) => visible[id] !== false)
    .map((id) => ALL_PARTS[id]);
}

/** Retorna uma parte pelo id (para uso direto, ex. só prólogo). */
export function getStoryPart(id: string): StoryPart | undefined {
  return ALL_PARTS[id];
}

export { prologo };
export type { StoryPart, StoryVisibility };
