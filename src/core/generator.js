import sharp from "sharp";
import pngToIco from "png-to-ico";
import { APP_DEFAULTS } from "./config.js";

/**
 * 生成所有需要的图标
 */
export async function generateIcons(inputBuffer, options = {}) {
  // 1. 获取图片信息
  const metadata = await sharp(inputBuffer).metadata();
  const isSvg = metadata.format === "svg";

  // 2. 合并配置
  const cfg = {
    background: options.background !== undefined ? options.background : APP_DEFAULTS.bg,
    iconColor: options.iconColor !== undefined ? options.iconColor : APP_DEFAULTS.fg,
    goldenRatio: options.goldenRatio || APP_DEFAULTS.goldenRatio,
  };

  // 3. 解析特殊状态 (全局配置)
  const isGlobalBgTransparent = cfg.background === "transparent" || cfg.background === null;
  const keepOriginalColor = cfg.iconColor === "original" || cfg.iconColor === null;

  // 全局配置的背景色 (用于 App 图标)
  const appBackground = isGlobalBgTransparent
    ? { r: 0, g: 0, b: 0, alpha: 0 }
    : cfg.background;

  const files = {};

  // === 通用处理核心函数 ===
  // 参数 options: { isMaskable: boolean, forceTransparent: boolean }
  const processImage = async (targetSize, { isMaskable = false, forceTransparent = false } = {}) => {

    // 决定当前图标的背景色
    const currentBackground = forceTransparent
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : appBackground;

    // ------------------------------------------------
    // 策略 A: JPG/PNG 位图
    // ------------------------------------------------
    if (!isSvg) {
      // 如果是 JPG 且强制透明：我们无法让 JPG 变透明，但我们确保不去"添加"额外背景
      // 如果不是强制透明 (如 Apple Icon)：我们使用 cover 填充整个背景区域
      const fitMode = forceTransparent ? 'contain' : 'cover';

      return await sharp(inputBuffer)
        .resize({
          width: targetSize,
          height: targetSize,
          fit: fitMode,
          background: currentBackground
        })
        .png()
        .toBuffer();
    }

    // ------------------------------------------------
    // 策略 B: SVG 矢量图
    // ------------------------------------------------

    // 1. 计算内容尺寸
    let iconSize;
    if (forceTransparent) {
      // Web 图标：通常希望图标撑得比较满，不需要像 Maskable 那样留很大的安全区
      iconSize = targetSize;
    } else {
      // App 图标：需要安全区 (黄金比例 或 0.8)
      iconSize = isMaskable
        ? Math.round(targetSize * cfg.goldenRatio)
        : Math.round(targetSize * 0.8);
    }

    // 2. 处理前景
    let fgChain = sharp(inputBuffer).resize({
      width: iconSize,
      height: iconSize,
      fit: 'inside', // 保持比例
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });

    if (!keepOriginalColor) {
      fgChain = fgChain.tint(cfg.iconColor);
    }

    const fg = await fgChain.png().toBuffer();

    // 3. 创建底板并合成
    return await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: currentBackground, // 使用根据用途决定的背景
      },
    })
      .composite([{ input: fg, gravity: 'center' }])
      .png()
      .toBuffer();
  };

  // === 1. Web 标准图标 (强制透明) ===
  // 这些图标用于 favicon 或 <link rel="icon">
  // 它们不应该带有实体背景色，除非 SVG 本身就是方的且带背景
  const ico16 = await processImage(16, { forceTransparent: true });
  const ico32 = await processImage(32, { forceTransparent: true });
  files["favicon.ico"] = await pngToIco([ico16, ico32]);

  // 生成通用的 icon-xx.png (用于 Manifest 'any' 和 Web)
  const webSizes = [16, 32, 192, 512];
  for (const size of webSizes) {
    files[`icon-${size}.png`] = await processImage(size, { forceTransparent: true });
  }

  // === 2. 移动端/App 图标 (使用配置背景) ===

  // iOS: 必须非透明 (否则变黑)
  files["apple-touch-icon.png"] = await processImage(180, { isMaskable: false, forceTransparent: false });

  // Android Maskable: 必须非透明 (且有安全区缩放)
  files["maskable-192.png"] = await processImage(192, { isMaskable: true, forceTransparent: false });
  files["maskable-512.png"] = await processImage(512, { isMaskable: true, forceTransparent: false });

  // 用于开屏时的logo，需要透明背景
  files["android-192.png"] = await processImage(192, { isMaskable: false, forceTransparent: false });
  files["android-512.png"] = await processImage(512, { isMaskable: false, forceTransparent: false });

  return files;
}