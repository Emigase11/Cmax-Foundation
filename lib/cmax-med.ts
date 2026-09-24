import images from "@/data/cmax-med-images.json";

export const medImages = {
  field: {
    ...images.field,
    alt: "Illustrative field clinic with Cmax Med, beds and medical staff.",
    caption: "Care, closer to where it is needed.",
    kind: "Illustrative concept",
  },
  cutaway: {
    ...images.cutaway,
    alt: "Cutaway of a Cmax Med unit showing beds, privacy curtains and an entrance ramp.",
    caption: "An inside look at a proposed medical layout.",
    kind: "Illustrative concept",
  },
  hospital: {
    ...images.hospital,
    alt: "Illustrative Cmax Med isolation ward outside a hospital, with medical staff beside the entrance.",
    caption: "Additional space alongside existing health facilities.",
    kind: "Illustrative concept",
  },
  camp: {
    ...images.camp,
    alt: "Illustrative aerial view of Cmax Med units arranged in a humanitarian medical camp.",
    caption: "A wider view of a possible medical response.",
    kind: "Illustrative concept",
  },
  modular: {
    ...images.modular,
    alt: "Illustrative rows of connected Cmax Med units configured as a field hospital.",
    caption: "A proposed field hospital configuration.",
    kind: "Illustrative concept",
  },
  interior: {
    ...images.interior,
    alt: "Photograph of the Cmax Med interior, with arrows illustrating airflow through the windows.",
    caption: "Rigid floor, natural light and cross ventilation.",
    kind: "Unit photograph · Cmax System",
  },
};
export type MedImage = (typeof medImages)[keyof typeof medImages];
