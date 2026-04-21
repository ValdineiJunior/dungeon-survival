"use client";

import { useState, useMemo } from "react";
import GameView from "@/app/components/GameView";
import { getVisibleStoryParts } from "@/app/lib/story";
import { StoryView } from "@/app/hub/components/StoryView";
import { HowToPlayContent } from "@/app/components/HowToPlayContent";

type HubView = "main" | "historia" | "comoJogar" | "hunter" | "loja";

const BACKGROUNDS: Record<HubView, string> = {
  main: "url(/images/hub-main.jpg)",
  historia: "url(/images/hub-main.jpg)",
  comoJogar: "url(/images/hub-main.jpg)",
  hunter: "url(/images/hub-hunter.jpg)",
  loja: "url(/images/hub-loja.jpg)",
};

export default function HomePage() {
  const [inGame, setInGame] = useState(false);
  const [view, setView] = useState<HubView>("main");
  const storyParts = useMemo(() => getVisibleStoryParts(), []);

  const bgImage = BACKGROUNDS[view];

  if (inGame) {
    return <GameView onExitToHub={() => setInGame(false)} />;
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
        <header className="shrink-0 flex items-center justify-center p-3 md:p-4 border-b border-amber-500/30 bg-slate-900/60">
          <button
            type="button"
            onClick={() => setView("main")}
            className="text-xl md:text-2xl font-bold text-amber-400 tracking-wide hover:text-amber-300 transition-colors"
            title="Voltar ao início"
          >
            Dungeon Survival
          </button>
        </header>

        {view === "main" && (
          <main className="flex-1 flex flex-col p-3 md:p-4 lg:p-6 max-w-4xl mx-auto w-full min-h-0 overflow-auto pb-28">
            <div className="flex flex-col items-center gap-6 text-center px-2 py-4 md:py-6">
              <div>
                <div className="text-5xl md:text-6xl mb-3" aria-hidden>
                  ⚔️
                </div>
                <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto">
                  Construa seu deck, enfrente dungeons e lute pela sobrevivência.
                </p>
                <p className="text-slate-400 text-sm md:text-base mt-3 max-w-lg mx-auto">
                  Explore as opções abaixo — em{" "}
                  <span className="text-amber-400 font-semibold">
                    Como Jogar
                  </span>{" "}
                  você encontra as regras da masmorra.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
                <div className="p-4 md:p-5 rounded-xl border border-amber-500/40 bg-slate-900/90 backdrop-blur-sm text-left">
                  <div className="text-3xl mb-2">🃏</div>
                  <h3 className="text-base font-bold text-amber-400 mb-1.5">
                    Deck Building
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Construa seu deck com cartas de ataque, defesa e poderes
                    especiais.
                  </p>
                </div>
                <div className="p-4 md:p-5 rounded-xl border border-amber-500/40 bg-slate-900/90 backdrop-blur-sm text-left">
                  <div className="text-3xl mb-2">⚔️</div>
                  <h3 className="text-base font-bold text-amber-400 mb-1.5">
                    Combate Tático
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Gerencie sua energia e preveja os ataques dos inimigos.
                  </p>
                </div>
                <div className="p-4 md:p-5 rounded-xl border border-amber-500/40 bg-slate-900/90 backdrop-blur-sm text-left md:col-span-1">
                  <div className="text-3xl mb-2">💀</div>
                  <h3 className="text-base font-bold text-amber-400 mb-1.5">
                    Roguelike
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Cada partida é única — derrota significa recomeçar do zero.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="px-6 py-2.5 md:px-8 md:py-3 bg-slate-800/80 border border-slate-600 text-slate-400 rounded-xl cursor-not-allowed text-sm font-semibold"
              >
                Em breve: Modo Campanha
              </button>
            </div>

            <footer className="mt-auto pt-6 text-center text-slate-500 text-xs space-y-1">
              <div>Versão 0.1.0 - Em desenvolvimento</div>
              <div className="text-slate-600">
                🤖 Artes do jogo geradas com IA
              </div>
            </footer>
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

        {view === "hunter" && (
          <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
            <div className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-6 md:p-8 max-w-md text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h2 className="text-2xl font-bold text-amber-400 mb-2">Hunter</h2>
              <p className="text-slate-400 mb-6">
                O responsável pela seleção dos heróis. Em breve você poderá
                conhecer novos aventureiros aqui.
              </p>
              <p className="text-sm text-slate-500">Em breve</p>
            </div>
          </main>
        )}

        {view === "loja" && (
          <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
            <div className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-6 md:p-8 max-w-md text-center">
              <span className="text-6xl mb-4 block">⚔️</span>
              <h2 className="text-2xl font-bold text-amber-400 mb-2">
                Loja de Armas
              </h2>
              <p className="text-slate-400 mb-6">
                Armas e equipamentos para sua jornada na masmorra. Em breve.
              </p>
              <p className="text-sm text-slate-500">Em breve</p>
            </div>
          </main>
        )}

        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-amber-500/30 bg-slate-900/95 backdrop-blur-sm p-2.5 md:p-3 lg:p-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setView("historia")}
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
              onClick={() => setView("comoJogar")}
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
              onClick={() => setView("hunter")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                view === "hunter"
                  ? "border-amber-400 bg-amber-600/40"
                  : "border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-400"
              }`}
            >
              <span className="text-2xl md:text-3xl">🎯</span>
              <span className="font-bold text-amber-400 text-xs md:text-sm text-center leading-tight">
                Hunter
              </span>
            </button>
            <button
              type="button"
              onClick={() => setView("loja")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                view === "loja"
                  ? "border-amber-400 bg-amber-600/40"
                  : "border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-400"
              }`}
            >
              <span className="text-2xl md:text-3xl">⚔️</span>
              <span className="font-bold text-amber-400 text-xs md:text-sm text-center leading-tight">
                Loja de Armas
              </span>
            </button>
            <button
              type="button"
              onClick={() => setInGame(true)}
              className="flex flex-col items-center justify-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 border-amber-500 bg-amber-600/30 hover:bg-amber-500/40 hover:border-amber-400 transition-all hover:scale-[1.02] col-span-2 lg:col-span-1"
            >
              <span className="text-2xl md:text-3xl">🚪</span>
              <span className="font-bold text-amber-300 text-xs md:text-sm text-center leading-tight">
                Iniciar Aventura
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
