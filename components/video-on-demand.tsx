"use client";

import { useState } from "react";
import { PlayIcon } from "./icons";

type Props = {
  url: string;
  title: string;
  context?: string;
  captions?: string | null;
  poster?: string | null;
};

function embedFor(url: string): { kind: "youtube" | "vimeo" | "file"; src: string } {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) {
    return {
      kind: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=en`,
    };
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return { kind: "vimeo", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&texttrack=en` };
  }
  return { kind: "file", src: url };
}

/**
 * Videos never autoplay. The visitor sees the title and context first and
 * chooses to load the player, which also keeps third-party requests out of the
 * initial page load.
 */
export function VideoOnDemand({ url, title, context, captions, poster }: Props) {
  const [playing, setPlaying] = useState(false);
  const embed = embedFor(url);
  const hasCaptions = embed.kind !== "file" || Boolean(captions);

  return (
    <figure>
      <div className="frame relative aspect-video bg-ink text-paper">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex h-full w-full flex-col items-start justify-end p-5 text-left sm:p-7"
            style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            aria-label={`Play video: ${title}`}
          >
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" aria-hidden />
            <span className="relative mb-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange text-ink transition-transform duration-200 ease-out group-hover:scale-105">
              <PlayIcon width={26} height={26} />
            </span>
            <span className="relative title text-[1.25rem] text-paper">{title}</span>
            {context && <span className="relative mt-1 max-w-[55ch] text-[0.95rem] text-paper/85">{context}</span>}
            <span className="relative strip mt-3 text-paper/70">
              Play video · {hasCaptions ? "Subtitles available" : "Subtitles not yet available"}
            </span>
          </button>
        ) : embed.kind === "file" ? (
          <video controls autoPlay playsInline preload="metadata" className="h-full w-full" crossOrigin="anonymous">
            <source src={embed.src} />
            {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
          </video>
        ) : (
          <iframe
            src={embed.src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      {playing && (
        <figcaption className="mt-2.5 text-[0.9rem] text-ink-3">
          {title}
          {context ? ` · ${context}` : ""}
        </figcaption>
      )}
    </figure>
  );
}
