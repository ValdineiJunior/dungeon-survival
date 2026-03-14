"use client";

import { useState } from "react";
import type { StoryPart, StoryLine } from "@/app/types/story";

interface StoryViewProps {
  /** Uma ou mais partes da história a exibir (ex: prólogo, capítulo 1) */
  parts: StoryPart[];
  /** Classe CSS opcional no container do scroll */
  className?: string;
}

function StoryLineBlock({ line }: { line: StoryLine }) {
  if (line.type === "narrative") {
    return (
      <p className="text-slate-400 italic text-sm">{line.text}</p>
    );
  }
  return (
    <p className="text-amber-100">
      <strong className="text-amber-400">{line.speaker}:</strong> {line.text}
    </p>
  );
}

function StorySectionImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <figure className="rounded-lg overflow-hidden border border-amber-500/30 bg-slate-800/50">
        <div className="w-full aspect-video flex items-center justify-center text-slate-500 text-sm">
          {alt || "Imagem"}
        </div>
      </figure>
    );
  }
  return (
    <figure className="rounded-lg overflow-hidden border border-amber-500/30 bg-slate-800/50">
      <img
        src={src}
        alt={alt}
        className="w-full aspect-video object-cover"
        onError={() => setFailed(true)}
      />
      {alt && (
        <figcaption className="p-2 text-center text-slate-500 text-xs">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

function StorySectionBlock({
  section,
}: {
  section: StoryPart["sections"][number];
}) {
  return (
    <div className="space-y-4">
      {section.image && (
        <StorySectionImage src={section.image.src} alt={section.image.alt} />
      )}
      <div className="space-y-3">
        {section.content.map((line, i) => (
          <StoryLineBlock key={i} line={line} />
        ))}
      </div>
    </div>
  );
}

export function StoryView({ parts, className = "" }: StoryViewProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {parts.map((part) => (
        <article key={part.id}>
          <h2 className="text-2xl font-bold text-amber-400 border-b border-amber-500/30 pb-2 mb-4">
            {part.title}
          </h2>
          <div className="space-y-8">
            {part.sections.map((section, i) => (
              <StorySectionBlock key={section.id ?? i} section={section} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
