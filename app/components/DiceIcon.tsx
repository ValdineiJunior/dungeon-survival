"use client";

const VALID_FACES = [4, 6, 8, 10, 12, 20] as const;
export type DiceFaces = (typeof VALID_FACES)[number];

/** Rarity-style colors per die type (background + border) */
const DICE_RARITY_COLORS: Record<
  number,
  { bg: string; border: string; valueColor: string }
> = {
  4: {
    bg: "bg-white/90 dark:bg-slate-200/90",
    border: "border-slate-400",
    valueColor: "text-slate-700",
  },
  6: {
    bg: "bg-green-900/50",
    border: "border-green-500/70",
    valueColor: "text-green-300",
  },
  8: {
    bg: "bg-blue-900/50",
    border: "border-blue-500/70",
    valueColor: "text-blue-300",
  },
  10: {
    bg: "bg-purple-900/50",
    border: "border-purple-500/70",
    valueColor: "text-purple-300",
  },
  12: {
    bg: "bg-orange-900/50",
    border: "border-orange-500/70",
    valueColor: "text-orange-300",
  },
  20: {
    bg: "bg-amber-900/50",
    border: "border-amber-400/70",
    valueColor: "text-amber-300",
  },
};

function diceImageSrc(faces: number): string {
  if (VALID_FACES.includes(faces as DiceFaces)) {
    return `/dice/dice-d${faces}.svg`;
  }
  return "/dice/dice-d6.svg";
}

function getRarityClasses(faces: number) {
  return DICE_RARITY_COLORS[faces] ?? DICE_RARITY_COLORS[6];
}

interface DiceIconProps {
  /** Number of faces (4, 6, 8, 10, 12, 20) */
  faces: number;
  /** Optional rolled value to show on or next to the die */
  value?: number;
  /** Size in pixels or Tailwind class (e.g. "w-8 h-8") */
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Highlight (e.g. for highest die) */
  highlighted?: boolean;
}

const sizeClasses = {
  /** Inline-emoji scale (~15–16px) for compact rows (e.g. h-6) */
  xs: "h-3.5 w-3.5",
  /** No mobile (< sm) menor que o sm padrão para colunas estreitas */
  sm: "h-4 w-4 sm:h-5 sm:w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const paddingBySize = {
  xs: "p-0",
  sm: "p-0.5",
  md: "p-1",
  lg: "p-1.5",
};

const borderBySize = {
  xs: "border",
  sm: "border-2",
  md: "border-2",
  lg: "border-2",
};

const roundedBySize = {
  xs: "rounded-sm",
  sm: "rounded-md",
  md: "rounded-md",
  lg: "rounded-md",
};

export function DiceIcon({
  faces,
  value,
  size = "md",
  className = "",
  highlighted = false,
}: DiceIconProps) {
  const src = diceImageSrc(faces);
  const sizeClass = sizeClasses[size];
  const padding = paddingBySize[size];
  const borderClass = borderBySize[size];
  const roundedClass = roundedBySize[size];
  const rarity = getRarityClasses(faces);

  return (
    <div
      className={`relative shrink-0 flex flex-col items-center justify-center gap-0 ${roundedClass} ${borderClass} ${rarity.bg} ${highlighted ? "border-amber-400" : rarity.border} ${padding} ${className}`}
      title={value != null ? `d${faces} = ${value}` : `d${faces}`}
    >
      <img
        src={src}
        alt={`d${faces}`}
        className={`${sizeClass} object-contain ${highlighted ? "opacity-100" : "opacity-95"}`}
      />
      {value != null && (
        <span
          className={`font-mono font-bold leading-none ${size === "xs" ? "text-[8px]" : "text-[10px] leading-tight"} ${rarity.valueColor} ${highlighted ? "text-amber-300" : ""}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
