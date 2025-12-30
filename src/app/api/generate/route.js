import { generateIcons } from "../../../core/generator.js";
import { APP_DEFAULTS } from "../../../core/config.js";
import JSZip from "jszip";

// 强制使用 Node.js Runtime
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // 获取参数，如果未提供则使用 APP_DEFAULTS
    const appName = formData.get("name") || APP_DEFAULTS.name;
    const appShortName = formData.get("short_name") || APP_DEFAULTS.shortName;

    // 颜色 Fallback (支持接收 8 位颜色代码)
    const brand = formData.get("brand") || APP_DEFAULTS.brand;
    const bg = formData.get("bg") || APP_DEFAULTS.bg;
    const fg = formData.get("fg") || APP_DEFAULTS.fg;

    if (!file) {
      return Response.json({ error: "请上传 SVG 文件" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const svgBuffer = Buffer.from(arrayBuffer);

    // 生成图标 (Sharp 引擎支持 8 位 HEX 颜色)
    const images = await generateIcons(svgBuffer, {
      brandColor: brand,
      background: bg,
      iconColor: fg,
      goldenRatio: APP_DEFAULTS.goldenRatio,
    });

    const zip = new JSZip();
    const iconsFolder = zip.folder("icons");
    for (const [name, buffer] of Object.entries(images)) {
      if (name === 'favicon.ico') zip.file(name, buffer);
      else iconsFolder.file(name, buffer);
    }
    zip.file("favicon.svg", svgBuffer);


    let manifestBg = bg;

    if (!manifestBg || manifestBg === 'transparent') {
      // 如果是透明背景图标，启动屏通常设为白色或品牌色
      manifestBg = '#ffffff';
    }

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

    const htmlSnippet = `
<meta name="theme-color" content="${brand}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/icons/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
    `;
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