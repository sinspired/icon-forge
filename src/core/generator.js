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
  // 使用 ?? null 确保如果用户传了 null 不会被默认值覆盖，
  // 但如果用户没传 (undefined)，则使用默认值。
  const cfg = {
    background: options.background !== undefined ? options.background : APP_DEFAULTS.bg,
    iconColor: options.iconColor !== undefined ? options.iconColor : APP_DEFAULTS.fg,
    goldenRatio: options.goldenRatio || APP_DEFAULTS.goldenRatio,
  };

  // 3. 解析特殊状态
  const isBgTransparent = cfg.background === "transparent" || cfg.background === null;
  const keepOriginalColor = cfg.iconColor === "original" || cfg.iconColor === null;

  // 转换 Sharp 需要的背景色对象
  const sharpBackground = isBgTransparent
    ? { r: 0, g: 0, b: 0, alpha: 0 } // 完全透明
    : cfg.background; // Hex 字符串

  const files = {};

  // === 通用处理核心函数 ===
  const processImage = async (targetSize, isMaskable = false) => {
    // ------------------------------------------------
    // 策略 A: JPG/PNG 位图 (照片模式)
    // ------------------------------------------------
    // 位图不进行着色，通常也不需要额外背景(因为是 cover 填充)，
    // 除非用户强制指定了 fit: contain 且背景不透明(暂不考虑该复杂情况，维持 cover 策略)
    if (!isSvg) {
      return await sharp(inputBuffer)
        .resize({
          width: targetSize,
          height: targetSize,
          fit: 'cover',       // 填满
          position: 'center', // 居中裁切
          background: sharpBackground // 仅当图片有透明通道且未填满时有效，cover模式下几乎无用
        })
        .png()
        .toBuffer();
    }

    // ------------------------------------------------
    // 策略 B: SVG 矢量图 (图标模式)
    // ------------------------------------------------
    
    // 1. 计算内容尺寸
    // 如果背景是透明的，我们通常希望图标稍微大一点（或者按照原定比例），
    // 这里的 goldenRatio 主要用于 Maskable 图标的安全区域计算。
    const iconSize = isMaskable 
      ? Math.round(targetSize * cfg.goldenRatio) 
      : Math.round(targetSize * 0.8);

    // 2. 处理前景 (缩放 + 可选着色)
    let fgChain = sharp(inputBuffer).resize({
      width: iconSize,
      height: iconSize,
      fit: 'inside', // 保持比例，最长边 = iconSize
      background: { r: 0, g: 0, b: 0, alpha: 0 } // 前景自身的背景保持透明
    });

    // 仅当是 SVG 且 没有设置"保持原色" 时，才进行着色
    if (!keepOriginalColor) {
      fgChain = fgChain.tint(cfg.iconColor);
    }

    const fg = await fgChain.png().toBuffer();

    // 3. 创建底板并合成
    // 无论背景是透明还是实色，我们都创建一个 targetSize 的底板
    // 这样可以确保输出的图片尺寸绝对精确，且图标绝对居中
    return await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: sharpBackground, 
      },
    })
      .composite([{ input: fg, gravity: 'center' }]) // 居中合成
      .png()
      .toBuffer();
  };

  // === 生成文件列表 ===

  // 1. Favicon (.ico)
  // ico 通常保持透明背景，且保持 SVG 原色 (如果 iconColor 没被强制覆盖)
  // 为了 ico 清晰度，通常建议不对 ico 进行 tint，除非业务强需求。
  // 这里我们复用 processImage，它会遵循 cfg 的配置。
  const ico16 = await processImage(16);
  const ico32 = await processImage(32);
  files["favicon.ico"] = await pngToIco([ico16, ico32]);

  // 2. Web 图标
  const webSizes = [32, 192, 512];
  for (const size of webSizes) {
    files[`icon-${size}.png`] = await processImage(size);
  }

  // 3. PWA / 移动端图标
  // 注意：PWA 标准建议 apple-touch-icon 和 android-icon 最好是非透明背景的。
  // 如果 cfg.background 是 transparent，这里生成的将是透明背景图标。
  // 某些 Android 设备在显示透明背景 PWA 图标时会自动填充黑色，需注意。
  files["apple-touch-icon.png"] = await processImage(180, false);
  files["android-192.png"] = await processImage(192, false);
  files["android-512.png"] = await processImage(512, false);
  files["maskable-192.png"] = await processImage(192, true);
  files["maskable-512.png"] = await processImage(512, true);

  return files;
}