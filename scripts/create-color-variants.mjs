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
  // Model skin tone detection
  const isHueSkin = h >= 10 && h <= 45;
  const isSatSkin = s >= 0.16 && s <= 0.68;
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

  await sharp(rawBuffer, {
    raw: {
      width,
      height,
      channels
    }
  })
  .jpeg({ quality: 92 })
  .toFile(outputPath);

  console.log(`[SUCCESS] Generated: ${outputFilename}`);
}

async function run() {
  console.log("Generating flawless garment-only model photographic variants...");

  // 1. womania-intro-gold.jpg (Pure Ivory Jumpsuit -> Champagne Gold)
  // Bounded strictly to model: x 27% to 58%, y 25% to 94%
  await processImage("womania-intro-modern.jpg", "womania-intro-gold.jpg", ({ x, y, width, height, r, g, b, s, l, isSkin }) => {
    if (x >= width * 0.27 && x <= width * 0.58 && y >= height * 0.25 && y <= height * 0.94) {
      if (!isSkin) {
        // Jumpsuit fabric (white/ivory/grey shadows)
        const isWhiteFabric = l >= 0.35 && l <= 0.92 && s <= 0.25;
        // Avoid pure white wall / coffee cup
        const isCup = x <= width * 0.35 && y <= height * 0.35;
        if (isWhiteFabric && !isCup) {
          return [42, 0.58, l * 0.94];
        }
      }
    }
    return null;
  });

  // 2. womania-indo-rose.jpg (Olive Bustier Set -> Dusty Rose)
  // Bounded strictly to model silhouette: x 30% to 70%, y 20% to 96%
  await processImage("womania-indo.jpg", "womania-indo-rose.jpg", ({ x, y, width, height, r, g, b, h, s, l, isSkin }) => {
    if (x >= width * 0.30 && x <= width * 0.70 && y >= height * 0.20 && y <= height * 0.96) {
      // Exclude tummy / skin
      const isTummy = y <= height * 0.36 && r > 155 && r > g;
      if (!isSkin && !isTummy) {
        // Olive fabric: r ~ 70-135, g ~ 70-135, b ~ 50-105
        const isOlive = r >= 60 && r <= 145 && g >= 60 && g <= 145 && b <= 115 && Math.abs(r - g) <= 25;
        if (isOlive) {
          // Shift olive to Dusty Rose
          return [345, 0.42, l * 1.08];
        }
      }
    }
    return null;
  });

  // 3. womania-indo-gold.jpg (Olive Bustier Set -> Ivory Gold)
  await processImage("womania-indo.jpg", "womania-indo-gold.jpg", ({ x, y, width, height, r, g, b, h, s, l, isSkin }) => {
    if (x >= width * 0.30 && x <= width * 0.70 && y >= height * 0.20 && y <= height * 0.96) {
      const isTummy = y <= height * 0.36 && r > 155 && r > g;
      if (!isSkin && !isTummy) {
        const isOlive = r >= 60 && r <= 145 && g >= 60 && g <= 145 && b <= 115 && Math.abs(r - g) <= 25;
        if (isOlive) {
          // Shift olive to Ivory Gold
          return [42, 0.52, Math.min(1, l * 1.25)];
        }
      }
    }
    return null;
  });

  // 4. womania-chic-lavender.jpg (Blush Organza Dress -> Lavender Haze)
  await processImage("womania-chic-couture.jpg", "womania-chic-lavender.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.26 && !isSkin) {
      if ((h >= 315 || h <= 15) && s >= 0.12 && l >= 0.35) {
        return [275, s * 1.1, l];
      }
    }
    return null;
  });

  // 5. womania-chic-blue.jpg (Blush Organza Dress -> Powder Blue)
  await processImage("womania-chic-couture.jpg", "womania-chic-blue.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.26 && !isSkin) {
      if ((h >= 315 || h <= 15) && s >= 0.12 && l >= 0.35) {
        return [205, 0.45, l * 1.05];
      }
    }
    return null;
  });

  // 6. womania-corset-gold.jpg (Emerald Corset -> Champagne Gold)
  await processImage("womania-corset-top.jpg", "womania-corset-gold.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.20 && !isSkin) {
      if (h >= 75 && h <= 170 && s >= 0.12) {
        return [40, 0.65, Math.min(1, l * 1.15)];
      }
    }
    return null;
  });

  // 7. womania-corset-ruby.jpg (Emerald Corset -> Ruby Red)
  await processImage("womania-corset-top.jpg", "womania-corset-ruby.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.20 && !isSkin) {
      if (h >= 75 && h <= 170 && s >= 0.12) {
        return [352, Math.min(1, s * 1.45), l];
      }
    }
    return null;
  });

  // 8. womania-silk-rose.jpg (Mint Chikankari Suit -> Powder Rose Pink)
  await processImage("womania-silk-suit.jpg", "womania-silk-rose.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.22 && !isSkin) {
      if (h >= 125 && h <= 205 && s >= 0.08) {
        return [342, Math.min(1, s * 1.35), l * 1.05];
      }
    }
    return null;
  });

  // 9. womania-palazzo-crimson.jpg (Purple Saree -> Crimson Red)
  await processImage("womania-palazzo-suit.jpg", "womania-palazzo-crimson.jpg", ({ y, height, h, s, l, isSkin }) => {
    if (y > height * 0.24 && !isSkin) {
      if (h >= 240 && h <= 330 && s >= 0.14) {
        return [350, Math.min(1, s * 1.35), l];
      }
    }
    return null;
  });

  // 10. womania-satin-black.jpg (Plum Gown -> Midnight Black)
  await processImage("womania-satin-dress.jpg", "womania-satin-black.jpg", ({ y, height, s, l, isSkin }) => {
    if (y > height * 0.24 && !isSkin) {
      if (l <= 0.68 && s >= 0.08) {
        return [0, 0, l * 0.35];
      }
    }
    return null;
  });

  // 11. womania-satin-ruby.jpg (Plum Gown -> Ruby Red)
  await processImage("womania-satin-dress.jpg", "womania-satin-ruby.jpg", ({ y, height, s, l, isSkin }) => {
    if (y > height * 0.24 && !isSkin) {
      if (l <= 0.68 && s >= 0.08) {
        return [352, Math.min(1, s * 1.5), Math.min(1, l * 1.15)];
      }
    }
    return null;
  });

  console.log("All photographic variants generated successfully!");
}

run().catch(console.error);
