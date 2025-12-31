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
    const userScale = isMaskable ? (cfg.goldenRatio * 0.8) : cfg.goldenRatio;
    const shortEdge = Math.min(srcWidth, srcHeight);
    
    const baseRatio = targetSize / shortEdge;
    const finalRatio = baseRatio * userScale;

    const resizeWidth = Math.round(srcWidth * finalRatio);
    const resizeHeight = Math.round(srcHeight * finalRatio);

    // C. 处理前景图 (Resize)
    let fgChain = sharp(inputBuffer).resize({
      width: resizeWidth,
      height: resizeHeight,
      fit: 'fill',
    });

    // 使用“遮罩”代替“染色”
    // 仅 SVG 且 不是原色模式时，执行强制改色
    if (isSvg && !keepOriginalColor) {
      // 1. 先把 SVG 渲染成 Buffer (带透明通道的形状)
      const shapeBuffer = await fgChain.png().toBuffer();

      // 2. 创建一个纯色的矩形 (颜色为 iconColor)，尺寸和 resize 后的图标一样
      fgChain = sharp({
        create: {
          width: resizeWidth,
          height: resizeHeight,
          channels: 4,
          background: cfg.iconColor // 使用用户选择的前景色
        }
      })
      // 3. 使用 shapeBuffer 作为遮罩 (dest-in)
      // 原理：保留"纯色矩形"中与"图标形状"重叠的部分
      .composite([{
        input: shapeBuffer,
        blend: 'dest-in' 
      }]);
    }

    // D. 手动裁剪 (Manual Crop)
    // 注意：如果是遮罩模式，fgChain 现在是一个新的 sharp 实例，extract 依然有效
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

    // E. 最终合成 (Composite)
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

  // === 生成文件逻辑 ===
  if (isSvg) {
    const ico16 = await processImage(16, { forceTransparent: true });
    const ico32 = await processImage(32, { forceTransparent: true });
    
    files["favicon.ico"] = await pngToIco([ico16, ico32]);
    files["favicon.svg"] = inputBuffer;
  }

  const webSizes = [32, 192, 512];
  for (const size of webSizes) {
    files[`icon-${size}.png`] = await processImage(size, { forceTransparent: true });
  }
  
  files["apple-touch-icon.png"] = await processImage(180, { isMaskable: false, forceTransparent: false });
  files["maskable-192.png"] = await processImage(192, { isMaskable: true, forceTransparent: false });
  files["maskable-512.png"] = await processImage(512, { isMaskable: true, forceTransparent: false });
  files["android-192.png"] = await processImage(192, { isMaskable: false, forceTransparent: true });
  files["android-512.png"] = await processImage(512, { isMaskable: false, forceTransparent: true });

  return files;
}