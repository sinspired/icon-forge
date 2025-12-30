import sharp from "sharp";
import pngToIco from "png-to-ico";
import { APP_DEFAULTS } from "./config.js";

/**
 * 生成所有需要的图标
 */
export async function generateIcons(inputBuffer, options = {}) {
  // 1. 获取图片元数据
  const metadata = await sharp(inputBuffer).metadata();
  const isSvg = metadata.format === "svg";
  
  // 获取原图尺寸
  const { width: srcWidth, height: srcHeight } = metadata;

  // 2. 合并配置
  const cfg = {
    background: options.background !== undefined ? options.background : APP_DEFAULTS.bg,
    iconColor: options.iconColor !== undefined ? options.iconColor : APP_DEFAULTS.fg,
    goldenRatio: options.goldenRatio || APP_DEFAULTS.goldenRatio,
  };

  // 3. 解析特殊状态
  const isGlobalBgTransparent = cfg.background === "transparent" || cfg.background === null;
  const keepOriginalColor = cfg.iconColor === "original" || cfg.iconColor === null;

  const appBackground = isGlobalBgTransparent
    ? { r: 0, g: 0, b: 0, alpha: 0 }
    : cfg.background;

  const files = {};

  // === 通用处理核心函数 ===
  const processImage = async (targetSize, { isMaskable = false, forceTransparent = false } = {}) => {
    
    // A. 确定背景
    const currentBackground = forceTransparent
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : appBackground;

    // B. 计算缩放逻辑
    // 目标：以短边铺满为 100% (Scale=1.0 时效果等同于 cover)
    const userScale = isMaskable ? (cfg.goldenRatio * 0.8) : cfg.goldenRatio;
    const longEdge = Math.max(srcWidth, srcHeight);
    
    // 基准比例：让长边等于目标尺寸
    const baseRatio = targetSize / longEdge;
    // 最终比例：应用用户的缩放
    const finalRatio = baseRatio * userScale;

    const resizeWidth = Math.round(srcWidth * finalRatio);
    const resizeHeight = Math.round(srcHeight * finalRatio);

    // C. 处理前景图 (Resize)
    let fgChain = sharp(inputBuffer).resize({
      width: resizeWidth,
      height: resizeHeight,
      fit: 'fill', // 强制缩放到计算好的尺寸
    });

    // 仅 SVG 允许改色
    if (isSvg && !keepOriginalColor) {
      fgChain = fgChain.tint(cfg.iconColor);
    }

    // 手动裁剪 (Manual Crop)
    // 如果缩放后的图比底板大，必须裁剪掉多余部分，否则 composite 会报错
    if (resizeWidth > targetSize || resizeHeight > targetSize) {
        const extractWidth = Math.min(resizeWidth, targetSize);
        const extractHeight = Math.min(resizeHeight, targetSize);
        
        const left = Math.floor((resizeWidth - extractWidth) / 2);
        const top = Math.floor((resizeHeight - extractHeight) / 2);

        fgChain = fgChain.extract({
            left: left,
            top: top,
            width: extractWidth,
            height: extractHeight
        });
    }

    const fg = await fgChain.png().toBuffer();

    // D. 合成 (Composite)
    // 此时 fg 的尺寸一定 <= targetSize，可以安全合成
    return await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: currentBackground,
      },
    })
      .composite([{ input: fg, gravity: 'center' }])
      .png()
      .toBuffer();
  };

  // === 1. Favicon 处理 (仅限 SVG) ===
  // 严格执行：非 SVG 格式，不生成 .ico 和 .svg
  if (isSvg) {
    const ico16 = await processImage(16, { forceTransparent: true });
    const ico32 = await processImage(32, { forceTransparent: true });
    
    files["favicon.ico"] = await pngToIco([ico16, ico32]);
    files["favicon.svg"] = inputBuffer; // 原样保存
  }

  // === 2. Web 通用 PNG 图标 (始终生成) ===
  const webSizes = [32, 192, 512];
  for (const size of webSizes) {
    files[`icon-${size}.png`] = await processImage(size, { forceTransparent: true });
  }

  // === 3. 移动端/App 图标 ===
  
  // iOS (实色)
  files["apple-touch-icon.png"] = await processImage(180, { isMaskable: false, forceTransparent: false });

  // Android Maskable (实色)
  files["maskable-192.png"] = await processImage(192, { isMaskable: true, forceTransparent: false });
  files["maskable-512.png"] = await processImage(512, { isMaskable: true, forceTransparent: false });

  // Android Launch (透明)
  files["android-192.png"] = await processImage(192, { isMaskable: false, forceTransparent: true });
  files["android-512.png"] = await processImage(512, { isMaskable: false, forceTransparent: true });

  return files;
}