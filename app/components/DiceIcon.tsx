"use client";

const VALID_FACES = [4, 6, 8, 10, 12, 20] as const;
export type DiceFaces = (typeof VALID_FACES)[number];

function diceImageSrc(faces: number): string {
  if (VALID_FACES.includes(faces as DiceFaces)) {
    return `/dice/dice-d${faces}.svg`;
  }
  return "/dice/dice-d6.svg";
}

interface DiceIconProps {
  /** Number of faces (4, 6, 8, 10, 12, 20) */
  faces: number;
  /** Optional rolled value to show on or next to the die */
  value?: number;
  /** Size in pixels or Tailwind class (e.g. "w-8 h-8") */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Highlight (e.g. for highest die) */
  highlighted?: boolean;
}

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-10 h-10",
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

  return (
    <div
      className={`relative shrink-0 flex flex-col items-center gap-0 ${className}`}
      title={value != null ? `d${faces} = ${value}` : `d${faces}`}
    >
      <img
        src={src}
        alt={`d${faces}`}
        className={`${sizeClass} object-contain ${highlighted ? "opacity-100 ring-2 ring-amber-400 rounded" : "opacity-90"}`}
      />
      {value != null && (
        <span
          className={`text-[10px] font-mono font-bold leading-tight ${
            highlighted ? "text-amber-300" : "text-slate-300"
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
