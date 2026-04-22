"use client";

import { ENEMY_DEFINITIONS } from "@/app/lib/enemies";

interface BossRoomModalProps {
  bossDefinitionId: string;
  onFight: () => void;
}

export function BossRoomModal({
  bossDefinitionId,
  onFight,
}: BossRoomModalProps) {
  const def = ENEMY_DEFINITIONS[bossDefinitionId];
  const name = def?.name ?? bossDefinitionId;
  const emoji = def?.emoji ?? "👹";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-red-700/80 bg-slate-900 p-6 text-center shadow-2xl md:p-8">
        <div className="mb-4 text-6xl">{emoji}</div>
        <h2 className="mb-2 text-2xl font-bold text-red-400 md:text-3xl">
          Sala do chefe
        </h2>
        <p className="mb-6 text-slate-300">
          Você chegou ao confronto final contra <strong>{name}</strong>.
        </p>
        <button
          type="button"
          onClick={onFight}
          className="rounded-lg bg-red-600 px-8 py-3 font-bold text-white transition-colors hover:bg-red-500"
        >
          Lutar com o chefe
        </button>
      </div>
    </div>
  );
}
