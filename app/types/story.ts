/**
 * Tipos para a história modular do jogo.
 * Permite definir partes da história (prólogo, capítulos) em dados separados,
 * com seções que podem incluir imagens e blocos de diálogo/narração.
 */

/** IDs de heróis com arte em public/heroes */
export type HeroSpeakerId =
  | "warrior"
  | "archer"
  | "mage"
  | "gunner"
  | "dwarf";

/** Falante com avatar (heróis + NPCs em public/characters) */
export type StorySpeakerId = HeroSpeakerId | "host";

/** Uma linha de conteúdo: narração ou fala de personagem */
export type StoryLine =
  | { type: "narrative"; text: string }
  | {
      type: "dialogue";
      /** Nome exibido (ex.: Guerreira, Host) */
      speaker: string;
      /** Define o avatar em StoryView */
      speakerId: StorySpeakerId;
      text: string;
    };

/** Imagem opcional no início de uma seção */
export interface StorySectionImage {
  src: string;
  alt: string;
}

/** Uma seção da história: opcionalmente uma imagem + linhas de texto */
export interface StorySection {
  id?: string;
  /** Imagem exibida antes do conteúdo da seção */
  image?: StorySectionImage;
  /** Linhas de diálogo e narração */
  content: StoryLine[];
}

/** Uma parte da história (ex: prólogo, capítulo 1) */
export interface StoryPart {
  id: string;
  title: string;
  /** Seções em ordem: cada uma pode ter imagem + conteúdo */
  sections: StorySection[];
}

/** Configuração de quais partes estão disponíveis para o usuário (ex: por progresso) */
export interface StoryVisibility {
  [partId: string]: boolean;
}
