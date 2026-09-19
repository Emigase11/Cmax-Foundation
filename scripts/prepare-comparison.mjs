/**
 * Builds the folded / unfolded comparison pair.
 *
 * The two studio originals were shot at different distances and framings, so
 * dropping them into one box makes the unit jump in size and position. A Cmax
 * Med unit is the same height folded or open (220 cm), so this script registers
 * both shots on that shared fact: it measures each unit, scales them to an
 * identical height, stands them on the same floor line, centres both doors on
 * the same axis and normalises the studio background so the two frames carry
 * the same tone.
 *
 * Originals are never modified. Run with `npm run comparison:prepare`.
 */
import fs from "node:fs/promises";
import sharp from "sharp";

const SOURCE_DIR = "public/images/content/solutions";
const OUT_DIR = "public/images/content/solutions";

/** Output frame. 2:1 matches the stage, and holds the open unit with margin. */
const CANVAS = { width: 2400, height: 1200 };
/** Shared geometry, in canvas pixels. */
const UNIT_HEIGHT = 950;
const FLOOR_Y = 1090;
const DOOR_X = CANVAS.width / 2;
/** Every frame is levelled to this studio tone so the two never differ. */
const TARGET_BACKGROUND = { r: 242, g: 242, b: 243 };

const SOURCES = [
  { file: "cmaxmed-folded-front-studio.png", name: "cmaxmed-comparison-folded" },
  {
    file: "cmaxmed-unfolded-front-studio.png",
    name: "cmaxmed-comparison-unfolded",
  },
];

/**
 * Measures one studio shot: the studio background tone, the unit's body, the
 * floor line it stands on, and the horizontal centre of the red door module.
 *
 * The door is found by red density rather than by the bounding box, because the
 * thin red seams that run along the fabric would otherwise drag the centre out.
 */
async function measure(path) {
  const { data, info } = await sharp(path)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const at = (x, y) => {
    const i = (y * w + x) * c;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Background: median of the top rows, which sit above the unit in both shots.
  const samples = [];
  for (let y = 0; y < Math.floor(h * 0.03); y += 1) {
    for (let x = 0; x < w; x += 7) samples.push(at(x, y));
  }
  const median = (channel) => {
    const values = samples.map((s) => s[channel]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  const background = { r: median(0), g: median(1), b: median(2) };
  const backgroundLuma = (background.r + background.g + background.b) / 3;

  // The body is what is clearly darker or clearly coloured. This deliberately
  // ignores the soft floor shadow, which would otherwise sink the floor line.
  const isBody = (r, g, b) =>
    backgroundLuma - (r + g + b) / 3 > 28 ||
    Math.max(r, g, b) - Math.min(r, g, b) > 42;
  const isRed = (r, g, b) => r > 140 && r - g > 60 && r - b > 60;

  let minX = w;
  let maxX = 0;
  let minY = h;
  const bodyPerRow = new Array(h).fill(0);
  const redPerColumn = new Array(w).fill(0);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const [r, g, b] = at(x, y);
      if (isBody(r, g, b)) {
        bodyPerRow[y] += 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
      }
      if (isRed(r, g, b)) redPerColumn[x] += 1;
    }
  }

  const peakRow = Math.max(...bodyPerRow);
  let floorY = minY;
  for (let y = h - 1; y >= 0; y -= 1) {
    if (bodyPerRow[y] > peakRow * 0.04) {
      floorY = y;
      break;
    }
  }

  const peakColumn = Math.max(...redPerColumn);
  const dense = peakColumn * 0.25;
  const doorLeft = redPerColumn.findIndex((v) => v >= dense);
  const doorRight =
    w - 1 - [...redPerColumn].reverse().findIndex((v) => v >= dense);

  return {
    width: w,
    height: h,
    background,
    top: minY,
    left: minX,
    right: maxX,
    floorY,
    unitHeight: floorY - minY + 1,
    doorCentre: Math.round((doorLeft + doorRight) / 2),
  };
}

/** Shifts the studio tone onto the shared background without touching contrast. */
function levelToTarget({ background }) {
  return [
    TARGET_BACKGROUND.r - background.r,
    TARGET_BACKGROUND.g - background.g,
    TARGET_BACKGROUND.b - background.b,
  ];
}

async function build({ file, name }) {
  const source = `${SOURCE_DIR}/${file}`;
  const m = await measure(source);

  const scale = UNIT_HEIGHT / m.unitHeight;
  const scaledWidth = Math.round(m.width * scale);
  const scaledHeight = Math.round(m.height * scale);

  // Where the scaled frame must sit so the unit lands on the shared geometry.
  const offsetX = Math.round(DOOR_X - m.doorCentre * scale);
  const offsetY = Math.round(FLOOR_Y - m.floorY * scale);

  const [dr, dg, db] = levelToTarget(m);
  const scaled = await sharp(source)
    .removeAlpha()
    .resize(scaledWidth, scaledHeight, { kernel: "lanczos3" })
    .linear([1, 1, 1], [dr, dg, db])
    .toBuffer();

  // Only the part of the scaled frame that falls inside the canvas is kept.
  const srcLeft = Math.max(0, -offsetX);
  const srcTop = Math.max(0, -offsetY);
  const destLeft = Math.max(0, offsetX);
  const destTop = Math.max(0, offsetY);
  const cropWidth = Math.min(scaledWidth - srcLeft, CANVAS.width - destLeft);
  const cropHeight = Math.min(scaledHeight - srcTop, CANVAS.height - destTop);

  const window = await sharp(scaled)
    .extract({
      left: srcLeft,
      top: srcTop,
      width: cropWidth,
      height: cropHeight,
    })
    .toBuffer();

  // Feather the window edges so the pasted frame dissolves into the canvas
  // instead of drawing a rectangle across the studio background.
  const feather = 90;
  const mask = Buffer.from(
    `<svg width="${cropWidth}" height="${cropHeight}">
       <defs>
         <linearGradient id="h" x1="0" x2="1" y1="0" y2="0">
           <stop offset="0" stop-color="#000"/>
           <stop offset="${feather / cropWidth}" stop-color="#fff"/>
           <stop offset="${1 - feather / cropWidth}" stop-color="#fff"/>
           <stop offset="1" stop-color="#000"/>
         </linearGradient>
         <linearGradient id="v" x1="0" x2="0" y1="0" y2="1">
           <stop offset="0" stop-color="#000"/>
           <stop offset="${feather / cropHeight}" stop-color="#fff"/>
           <stop offset="${1 - feather / cropHeight}" stop-color="#fff"/>
           <stop offset="1" stop-color="#000"/>
         </linearGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#h)"/>
       <rect width="100%" height="100%" fill="url(#v)" style="mix-blend-mode:multiply"/>
     </svg>`,
  );
  const alpha = await sharp(mask).png().extractChannel("red").toBuffer();
  const feathered = await sharp(window)
    .ensureAlpha()
    .joinChannel(alpha)
    .png()
    .toBuffer();

  const destination = `${OUT_DIR}/${name}.webp`;
  await sharp({
    create: {
      width: CANVAS.width,
      height: CANVAS.height,
      channels: 3,
      background: TARGET_BACKGROUND,
    },
  })
    .composite([{ input: feathered, left: destLeft, top: destTop }])
    .webp({ quality: 92, effort: 5 })
    .toFile(destination);

  const { size } = await fs.stat(destination);
  console.log(
    `${name}: unit ${m.unitHeight}px -> ${UNIT_HEIGHT}px, door ${m.doorCentre} -> ${DOOR_X}, ${Math.round(size / 1024)} KB`,
  );
}

for (const entry of SOURCES) await build(entry);
