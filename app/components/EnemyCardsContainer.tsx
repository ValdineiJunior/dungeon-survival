"use client";

import type { ReactNode } from "react";

interface EnemyCardsContainerProps {
  children: ReactNode;
  className?: string;
}

/** Vertical stack of enemy cards with a max height and vertical scroll. */
export function EnemyCardsContainer({
  children,
  className = "",
}: EnemyCardsContainerProps) {
  return (
    <div
      className={`
        flex min-h-0 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-y-contain
        pt-2 pr-0.5 [-webkit-overflow-scrolling:touch]
        max-h-[min(42dvh,16rem)] sm:max-h-[min(44dvh,18rem)]
        lg:max-h-[min(72vh,32rem)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
