#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateIcons } from "../core/generator.js";
import { APP_DEFAULTS } from "../core/config.js";

// 解析参数，默认值使用 APP_DEFAULTS
const argv = yargs(hideBin(process.argv))
  .option("input", { alias: "i", type: "string", demandOption: true, description: "源 SVG 文件" })
  .option("out", { alias: "o", type: "string", default: "static", description: "输出目录" })
  .option("name", { alias: "n", type: "string", default: APP_DEFAULTS.name })
  .option("short", { alias: "s", type: "string", default: APP_DEFAULTS.shortName })
  .option("brand", { type: "string", default: APP_DEFAULTS.brand })
  .option("bg", { type: "string", default: APP_DEFAULTS.bg })
  .option("fg", { type: "string", default: APP_DEFAULTS.fg })
  .help()
  .argv;

const CWD = process.cwd();
const INPUT_PATH = path.resolve(CWD, argv.input);
const OUT_DIR = path.resolve(CWD, argv.out);
const ICONS_SUBDIR = "icons";

async function run() {
  console.log(`\n🔨 [Icon Forge] 开始生成...`);
  console.log(`   🎨 配色: Brand=${argv.brand} | BG=${argv.bg} | FG=${argv.fg}`);

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`❌ 找不到文件: ${INPUT_PATH}`);
    process.exit(1);
  }

  const svgBuffer = await fs.readFile(INPUT_PATH);
  const images = await generateIcons(svgBuffer, {
    background: argv.bg,
    iconColor: argv.fg,
    goldenRatio: APP_DEFAULTS.goldenRatio
  });

  const iconsPath = path.join(OUT_DIR, ICONS_SUBDIR);
  await fs.ensureDir(iconsPath);

  for (const [name, buffer] of Object.entries(images)) {
    await fs.writeFile(path.join(iconsPath, name), buffer);
  }
  await fs.copy(INPUT_PATH, path.join(OUT_DIR, "favicon.svg"));

  let manifestBg = argv.bg;

  if (!manifestBg || manifestBg === 'transparent') {
    // 如果是透明背景图标，启动屏通常设为白色或品牌色
    manifestBg = '#ffffff';
  }

  const manifest = {
    name: argv.name,
    short_name: argv.short,
    start_url: "/",
    display: "standalone",
    background_color: manifestBg,
    theme_color: argv.brand,
    icons: [
      { src: `${ICONS_SUBDIR}/android-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${ICONS_SUBDIR}/android-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${ICONS_SUBDIR}/maskable-192.png`, sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: `${ICONS_SUBDIR}/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
  await fs.writeJson(path.join(OUT_DIR, "manifest.json"), manifest, { spaces: 2 });

  const headHtml = `
<!-- PWA & Icons -->
<meta name="theme-color" content="${argv.brand}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${ICONS_SUBDIR}/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="icon" type="image/png" href="${ICONS_SUBDIR}/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="${ICONS_SUBDIR}/apple-touch-icon.png">
<link rel="manifest" href="manifest.json">
`;

  await fs.writeFile(path.join(OUT_DIR, "head-snippet.html"), headHtml.trim());
  console.log(`✅ 完成!`);
}

run().catch(console.error);