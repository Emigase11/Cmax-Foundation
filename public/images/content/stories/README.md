# CMAX archival images

These WebP files are derivatives of the user's originals in `assets/imagenes/`.
Run `npm run images:prepare` to regenerate them. Originals are never overwritten;
the script rotates by EXIF and encodes width variants at quality 92. Documentary
images use classical Lanczos resampling, capped at 2x; concepts keep their native
resolution. This does not recover missing detail. `data/image-report.json` records
source sizes, target sizes, generated widths and warnings. No generative edits
have been made to the archival photographs.

Photography is used as archive material. It does not establish the dates, results,
or scale of any particular mission. Captions avoid attributing undocumented
deployments to the Foundation.

`aerocabin-rescue-concept.webp` and `aerocabin-flood-concept.webp` are illustrative
concepts. They must retain the `illustrative: true` label wherever published.

Press logos were not added as endorsements: the image files alone do not establish
the scope of coverage. `meeting-pope-francis.webp` is used on Global Advocacy, not
as a photograph of a United Nations event.
