import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
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
  const isHueSkin = h >= 8 && h <= 48;
  const isSatSkin = s >= 0.16 && s <= 0.70;
  const isLightSkin = l >= 0.22 && l <= 0.88;
  const isRgbOrder = r > g && g >= b;
  return isHueSkin && isSatSkin && isLightSkin && isRgbOrder;
}

async function processImage(inputFilename, outputFilename, pixelTransform) {
  const inputPath = path.join(assetsDir, inputFilename);
  const outputPath = path.join(assetsDir, outputFilename);

  if (!fs.existsSync(inputPath)) {
    console.error(`Missing input file: ${inputPath}`);
    return;
  }

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

      const modified = pixelTransform({
        x, y, width, height,
        r, g, b, h, s, l,
        isSkin: isSkinTone(h, s, l, r, g, b)
      });

      if (modified) {
        const [nr, ng, nb] = hslToRgb(modified[0], modified[1], modified[2]);
        rawBuffer[idx] = nr;
        rawBuffer[idx + 1] = ng;
        rawBuffer[idx + 2] = nb;
      }
    }
  }

  await sharp(rawBuffer, { raw: { width, height, channels } })
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log(`[SUCCESS] Generated: ${outputFilename}`);
}

async function run() {
  console.log("Generating remaining seamless photographic variants...");

  // womania-intro-black.jpg from womania-intro-modern.jpg
  await processImage("womania-intro-modern.jpg", "womania-intro-black.jpg", ({ x, y, width, height, s, l, isSkin }) => {
    if (x >= width * 0.27 && x <= width * 0.58 && y >= height * 0.25 && y <= height * 0.94) {
      if (!isSkin) {
        const isWhiteFabric = l >= 0.35 && l <= 0.92 && s <= 0.25;
        const isCup = x <= width * 0.35 && y <= height * 0.35;
        if (isWhiteFabric && !isCup) {
          return [0, 0, Math.max(0.08, l * 0.22)];
        }
      }
    }
    return null;
  });

  // womania-corset-black.jpg from womania-corset-top.jpg
  await processImage("womania-corset-top.jpg", "womania-corset-black.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.20 && !isSkin) {
      if (h >= 75 && h <= 170 && s >= 0.12) {
        return [0, 0, Math.max(0.08, l * 0.22)];
      }
    }
    return null;
  });

  // womania-palazzo-emerald.jpg from womania-palazzo-suit.jpg
  await processImage("womania-palazzo-suit.jpg", "womania-palazzo-emerald.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.24 && !isSkin) {
      if (h >= 240 && h <= 330 && s >= 0.14) {
        return [158, 0.65, l * 0.92];
      }
    }
    return null;
  });

  // womania-western-camel.jpg from womania-western.jpg
  await processImage("womania-western.jpg", "womania-western-camel.jpg", ({ y, height, l, isSkin }) => {
    if (y > height * 0.20 && !isSkin) {
      if (l <= 0.38) {
        return [34, 0.48, Math.min(0.68, l * 1.8 + 0.18)];
      }
    }
    return null;
  });

  // womania-western-ivory.jpg from womania-western.jpg
  await processImage("womania-western.jpg", "womania-western-ivory.jpg", ({ y, height, l, isSkin }) => {
    if (y > height * 0.20 && !isSkin) {
      if (l <= 0.38) {
        return [40, 0.18, Math.min(0.85, l * 2.0 + 0.40)];
      }
    }
    return null;
  });

  // womania-suits-champagne.jpg from womania-suits.jpg
  await processImage("womania-suits.jpg", "womania-suits-champagne.jpg", ({ y, height, l, isSkin }) => {
    if (y > height * 0.22 && !isSkin) {
      if (l <= 0.45) {
        return [42, 0.45, Math.min(0.82, l * 1.7 + 0.25)];
      }
    }
    return null;
  });

  // womania-suits-mauve.jpg from womania-suits.jpg
  await processImage("womania-suits.jpg", "womania-suits-mauve.jpg", ({ y, height, l, isSkin }) => {
    if (y > height * 0.22 && !isSkin) {
      if (l <= 0.45) {
        return [320, 0.35, Math.min(0.75, l * 1.5 + 0.20)];
      }
    }
    return null;
  });

  console.log("All variants created successfully!");
}

run().catch(console.error);
