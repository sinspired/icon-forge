import { generateIcons } from "../../../core/generator.js"; 
import { APP_DEFAULTS } from "../../../core/config.js";
import JSZip from "jszip";

// 强制使用 Node.js Runtime (Sharp 需要)
export const runtime = 'nodejs'; 

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    
    const appName = formData.get("name") || APP_DEFAULTS.name;
    const appShortName = formData.get("short_name") || APP_DEFAULTS.shortName;
    const brand = formData.get("brand") || APP_DEFAULTS.brand;
    const bg = formData.get("bg") || APP_DEFAULTS.bg;
    const fg = formData.get("fg") || APP_DEFAULTS.fg;
    
    // 获取缩放比例 (默认为配置中的 goldenRatio)
    const goldenRatio = parseFloat(formData.get("goldenRatio")) || APP_DEFAULTS.goldenRatio;

    if (!file) {
      return Response.json({ error: "请上传图片文件" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 生成图标
    const images = await generateIcons(inputBuffer, {
      brandColor: brand,
      background: bg,
      iconColor: fg,
      goldenRatio: goldenRatio, // 传递缩放参数
    });

    const zip = new JSZip();
    const iconsFolder = zip.folder("icons");
    
    // 检查哪些特殊文件生成了
    const hasIco = Object.prototype.hasOwnProperty.call(images, "favicon.ico");
    const hasSvg = Object.prototype.hasOwnProperty.call(images, "favicon.svg");

    // 写入 Zip
    for (const [name, buffer] of Object.entries(images)) {
       // favicon 放在根目录，其他放在 icons 目录
       if (name.startsWith('favicon')) {
         zip.file(name, buffer);
       } else {
         iconsFolder.file(name, buffer);
       }
    }

    // Manifest
    // 如果是透明背景，Manifest background_color 建议兜底为白色，防止启动屏报错
    const manifestBg = (bg === 'transparent' || !bg) ? '#ffffff' : bg;
    
    const manifest = {
      name: appName,
      short_name: appShortName,
      start_url: "/",
      display: "standalone",
      background_color: manifestBg,
      theme_color: brand,
      icons: [
        { src: "icons/android-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "icons/android-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
        { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
      ]
    };
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));

    // HTML Snippet 动态生成
    // 使用 filter(Boolean) 移除不需要的行
    const htmlLines = [
      `<!-- PWA & Icons -->`,
      `<meta name="theme-color" content="${brand}" media="(prefers-color-scheme: light)">`,
      `<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">`,
      
      // 仅当存在时才添加 (非 SVG 时会自动消失)
      hasIco ? `<link rel="icon" href="favicon.ico" sizes="any">` : null,
      hasSvg ? `<link rel="icon" type="image/svg+xml" href="favicon.svg">` : null,
      
      `<link rel="icon" type="image/png" href="icons/icon-32.png" sizes="32x32">`,
      `<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">`,
      `<link rel="manifest" href="manifest.json">`
    ];
    
    const htmlSnippet = htmlLines.filter(Boolean).join('\n');
    zip.file("head-snippet.html", htmlSnippet.trim());

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="pwa-icons.zip"',
      },
    });

  } catch (error) {
    console.error("Generator Error:", error);
    return Response.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}