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
        pr-0.5 [-webkit-overflow-scrolling:touch]
        max-h-[min(50dvh,20rem)] sm:max-h-[min(52dvh,22rem)]
        lg:max-h-[min(85vh,42rem)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
