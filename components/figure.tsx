import Image from "next/image";
import { imgSrc, type Figure as FigureData } from "@/lib/content";
import { Tag } from "./ui";

type Props = {
  figure: FigureData;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  captionClassName?: string;
};

/**
 * Documentary figure: image, caption, credit, and an explicit label when the
 * image is a render rather than a documented photograph.
 */
export function Figure({
  figure,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className = "",
  captionClassName = "",
}: Props) {
  const src = imgSrc(figure.image);
  if (!src) return null;
  return (
    <figure className={className}>
      <div className={`frame relative ${aspect}`}>
        <Image
          src={src}
          alt={figure.alt || ""}
          fill
          sizes={sizes}
          preload={priority}
          className="object-cover"
        />
      </div>
      {(figure.caption || figure.credit || figure.illustrative) && (
        <figcaption
          className={`mt-2.5 flex flex-wrap items-start justify-between gap-x-4 gap-y-2 text-[0.9rem] leading-snug text-ink-3 ${captionClassName}`}
        >
          <span className="max-w-[60ch]">
            {figure.caption}
            {figure.credit && (
              <span className="text-ink-3">
                {" "}
                {figure.caption ? "· " : ""}
                {figure.credit}
              </span>
            )}
          </span>
          {figure.illustrative && <Tag tone="muted">Illustrative render</Tag>}
        </figcaption>
      )}
    </figure>
  );
}
