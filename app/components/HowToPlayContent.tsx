"use client";

import { DiceIcon } from "./DiceIcon";

type HowToPlayContentProps = {
  className?: string;
};

export function HowToPlayContent({ className = "" }: HowToPlayContentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-2">🎯 Objetivo</h3>
        <p className="text-slate-300 text-sm">
          Sobreviva aos 4 andares da masmorra derrotando todos os inimigos em
          cada sala. Use suas cartas estrategicamente para atacar, defender e
          se movimentar pelo mapa hexagonal.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-3">
          🎲 Dados de Iniciativa
        </h3>
        <p className="text-slate-300 text-sm mb-2">
          No início de cada rodada, a ordem de turno é definida pela iniciativa:
          todos rolam dados. Quem tiver o maior total age primeiro. Você escolhe
          quais dos seus dados rolar (pode rolar 1 ou os 2).
        </p>
        <p className="text-slate-400 text-xs mb-2">
          Cada ícone de dado representa um dado com X faces e é chamado de
          &quot;dX&quot; (por exemplo: d6 = dado de 6 faces).
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {([4, 6, 8, 10, 12, 20] as const).map((faces) => (
            <span
              key={faces}
              className="inline-flex items-center gap-1.5 bg-slate-700/60 text-slate-300 text-xs px-1 py-1 rounded-md"
            >
              <DiceIcon faces={faces} size="sm" />d{faces} = {faces} faces
            </span>
          ))}
        </div>
        <div className="bg-slate-700/50 rounded-md md:rounded-lg p-1 md:p-3 border border-slate-600 mb-2">
          <p className="text-slate-200 text-sm font-medium mb-2">
            Seus dados por classe:
          </p>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>
              <span className="text-green-400">Arqueira</span> — d4 + d6 + d8
              (rápido, menos variável)
            </li>
            <li>
              <span className="text-amber-400">Guerreira</span> — d6 + d8 + d10
              (meio-termo)
            </li>
            <li>
              <span className="text-purple-400">Mago</span> — d6 + d12 + d20
              (maior pico, mais aleatório)
            </li>
          </ul>
        </div>
        <p className="text-slate-400 text-xs">
          Cada inimigo rola um ou mais dados de iniciativa; a quantidade e o
          tipo (d4, d6, d8, d12) variam por inimigo. Os ícones nos cards mostram
          o resultado da rodada (quem age primeiro).
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-2">
          🎮 Turno do Jogador
        </h3>
        <p className="text-slate-300 text-sm mb-2">
          No seu turno, você pode jogar cartas gastando energia. Ao terminar,
          clique em &quot;Encerrar Turno&quot; para os inimigos agirem.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-3">
          🃏 Tipos de Cartas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-md md:rounded-lg p-1 md:p-3 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-1">
              <span>⚔️</span>
              <span className="font-bold text-red-400">Ataque</span>
            </div>
            <p className="text-slate-400 text-xs">
              Causa dano aos inimigos no alcance
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-md md:rounded-lg p-1 md:p-3 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <span>🛡️</span>
              <span className="font-bold text-blue-400">Habilidade</span>
            </div>
            <p className="text-slate-400 text-xs">
              Ganha bloqueio para reduzir dano recebido
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-md md:rounded-lg p-1 md:p-3 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-1">
              <span>👟</span>
              <span className="font-bold text-green-400">Movimento</span>
            </div>
            <p className="text-slate-400 text-xs">Move seu personagem pelo mapa</p>
          </div>
          <div className="bg-slate-700/50 rounded-md md:rounded-lg p-1 md:p-3 border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-1">
              <span>✨</span>
              <span className="font-bold text-yellow-400">Poder</span>
            </div>
            <p className="text-slate-400 text-xs">Efeitos especiais e bônus</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-3">
          📊 Ícones e Atributos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span>❤️</span>
            <span className="text-slate-300">Vida (HP)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span>🛡️</span>
            <span className="text-slate-300">Bloqueio</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span>⚡</span>
            <span className="text-slate-300">Energia</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span>🗡️</span>
            <span className="text-slate-300">Dano</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span>🏹</span>
            <span className="text-slate-300">Alcance</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span>⬡</span>
            <span className="text-slate-300">Posição Hex</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-3">
          👺 Intenções dos Inimigos
        </h3>
        <p className="text-slate-300 text-sm mb-3">
          Os inimigos mostram o que pretendem fazer no próximo turno:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span className="text-red-400">⚔️</span>
            <span className="text-slate-300">Vai atacar</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span className="text-blue-400">🛡️</span>
            <span className="text-slate-300">Vai defender</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span className="text-green-400">👟</span>
            <span className="text-slate-300">Vai mover</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span className="text-yellow-400">⬆️</span>
            <span className="text-slate-300">Vai buffar</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/30 rounded-md px-1 py-1">
            <span className="text-purple-400">⬇️</span>
            <span className="text-slate-300">Vai debuffar</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-3">
          🏹 Alcance de Ataque
        </h3>
        <p className="text-slate-300 text-sm mb-3">
          Alguns inimigos podem atacar à distância! Fique atento ao indicador de
          alcance:
        </p>
        <div className="bg-orange-900/20 border border-orange-700/50 rounded-md md:rounded-lg p-1 md:p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400">🏹</span>
            <span className="text-orange-300 font-bold">Alcance</span>
            <span className="text-slate-400 text-sm">
              - Número de hexes que o inimigo pode atacar
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            Inimigos sem indicador de alcance atacam apenas corpo a corpo (1
            hex). Inimigos com 🏹2 ou 🏹3 podem te acertar de longe — cuidado com
            o Dragão Ancião! Ataque à distância contra alvo adjacente: role 1d6 —
            1 ou 2 = erra, 3–6 = acerta.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-3">
          🗺️ Mapa Hexagonal
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-blue-900/30 rounded-md px-1 py-1 border border-blue-800">
            <span className="text-blue-500">⬡</span>
            <span className="text-slate-300">Você</span>
          </div>
          <div className="flex items-center gap-2 bg-red-900/30 rounded-md px-1 py-1 border border-red-800">
            <span className="text-red-500">⬡</span>
            <span className="text-slate-300">Inimigo</span>
          </div>
          <div className="flex items-center gap-2 bg-green-900/30 rounded-md px-1 py-1 border border-green-800">
            <span className="text-green-500">⬡</span>
            <span className="text-slate-300">Movimento válido</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-900/30 rounded-md px-1 py-1 border border-orange-800">
            <span className="text-yellow-400">🎯</span>
            <span className="text-slate-300">Alvo selecionável</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-amber-300 mb-2">💡 Dicas</h3>
        <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
          <li>O bloqueio é resetado no início de cada turno</li>
          <li>Fique atento às intenções dos inimigos para se preparar</li>
          <li>Posicione-se estrategicamente para evitar ataques</li>
          <li>
            Os cards dos inimigos mostram a intenção (ataque, defesa, movimento)
            da rodada
          </li>
          <li>
            Durante a partida, use o botão &quot;📜 Log&quot; na barra de ações
            para ver o histórico
          </li>
        </ul>
      </section>
    </div>
  );
}
