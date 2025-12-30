import sharp from "sharp";
import pngToIco from "png-to-ico";
import { APP_DEFAULTS } from "./config.js";

/**
 * 生成所有需要的图标
 */
export async function generateIcons(svgBuffer, options = {}) {
  // 合并默认值
  const cfg = { 
    background: options.background || APP_DEFAULTS.bg,
    iconColor: options.iconColor || APP_DEFAULTS.fg,
    goldenRatio: options.goldenRatio || APP_DEFAULTS.goldenRatio,
  };

  const files = {};

  // === 1. Favicon.ico ===
  const ico16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  files["favicon.ico"] = await pngToIco([ico16, ico32]);

  // === 2. Web 标准图标 (透明背景) ===
  const webSizes = [32, 192, 512];
  for (const size of webSizes) {
    files[`icon-${size}.png`] = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
  }

  // === 3. 移动端实体背景图标 ===
  const createSolidIcon = async (size, isMaskable) => {
    const iconSize = isMaskable 
      ? Math.round(size * cfg.goldenRatio) 
      : Math.round(size * 0.8);

    const fg = await sharp(svgBuffer)
      .resize(iconSize, iconSize)
      .tint(cfg.iconColor) // 支持 8 位 HEX
      .png()
      .toBuffer();

    return await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: cfg.background, // 支持 8 位 HEX
      },
    })
      .composite([{ input: fg }])
      .png()
      .toBuffer();
  };

  files["apple-touch-icon.png"] = await createSolidIcon(180, false);
  files["android-192.png"] = await createSolidIcon(192, false);
  files["android-512.png"] = await createSolidIcon(512, false);
  files["maskable-192.png"] = await createSolidIcon(192, true);
  files["maskable-512.png"] = await createSolidIcon(512, true);

  return files;
}