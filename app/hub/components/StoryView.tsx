"use client";

import { useState } from "react";
import type { StoryPart, StoryLine, StorySpeakerId } from "@/app/types/story";
import { getSpeakerAvatarSrc } from "@/app/lib/story/speakerAvatars";

interface StoryViewProps {
  parts: StoryPart[];
  className?: string;
}

function DialogueAvatar({ speakerId }: { speakerId: StorySpeakerId }) {
  const [failed, setFailed] = useState(false);
  const src = getSpeakerAvatarSrc(speakerId);
  if (failed) {
    return (
      <div className="shrink-0 w-12 h-12 rounded-md md:rounded-lg border border-amber-500/40 bg-slate-800 flex items-center justify-center text-amber-500/80 text-xs font-bold">
        ?
      </div>
    );
  }
  return (
    <div className="shrink-0 w-12 h-12 rounded-md md:rounded-lg border border-amber-500/40 bg-slate-800 overflow-hidden">
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover object-top scale-[1.18] origin-top"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function StoryLineBlock({ line }: { line: StoryLine }) {
  if (line.type === "narrative") {
    return <p className="text-slate-400 italic text-sm">{line.text}</p>;
  }
  return (
    <div className="flex gap-3 items-start text-amber-100">
      <DialogueAvatar speakerId={line.speakerId} />
      <p className="min-w-0 flex-1 pt-0.5">
        <strong className="text-amber-400">{line.speaker}:</strong> {line.text}
      </p>
    </div>
  );
}

function StorySectionImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <figure className="rounded-md md:rounded-lg overflow-hidden border border-amber-500/30 bg-slate-800/50">
        <div className="w-full aspect-video flex items-center justify-center text-slate-500 text-sm">
          {alt || "Imagem"}
        </div>
      </figure>
    );
  }
  return (
    <figure className="rounded-md md:rounded-lg overflow-hidden border border-amber-500/30 bg-slate-800/50">
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
