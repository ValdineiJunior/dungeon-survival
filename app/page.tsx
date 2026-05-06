"use client";

import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
import GameView from "@/app/components/GameView";
import { CharacterSelect } from "@/app/components/CharacterSelect";
import { getVisibleStoryParts } from "@/app/lib/story";
import { StoryView } from "@/app/hub/components/StoryView";
import { HowToPlayContent } from "@/app/components/HowToPlayContent";
import { useGameStore } from "@/app/lib/gameStore";
import { CHARACTER_CLASSES, getClassCards } from "@/app/lib/cards";
import { INITIAL_PLAYER_GOLD } from "@/app/lib/goldEconomy";
import { DiceIcon } from "@/app/components/DiceIcon";
import type { CharacterClass } from "@/app/types/game";

type HubView = "main" | "historia" | "comoJogar";

const BACKGROUNDS: Record<HubView, string> = {
  main: "url(/images/hub-main.jpg)",
  historia: "url(/images/hub-main.jpg)",
  comoJogar: "url(/images/hub-main.jpg)",
};

const DEFAULT_HERO: CharacterClass = "warrior";

export default function HomePage() {
  const [inGame, setInGame] = useState(false);
  const [heroSelectOpen, setHeroSelectOpen] = useState(false);
  const [selectedHero, setSelectedHero] =
    useState<CharacterClass>(DEFAULT_HERO);
  const [view, setView] = useState<HubView>("main");
  const storyParts = useMemo(() => getVisibleStoryParts(), []);

  const selectCharacter = useGameStore((s) => s.selectCharacter);
  const startCombat = useGameStore((s) => s.startCombat);

  const goHubView = useCallback((next: HubView) => {
    setHeroSelectOpen(false);
    setView(next);
  }, []);

  const handlePickHero = useCallback(
    (characterClass: CharacterClass) => {
      selectCharacter(characterClass);
      setSelectedHero(characterClass);
      setHeroSelectOpen(false);
    },
    [selectCharacter],
  );

  const handleStartRun = useCallback(() => {
    selectCharacter(selectedHero);
    startCombat();
    setInGame(true);
  }, [selectedHero, selectCharacter, startCombat]);

  const heroPreview = useMemo(() => {
    const def = CHARACTER_CLASSES[selectedHero];
    const cards = getClassCards(selectedHero);
    const hasRanged = cards.some(
      (c) => c.type === "attack" && (c.range ?? 1) > 1,
    );
    const initiativeDice = def.initiativeDice ?? [6, 6, 6];
    const initiativeRange = `${initiativeDice.length}-${initiativeDice.reduce((a, b) => a + b, 0)}`;
    return {
      def,
      hasRanged,
      initiativeDice,
      initiativeRange,
    };
  }, [selectedHero]);

  const bgImage = BACKGROUNDS[view];

  if (inGame) {
    return (
      <GameView
        onExitToHub={() => {
          setInGame(false);
          setHeroSelectOpen(false);
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage: bgImage,
      }}
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col min-h-screen overflow-hidden pb-28">
        <header className="shrink-0 flex items-center justify-center px-2 py-3 md:px-4 md:py-4 border-b border-amber-500/30 bg-slate-900/60">
          <button
            type="button"
            onClick={() => goHubView("main")}
            className="text-center text-lg font-bold tracking-wide text-amber-400 hover:text-amber-300 transition-colors sm:text-xl md:text-2xl"
            title="Ir à página principal"
          >
            Dungeon Survival
          </button>
        </header>

        {view === "main" && heroSelectOpen && (
          <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-2 py-2 md:px-4 md:py-3 lg:px-6">
            <CharacterSelect variant="embedded" onSelect={handlePickHero} />
          </main>
        )}

        {view === "main" && !heroSelectOpen && (
          <main className="flex-1 flex flex-col p-3 md:p-4 lg:p-6 max-w-4xl mx-auto w-full min-h-0 overflow-auto pb-28">
            <div className="flex flex-col items-center gap-6 text-center px-2 py-4 md:py-6">
              <div>
                <div className="text-5xl md:text-6xl mb-3" aria-hidden>
                  ⚔️
                </div>
                <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto">
                  Construa seu deck, enfrente dungeons e lute pela
                  sobrevivência.
                </p>
              </div>

              <section
                className="w-full max-w-4xl rounded-xl border border-amber-500/40 bg-slate-900/90 p-4 text-left shadow-xl md:p-5"
                aria-label="Resumo do herói e início da partida"
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
                  Start run
                </div>
                <h3 className="text-lg font-bold text-amber-400">
                  Iniciar partida
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Visão geral do herói antes de entrar na masmorra. Este painel
                  poderá exibir mais dados conforme o jogo evoluir.
                </p>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="mx-auto shrink-0 sm:mx-0">
                    <div className="relative h-28 w-28 overflow-hidden rounded-xl border-2 border-amber-500/40 bg-slate-800/80 shadow-inner md:h-32 md:w-32">
                      <Image
                        src={heroPreview.def.imageUrl}
                        alt={heroPreview.def.name}
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-base font-bold text-slate-100">
                        <span aria-hidden>{heroPreview.def.emoji}</span>{" "}
                        {heroPreview.def.name}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">
                        {heroPreview.def.description}
                      </p>
                    </div>

                    <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                      <div className="rounded-lg border border-slate-600/60 bg-slate-800/50 px-3 py-2">
                        <dt className="text-xs text-slate-500">Vida</dt>
                        <dd className="font-semibold tabular-nums text-rose-200">
                          {heroPreview.def.baseHp}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-600/60 bg-slate-800/50 px-3 py-2">
                        <dt className="text-xs text-slate-500">Energia</dt>
                        <dd className="font-semibold tabular-nums text-amber-200">
                          {heroPreview.def.baseEnergy}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-600/60 bg-slate-800/50 px-3 py-2">
                        <dt className="text-xs text-slate-500">Mão base</dt>
                        <dd className="font-semibold tabular-nums text-sky-200">
                          {heroPreview.def.baseHand}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-600/60 bg-slate-800/50 px-3 py-2">
                        <dt className="text-xs text-slate-500">Ouro inicial</dt>
                        <dd className="font-semibold tabular-nums text-yellow-200">
                          {INITIAL_PLAYER_GOLD}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-600/60 bg-slate-800/50 px-3 py-2">
                        <dt className="text-xs text-slate-500">Combate</dt>
                        <dd className="font-semibold text-slate-200">
                          {heroPreview.hasRanged
                            ? "À distância"
                            : "Corpo a corpo"}
                        </dd>
                      </div>
                      <div className="col-span-2 rounded-lg border border-slate-600/60 bg-slate-800/50 px-3 py-2 sm:col-span-2">
                        <dt className="text-xs text-slate-500">Iniciativa</dt>
                        <dd className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs tabular-nums text-slate-400">
                            Soma típica {heroPreview.initiativeRange}
                          </span>
                          <span className="flex flex-wrap items-center gap-1">
                            {heroPreview.initiativeDice.map((faces, i) => (
                              <DiceIcon key={i} faces={faces} size="sm" />
                            ))}
                          </span>
                        </dd>
                      </div>
                    </dl>

                    {heroPreview.def.innateAbilities.length > 0 && (
                      <div className="rounded-lg border border-amber-500/25 bg-slate-950/40 px-3 py-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-amber-400/90">
                          Habilidades inatas
                        </div>
                        <ul className="mt-2 space-y-2">
                          {heroPreview.def.innateAbilities.map((a, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-xs text-slate-300"
                            >
                              <span aria-hidden>{a.emoji}</span>
                              <span>
                                <span className="font-medium text-amber-200/90">
                                  {a.name}
                                </span>
                                <span className="text-slate-500"> — </span>
                                <span className="text-slate-400">
                                  {a.description}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-lg border border-dashed border-slate-600/70 bg-slate-950/30 px-3 py-2">
                      <div className="text-xs font-medium text-slate-500">
                        Informações adicionais
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        Espaço reservado para estatísticas de corrida, progresso
                        e outros detalhes em atualizações futuras.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartRun}
                  className="mt-4 w-full rounded-xl border border-emerald-400/70 bg-emerald-600/80 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition-colors hover:bg-emerald-500/80 sm:w-auto"
                >
                  Entrar na masmorra
                </button>
              </section>
            </div>
          </main>
        )}

        {view === "historia" && (
          <main className="flex-1 flex flex-col p-3 md:p-4 lg:p-6 max-w-4xl mx-auto w-full min-h-0 overflow-hidden">
            <section className="flex-1 min-h-0 flex flex-col rounded-xl border border-amber-500/40 bg-slate-900/90 shadow-2xl overflow-hidden">
              <div className="p-4 md:p-4 lg:p-6 overflow-y-auto flex-1 text-slate-200 pb-24">
                <StoryView parts={storyParts} />
              </div>
            </section>
          </main>
        )}

        {view === "comoJogar" && (
          <main className="flex-1 flex flex-col p-3 md:p-4 lg:p-6 max-w-4xl mx-auto w-full min-h-0 overflow-hidden">
            <section className="flex-1 min-h-0 flex flex-col rounded-xl border border-amber-500/40 bg-slate-900/90 shadow-2xl overflow-hidden">
              <div className="shrink-0 flex items-center gap-3 px-4 py-3 md:px-4 md:pt-4 md:pb-3 border-b border-amber-500/20">
                <span className="text-2xl md:text-3xl" aria-hidden>
                  📖
                </span>
                <h2 className="text-lg md:text-xl font-bold text-amber-400">
                  Como Jogar
                </h2>
              </div>
              <div className="p-4 md:p-4 lg:p-6 overflow-y-auto flex-1 text-slate-200 pb-24">
                <HowToPlayContent />
              </div>
            </section>
          </main>
        )}

        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-amber-500/30 bg-slate-900/95 backdrop-blur-sm p-2.5 md:p-3 lg:p-4">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
            <button
              type="button"
              onClick={() => goHubView("main")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                view === "main" && !heroSelectOpen
                  ? "border-amber-400 bg-amber-600/40"
                  : "border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-400"
              }`}
              title="Página principal — resumo do jogo"
            >
              <span className="text-2xl md:text-3xl" aria-hidden>
                🏠
              </span>
              <span className="font-bold text-amber-400 text-[10px] text-center leading-tight sm:text-xs md:text-sm">
                <span className="hidden sm:inline">Página principal</span>
                <span className="sm:hidden">Início</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => goHubView("historia")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                view === "historia"
                  ? "border-amber-400 bg-amber-600/40"
                  : "border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-400"
              }`}
            >
              <span className="text-2xl md:text-3xl">📜</span>
              <span className="font-bold text-amber-400 text-xs md:text-sm text-center leading-tight">
                História
              </span>
            </button>
            <button
              type="button"
              onClick={() => goHubView("comoJogar")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                view === "comoJogar"
                  ? "border-amber-400 bg-amber-600/40"
                  : "border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-400"
              }`}
            >
              <span className="text-2xl md:text-3xl">📖</span>
              <span className="font-bold text-amber-400 text-xs md:text-sm text-center leading-tight">
                Como Jogar
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                goHubView("main");
                setHeroSelectOpen(true);
              }}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                heroSelectOpen
                  ? "border-amber-400 bg-amber-600/40 hover:border-amber-300 hover:bg-amber-500/50"
                  : "border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 hover:border-slate-500"
              }`}
              title="Escolher classe e entrar na masmorra"
            >
              <span className="text-2xl md:text-3xl" aria-hidden>
                🛡️
              </span>
              <span className="whitespace-nowrap text-center text-[10px] font-bold leading-tight text-amber-400 sm:text-xs md:text-sm">
                Escolher herói
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
