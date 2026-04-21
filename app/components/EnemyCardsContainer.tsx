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
        flex min-h-0 -mt-2 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-y-contain
        pt-2 pr-0.5 [-webkit-overflow-scrolling:touch]
        max-h-[min(46dvh,19rem)] sm:max-h-[min(48dvh,21rem)]
        lg:max-h-[min(76vh,36rem)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
