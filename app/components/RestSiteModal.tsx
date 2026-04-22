"use client";

interface RestSiteModalProps {
  currentHp: number;
  maxHp: number;
  onConfirm: () => void;
}

export function RestSiteModal({
  currentHp,
  maxHp,
  onConfirm,
}: RestSiteModalProps) {
  const heal = Math.min(10, Math.max(0, maxHp - currentHp));
  const after = Math.min(maxHp, currentHp + 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-emerald-600/80 bg-slate-800 p-6 text-center shadow-2xl md:p-8">
        <div className="mb-4 text-4xl">💤</div>
        <h2 className="mb-3 text-2xl font-bold text-emerald-400 md:text-3xl">
          Descanso
        </h2>
        <p className="mb-2 text-base text-slate-300 md:text-lg">
          Descanse para recuperar até <strong>10</strong> de vida (respeitando o
          máximo).
        </p>
        <p className="mb-6 text-sm text-slate-400">
          Você está com <strong>{currentHp}</strong>/{maxHp} HP.
          {heal > 0 ? (
            <>
              {" "}
              Ao confirmar: <strong>+{heal}</strong> HP →{" "}
              <strong>{after}</strong>/{maxHp}.
            </>
          ) : (
            <> Você já está com vida máxima.</>
          )}
        </p>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-emerald-500 px-8 py-3 font-bold text-black transition-colors hover:bg-emerald-400"
        >
          Confirmar descanso
        </button>
      </div>
    </div>
  );
}
