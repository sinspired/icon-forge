"use client";

import { useState, useEffect } from "react";
import { Upload, Download, Loader2, Copy, Check, Terminal, Sun, Moon, Monitor, RotateCcw, Languages } from "lucide-react";
import { APP_DEFAULTS } from "@/core/config";

const TRANSLATIONS = {
  zh: {
    title: "Icon Forge",
    subtitle: "PWA 图标生成器",
    uploadTitle: "点击上传 SVG",
    uploadDesc: "实时渲染预览",
    reset: "重置",
    appInfo: "应用信息",
    fullName: "应用全名",
    shortName: "应用短名",
    styleConfig: "风格配置",
    browserTheme: "浏览器主题色",
    iconBg: "图标背景色",
    logoFill: "图标主体色",
    generate: "生成并下载",
    processing: "正在锻造...",
    htmlTitle: "HTML 代码片段",
    copy: "复制",
    copied: "已复制",
    tip: "使用方法",
    tipDesc: "解压 ZIP ➝ 放入项目 ➝ 代码粘贴到 <head>",
    waiting: "等待生成...",
    waitingDesc: "上传 SVG 开启锻造",
    error: "生成失败"
  },
  en: {
    title: "Icon Forge",
    subtitle: "PWA Asset Generator",
    uploadTitle: "Click to Upload",
    uploadDesc: "Real-time Preview",
    reset: "Reset",
    appInfo: "App Meta",
    fullName: "Full Name",
    shortName: "Short Name",
    styleConfig: "Style Config",
    browserTheme: "Browser Theme",
    iconBg: "Icon Background",
    logoFill: "Logo Fill",
    generate: "Generate & Download",
    processing: "Forging...",
    htmlTitle: "HTML Snippet",
    copy: "Copy",
    copied: "Copied",
    tip: "How to use",
    tipDesc: "Unzip ➝ Place in project ➝ Paste in <head>",
    waiting: "Waiting for generation...",
    waitingDesc: "Upload an SVG to start",
    error: "Generation Failed"
  }
};

// 滚动条样式
const ScrollbarStyles = () => (
  <style jsx global>{`
    /* 滚动条整体 */
    .custom-scrollbar::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    /* 轨道 */
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    /* 滑块 (Light Mode) */
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #d4d4d8;
      border-radius: 99px;
      border: 2px solid transparent; 
      background-clip: content-box;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #a1a1aa;
    }
    /* 滑块 (Dark Mode) */
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #3f3f46;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #52525b;
    }
    /* 角落 */
    .custom-scrollbar::-webkit-scrollbar-corner {
      background: transparent;
    }
  `}</style>
);

const ThemeToggle = ({ theme, setTheme }) => {
  const modes = [
    { id: 'light', icon: Sun },
    { id: 'system', icon: Monitor },
    { id: 'dark', icon: Moon },
  ];

  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full border border-zinc-200 dark:border-zinc-700">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setTheme(mode.id)}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${theme === mode.id
            ? 'bg-white dark:bg-zinc-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
        >
          <mode.icon className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
};

const LangToggle = ({ lang, setLang }) => (
  <button
    onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
    className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-small text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
  >
    <Languages className="w-3.5 h-3.5" />
    <span>{lang === 'zh' ? 'CN' : 'EN'}</span>
  </button>
);

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultHtml, setResultHtml] = useState(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('system');
  const [lang, setLang] = useState('zh');

  const t = TRANSLATIONS[lang];

  const [config, setConfig] = useState({
    name: APP_DEFAULTS.name,
    shortName: APP_DEFAULTS.shortName,
    brand: APP_DEFAULTS.brand,
    bg: APP_DEFAULTS.bg,
    fg: APP_DEFAULTS.fg
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t) => {
      const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };
    applyTheme(theme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (theme === 'system') applyTheme('system'); };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toInputColor = (hex) => {
    if (!hex) return "#000000";
    if (hex.length > 7 && hex.startsWith("#")) return hex.slice(0, 7);
    return hex;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResultHtml(null);
    }
  };

  const generateHtmlSnippet = () => {
    return `<!-- PWA & Icons -->
<meta name="theme-color" content="${config.brand}">

<!-- Favicon -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/icons/icon-32.png" sizes="32x32">

<!-- Mobile App -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", config.name);
    formData.append("short_name", config.shortName);
    formData.append("brand", config.brand);
    formData.append("bg", config.bg);
    formData.append("fg", config.fg);

    try {
      const res = await fetch("/api/generate", { method: "POST", body: formData });
      if (!res.ok) throw new Error(t.error);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.shortName.replace(/\s+/g, '-').toLowerCase()}-icons.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setResultHtml(generateHtmlSnippet());

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!resultHtml) return;
    navigator.clipboard.writeText(resultHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResultHtml(null);
    setConfig({
      name: APP_DEFAULTS.name,
      shortName: APP_DEFAULTS.shortName,
      brand: APP_DEFAULTS.brand,
      bg: APP_DEFAULTS.bg,
      fg: APP_DEFAULTS.fg
    });
  };

  const CompactInput = ({ label, value, onChange, placeholder }) => (
    <div className="group relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full pl-2 pr-2 pt-5 pb-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 rounded-t-lg focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:border-indigo-500 outline-none transition-all placeholder-transparent text-zinc-800 dark:text-zinc-200"
        placeholder={placeholder}
      />
      <label className="absolute left-2 top-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-indigo-500">
        {label}
      </label>
    </div>
  );

  const MinimalColor = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group">
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{value}</span>
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-600 shrink-0 ring-1 ring-black/5 dark:ring-white/5 cursor-pointer hover:scale-110 transition-transform">
          <input
            type="color"
            value={toInputColor(value)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 m-0 cursor-pointer appearance-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans flex flex-col items-center lg:p-4 lg:px-8 lg:py-0 transition-colors duration-500">

      <ScrollbarStyles />

      {/* 顶部占位符 */}
      <div className="hidden lg:block flex-1 w-full" />

      {/* Main Card */}
      <div className="w-full max-w-6xl h-auto min-h-screen lg:min-h-0 lg:h-[88vh] bg-white dark:bg-zinc-900 lg:rounded-[2rem] shadow-none lg:shadow-2xl lg:shadow-zinc-200/50 lg:dark:shadow-black/80 overflow-hidden border-none lg:border border-zinc-100 dark:border-zinc-800 transition-all duration-500 flex flex-col">

        {/* Header */}
        <header className="shrink-0 px-6 lg:px-8 py-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30 lg:static">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-900 font-bold text-sm shadow-lg">IF</div>
            <div>
              <h1 className="font-bold text-base leading-none tracking-tight">{t.title}</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 font-medium tracking-wide uppercase">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-3">
            {preview && (
              <button onClick={resetAll} className="p-2 text-zinc-400 hover:text-red-500 transition-colors" title={t.reset}>
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <LangToggle lang={lang} setLang={setLang} />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">

          {/* === 左侧专栏：视觉预览 === */}
          <div className="w-full lg:w-[420px] xl:w-[480px] p-8 bg-zinc-50/80 dark:bg-black/20 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800 flex flex-col relative shrink-0">

            <div className="flex-1 flex flex-col items-center justify-center gap-8 min-h-[350px]">

              <div className="relative w-full max-w-[320px] aspect-square group shrink-0">

                {/* 棋盘格背景 */}
                <div
                  className="absolute inset-0 rounded-[2.5rem] overflow-hidden opacity-30 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  style={{
                    backgroundImage: `
                                    linear-gradient(45deg, #a1a1aa 25%, transparent 25%), 
                                    linear-gradient(-45deg, #a1a1aa 25%, transparent 25%), 
                                    linear-gradient(45deg, transparent 75%, #a1a1aa 75%), 
                                    linear-gradient(-45deg, transparent 75%, #a1a1aa 75%)
                                `,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
                  }}
                ></div>

                {/* 背景色层 */}
                <div
                  className="absolute inset-0 rounded-[2.5rem] shadow-2xl transition-colors duration-300 z-10"
                  style={{ backgroundColor: preview ? config.bg : 'transparent' }}
                ></div>

                {/* Mask 图标层 */}
                {preview ? (
                  <div
                    className="absolute inset-0 transition-colors duration-300 z-20"
                    style={{
                      backgroundColor: config.fg,
                      maskImage: `url(${preview})`,
                      maskSize: '60%',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: `url(${preview})`,
                      WebkitMaskSize: '60%',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 pointer-events-none">
                    <div className="p-4 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-zinc-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{t.clickToUpload}</span>
                    </div>
                  </div>
                )}

                {/* 
                            原始 SVG 悬浮窗:
                            - 尺寸: w-20 h-20 (80px)
                            - 背景: bg-white/90 + backdrop-blur-md (玻璃拟态, 90%透明度)
                            - 网格: 使用 rgba 颜色，适配浅色和深色半透明背景
                        */}
                {preview && (
                  <div className="absolute -top-6 -left-6 z-30 transition-all duration-300 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-2 pointer-events-none">
                    <div
                      className="w-20 h-20 p-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl flex items-center justify-center bg-white/90 dark:bg-zinc-800/50 backdrop-blur-md overflow-hidden"
                      style={{
                        backgroundImage: `
                                            linear-gradient(45deg, rgba(161, 161, 170, 0.2) 25%, transparent 25%), 
                                            linear-gradient(-45deg, rgba(161, 161, 170, 0.2) 25%, transparent 25%), 
                                            linear-gradient(45deg, transparent 75%, rgba(161, 161, 170, 0.2) 75%), 
                                            linear-gradient(-45deg, transparent 75%, rgba(161, 161, 170, 0.2) 75%)
                                        `,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      <img src={preview} alt="Raw" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}

                {/* 全屏点击区域 */}
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
                  title={t.clickToUpload}
                />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">{t.uploadTitle}</h3>
                <p className="text-xs text-zinc-400 mt-1">{t.uploadDesc}</p>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-xl shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${!file
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
                  : loading
                    ? 'bg-zinc-900 dark:bg-indigo-600 cursor-wait'
                    : 'bg-zinc-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500'
                  }`}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
                {loading ? t.processing : t.generate}
              </button>
            </div>
          </div>

          {/* === 右侧专栏 === */}
          <div className="flex-1 flex flex-col h-auto lg:h-full bg-white dark:bg-zinc-900 min-w-0">

            {/* 1. 配置表单 */}
            <div className={`transition-all duration-500 ease-in-out shrink-0 h-auto border-b border-zinc-100 dark:border-zinc-800 ${resultHtml ? 'p-6 bg-zinc-50/50 dark:bg-black/20' : 'p-8 bg-white dark:bg-zinc-900'}`}>

              <div className={`grid gap-6 transition-all duration-500 ${resultHtml
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 max-w-xl mx-auto lg:pt-10'
                }`}>

                {/* Meta Group */}
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase">{t.appInfo}</h3>
                  </div>
                  <div className="space-y-3">
                    <CompactInput label={t.fullName} value={config.name} onChange={(v) => setConfig({ ...config, name: v })} placeholder="My App" />
                    <CompactInput label={t.shortName} value={config.shortName} onChange={(v) => setConfig({ ...config, shortName: v })} placeholder="App" />
                  </div>
                </div>

                {/* Style Group */}
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase">{t.styleConfig}</h3>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800/50 p-2 space-y-1">
                    <MinimalColor label={t.browserTheme} value={config.brand} onChange={(v) => setConfig({ ...config, brand: v })} />
                    <div className="h-px bg-zinc-200/50 dark:bg-zinc-700/50 mx-2 my-1"></div>
                    <MinimalColor label={t.iconBg} value={config.bg} onChange={(v) => setConfig({ ...config, bg: v })} />
                    <MinimalColor label={t.logoFill} value={config.fg} onChange={(v) => setConfig({ ...config, fg: v })} />
                  </div>
                </div>

              </div>
            </div>

            {/* 2. 代码结果区域 */}
            <div className="flex-1 flex flex-col min-h-0 relative bg-zinc-50 dark:bg-black/40">

              <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">{t.htmlTitle}</span>
                </div>
                {resultHtml && (
                  <button
                    onClick={copyToClipboard}
                    className="px-2.5 py-1 text-[10px] font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? t.copied : t.copy}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-zinc-50 dark:bg-[#0d0d0d] transition-colors duration-300">
                {resultHtml ? (
                  <pre className="text-xs font-mono leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre">
                    <code dangerouslySetInnerHTML={{
                      __html: resultHtml
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-zinc-400 dark:text-zinc-500 italic">$1</span>')
                        .replace(/&lt;([a-z-]+)/g, '&lt;<span class="text-rose-600 dark:text-rose-400">$1</span>')
                        .replace(/&lt;\/([a-z-]+)/g, '&lt;/<span class="text-rose-600 dark:text-rose-400">$1</span>')
                        .replace(/ ([a-z-]+)=/g, ' <span class="text-indigo-600 dark:text-indigo-400">$1</span>=')
                        .replace(/"(.*?)"/g, '"<span class="text-emerald-600 dark:text-emerald-400">$1</span>"')
                    }} />
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 select-none opacity-50">
                    <Terminal className="w-10 h-10 mb-3" />
                    <span className="text-xs font-medium uppercase tracking-widest">{t.waiting}</span>
                    <span className="text-[10px] mt-1">{t.waitingDesc}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 px-6 py-2 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 flex flex-wrap gap-x-4">
                <span className="font-bold text-zinc-500 dark:text-zinc-500">{t.tip}:</span>
                <span>{t.tipDesc}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 底部页脚 */}
      <div className="shrink-0 w-full text-center text-[10px] text-zinc-400 dark:text-zinc-600 font-mono py-8 mt-2 lg:-mt-4 lg:py-0 lg:flex-1 lg:flex lg:items-center lg:justify-center">

        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 lg:translate-y-2">
          {/* 版权 & GitHub 仓库 */}
          <div className="flex items-center gap-1.5">
            <span className="opacity-50">©2025</span>
            <a
              href="https://github.com/sinspired"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors font-bold capitalize tracking-wider"
            >
              sinspired
            </a>
          </div>

          {/* 分隔符 (仅在桌面端显示) */}
          <span className="hidden lg:block opacity-30 text-zinc-400">|</span>

          {/* 项目链接 & 版本 */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/sinspired/icon-forge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <span className="font-medium">icon-forge</span>
            </a>
            <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <span className="opacity-40 uppercase tracking-tighter">v1.0.0</span>
          </div>

        </div>
      </div>
      
    </div>
  );
}