/**
 * Builds the background videos that sit behind a heading.
 *
 * A background loop is watched, never listened to, and it plays behind text on
 * a page people came to read. So the audio track goes, the bitrate comes down
 * to what a scrimmed backdrop actually needs, and a poster frame is written for
 * the visitors who never see it move: anyone who asked for reduced motion, and
 * everyone during the first moments while the file loads.
 *
 * Originals in assets/video are never modified. Run with `npm run video:prepare`.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import ffmpeg from "ffmpeg-static";

const videos = [
  {
    source: "assets/video/un-background-source.mp4",
    name: "un-background",
    /** Frame used for the poster and the reduced-motion still, in seconds. */
    posterAt: 2,
  },
];

const run = (args) => execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args]);
const megabytes = async (file) => ((await fs.stat(file)).size / 1024 / 1024).toFixed(2);

await fs.mkdir("public/video", { recursive: true });
await fs.mkdir("public/images/content/stories", { recursive: true });

for (const { source, name, posterAt } of videos) {
  const before = await megabytes(source);

  // H.264 only. Every browser plays it, and VP9 was measured on this footage
  // at more than three times the size for no visible gain under the scrim.
  //
  // CRF 34 with a 600k ceiling is deliberately low for a film and correct for a
  // backdrop: it holds the shape and motion that read through a dark overlay
  // while keeping the whole loop near the weight of a single large photograph.
  const mp4 = `public/video/${name}.mp4`;
  run([
    "-i", source,
    "-an",
    "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
    "-crf", "34", "-maxrate", "600k", "-bufsize", "1200k",
    "-preset", "slow", "-r", "24",
    // Even dimensions for 4:2:0 chroma.
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    // Index at the front, so playback starts without the full download.
    "-movflags", "+faststart",
    mp4,
  ]);

  const poster = `public/images/content/stories/${name}-poster.webp`;
  run(["-i", source, "-ss", String(posterAt), "-frames:v", "1", "-q:v", "80", poster]);

  console.log(
    `${name}: ${before}MB -> ${await megabytes(mp4)}MB, poster ${await megabytes(poster)}MB`,
  );
}
