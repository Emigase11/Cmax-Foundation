import images from "@/data/aerocabin-images.json";

export const aeroImages = {
  rescue: {
    ...images.rescue,
    alt: "Illustrative flood scene with a family beside a turquoise and orange AeroCabin.",
    caption: "A proposed role in a coordinated flood response.",
    kind: "Illustrative concept",
  },
  daylight: {
    ...images.daylight,
    alt: "Turquoise and orange AeroCabin at the edge of a lake in daylight.",
    caption: "At the water’s edge. Daylight.",
    kind: "Unit photograph",
  },
  dusk: {
    ...images.dusk,
    alt: "AeroCabin beside a dock at the edge of a lake at dusk.",
    caption: "Another perspective. Dusk.",
    kind: "Unit photograph",
  },
  studio: {
    ...images.studio,
    alt: "Studio cutaway view of AeroCabin showing its open cabin and panel construction.",
    caption: "A closer look at the open cabin.",
    kind: "Product illustration",
  },
  unfold: {
    ...images.unfold,
    alt: "Step one illustration showing the AeroCabin laid flat before inflation.",
    caption: "Unfold",
    kind: "Illustrated sequence",
  },
  inflate: {
    ...images.inflate,
    alt: "Step two illustration showing the cabin taking shape during inflation.",
    caption: "Inflate",
    kind: "Illustrated sequence",
  },
  check: {
    ...images.check,
    alt: "Step three illustration showing a person checking an opening on the cabin.",
    caption: "Check",
    kind: "Illustrated sequence",
  },
  flood: {
    ...images.flood,
    alt: "Illustrative view of AeroCabin units in a flooded neighborhood with a family beside one unit.",
    caption: "A concept for continuity in a flood response.",
    kind: "Illustrative concept",
  },
};
export type AeroImage = (typeof aeroImages)[keyof typeof aeroImages];
