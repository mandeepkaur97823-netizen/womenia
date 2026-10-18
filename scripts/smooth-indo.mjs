import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "..", "src", "assets");

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hNorm = h / 360;
    r = hue2rgb(p, q, hNorm + 1/3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function isSkinTone(h, s, l, r, g, b) {
  return h >= 8 && h <= 48 && s >= 0.15 && s <= 0.70 && l >= 0.22 && l <= 0.88 && r > g && g >= b;
}

async function transformGarment(inputFilename, outputFilename, isGarmentPixel, getNewHsl) {
  const inputPath = path.join(assetsDir, inputFilename);
  const outputPath = path.join(assetsDir, outputFilename);

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const rawBuffer = await image.raw().toBuffer();
  const channels = metadata.channels || 3;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = rawBuffer[idx];
      const g = rawBuffer[idx + 1];
      const b = rawBuffer[idx + 2];

      const [h, s, l] = rgbToHsl(r, g, b);

      if (isGarmentPixel({ x, y, width, height, r, g, b, h, s, l })) {
        const [nh, ns, nl] = getNewHsl(h, s, l);
        const [nr, ng, nb] = hslToRgb(nh, ns, nl);
        rawBuffer[idx] = nr;
        rawBuffer[idx + 1] = ng;
        rawBuffer[idx + 2] = nb;
      }
    }
  }

  await sharp(rawBuffer, { raw: { width, height, channels } })
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log(`[SUCCESS] Perfect garment transformation: ${outputFilename}`);
}

async function run() {
  // 1. Indo-Western Olive Set (womania-indo.jpg)
  const isIndoGarment = ({ x, y, width, height, r, g, b, l }) => {
    if (y < height * 0.21) return false;
    if (y > height * 0.94) return false;
    if (y > height * 0.88 && x < width * 0.38) return false; // Floor shadow exclusion
    if (l > 0.65) return false; // Background
    if (r - g >= 20) return false; // Skin

    const isTrouserArea = y >= height * 0.33 && y <= height * 0.94 && x >= width * 0.31 && x <= width * 0.78;
    const isBustierArea = y >= height * 0.21 && y <= height * 0.325 && x >= width * 0.38 && x <= width * 0.58;

    if (isTrouserArea || isBustierArea) {
      return Math.abs(r - g) <= 18 && b <= g && l < 0.62;
    }
    return false;
  };

  await transformGarment("womania-indo.jpg", "womania-indo-rose.jpg", isIndoGarment, (h, s, l) => [345, 0.44, l * 1.05]);
  await transformGarment("womania-indo.jpg", "womania-indo-gold.jpg", isIndoGarment, (h, s, l) => [42, 0.50, Math.min(1, l * 1.25)]);

  // 2. White Jumpsuit (womania-intro-modern.jpg -> Champagne Gold)
  const isJumpsuit = ({ x, y, width, height, r, g, b, h, s, l }) => {
    // Face & sunglasses
    if (y < height * 0.24) return false;
    // Feet & sandals
    if (y > height * 0.94) return false;
    // Bounded strictly to model jumpsuit width
    if (x < width * 0.33 || x > width * 0.58) return false;
    // Exclude coffee cup and arm holding it
    if (x < width * 0.38 && y < height * 0.38) return false;
    // Exclude skin
    if (isSkinTone(h, s, l, r, g, b)) return false;
    if (r > 160 && r > g && g > b) return false;
    // Exclude black wall lines
    if (l < 0.22) return false;
    // Exclude pure bright wall reflection
    if (l > 0.90) return false;

    // White/grey linen jumpsuit fabric
    return l >= 0.25 && l <= 0.88 && s <= 0.26;
  };

  await transformGarment("womania-intro-modern.jpg", "womania-intro-gold.jpg", isJumpsuit, (h, s, l) => [42, 0.55, l * 0.95]);

  console.log("All photographic transformations complete!");
}

run().catch(console.error);
