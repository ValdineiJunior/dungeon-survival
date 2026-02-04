'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* Conteúdo principal */}
      <main className="relative z-10 text-center px-4">
        {/* Logo / Título */}
        <div className="mb-8">
          <div className="text-7xl mb-4">⚔️</div>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-wider mb-2">
            Dungeon Survival
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto">
            Um roguelike de cartas inspirado em Slay the Spire e Gloomhaven
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/game"
            className="
              px-12 py-4 
              bg-gradient-to-r from-amber-500 to-amber-600 
              hover:from-amber-400 hover:to-amber-500
              text-black font-bold text-xl
              rounded-lg
              transform transition-all duration-200
              hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30
              glow-pulse
            "
          >
            Iniciar Jogo
          </Link>
          
          <button
            disabled
            className="
              px-8 py-3 
              bg-slate-700/50
              text-slate-400
              rounded-lg
              cursor-not-allowed
            "
          >
            Em breve: Modo Campanha
          </button>
        </div>

        {/* Info cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="text-4xl mb-3">🃏</div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Deck Building</h3>
            <p className="text-slate-400 text-sm">
              Construa seu deck com cartas de ataque, defesa e poderes especiais
            </p>
          </div>
          
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="text-4xl mb-3">⚔️</div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Combate Tático</h3>
            <p className="text-slate-400 text-sm">
              Gerencie sua energia e preveja os ataques dos inimigos
            </p>
          </div>
          
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="text-4xl mb-3">💀</div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Roguelike</h3>
            <p className="text-slate-400 text-sm">
              Cada partida é única - derrota significa recomeçar do zero
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-slate-600 text-sm">
        Versão 0.1.0 - Em desenvolvimento
      </footer>
    </div>
  );
}
