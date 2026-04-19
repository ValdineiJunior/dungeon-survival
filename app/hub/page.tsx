"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

export default function HubPage() {
  const [view, setView] = useState<HubView>("main");
  const storyParts = useMemo(() => getVisibleStoryParts(), []);

  const bgImage = BACKGROUNDS[view];

  return (
    <div
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage: bgImage,
      }}
    >
      {/* Overlay escuro para legibilidade */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col min-h-screen overflow-hidden pb-28">
        {/* Header */}
        <header className="shrink-0 flex items-center justify-center p-3 md:p-4 border-b border-amber-500/30 bg-slate-900/60">
          <h1 className="text-xl md:text-2xl font-bold text-amber-400 tracking-wide">
            Dungeon Survival
          </h1>
        </header>

        {/* Conteúdo por view */}
        {view === "main" && (
          <main className="flex-1 flex flex-col p-3 md:p-4 lg:p-6 max-w-4xl mx-auto w-full min-h-0 overflow-auto pb-28">
            <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] gap-3 text-center px-2">
              <p className="text-slate-400">
                Bem-vindo. Explore as opções abaixo — em{" "}
                <span className="text-amber-400 font-semibold">Como Jogar</span>{" "}
                você encontra as regras da masmorra.
              </p>
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

        {/* Navegação fixa na parte de baixo — 5 itens */}
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
            <Link
              href="/game"
              className="flex flex-col items-center justify-center gap-1 md:gap-2 p-2.5 md:p-3 lg:p-4 rounded-xl border-2 border-amber-500 bg-amber-600/30 hover:bg-amber-500/40 hover:border-amber-400 transition-all hover:scale-[1.02] col-span-2 lg:col-span-1"
            >
              <span className="text-2xl md:text-3xl">🚪</span>
              <span className="font-bold text-amber-300 text-xs md:text-sm text-center leading-tight">
                Iniciar Aventura
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
