"use client";

import { useState, useEffect } from "react";
import { Upload, Download, Loader2, AlertTriangle, Terminal, RotateCcw } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import { TRANSLATIONS } from "@/i18n/translations";
import { useIconForge } from "@/hooks/useIconForge";
import CompactInput from "@/components/CompactInput";
import MinimalColor from "@/components/MinimalColor";
import { highlightHtml } from "@/lib/utils";
import VerticalSlider from "@/components/VerticalSlider";
import CopyButton from "@/components/CopyButton";


export default function IconForgeApp() {
  const [theme, setTheme] = useState('system');
  const [lang, setLang] = useState('zh');
  const t = TRANSLATIONS[lang];

  const {
    file, preview, loading, resultHtml, config, isSvg,
    setConfig, handleFileChange, handleSubmit, resetAll
  } = useIconForge(t);

  // 背景处理：
  // 1. 如果没有预览图 (!preview) -> 强制透明
  // 2. 如果用户配置为透明 -> 强制透明
  // 3. 否则 -> 显示配置的颜色
  const bgStyle = (!preview || config.bg === 'transparent')
    ? { backgroundColor: 'transparent' }
    : { backgroundColor: config.bg };

  // 图标处理
  const isOriginalColor = config.fg === 'original';

  // 主题应用逻辑
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (mode) => {
      const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
    };
    applyTheme(theme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (theme === 'system') applyTheme('system'); };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans flex flex-col items-center lg:p-4 lg:px-8 lg:py-0 transition-colors duration-500">
      <div className="hidden lg:block flex-1 w-full" />

      {/* Main Card */}
      <div className="w-full max-w-6xl h-auto min-h-screen lg:min-h-0 lg:h-[88vh] bg-white dark:bg-zinc-900 lg:rounded-4xl shadow-none lg:shadow-2xl lg:shadow-zinc-200/50 lg:dark:shadow-black/80 overflow-hidden border-none lg:border border-zinc-100 dark:border-zinc-800 transition-all duration-500 flex flex-col">

        {/* Header */}
        <header className="shrink-0 px-6 py-3 lg:px-8 lg:py-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30 lg:static">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-900 font-bold text-sm shadow-lg">IF</div>
            <div>
              <h1 className="font-bold text-base leading-none tracking-tight">{t.title}</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5 font-medium tracking-wide uppercase">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-5">
            <LangToggle lang={lang} setLang={setLang} />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">

          {/* 左侧：视觉预览 */}
          <div className="w-full lg:w-115 xl:w-140 p-8 bg-zinc-50/80 dark:bg-black/20 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800 flex flex-col relative shrink-0">
            {/* 重置按钮 */}
            {preview && (
              <button onClick={resetAll} className="absolute top-4 right-4 lg:top-8 lg:right-8  text-indigo-400 hover:text-red-500 transition-colors" title={t.reset}>
                <RotateCcw className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            )}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 lg:gap-6 min-h-[400px]">
              {/* === 预览图加缩放手柄容器 === */}
              <div className="relative w-full flex items-center justify-center">

                {/* 左侧预览图*/}
                <div className="relative w-full max-w-50 lg:max-w-70 xl:max-w-88 aspect-square group shrink-0 z-10">
                  {/* 棋盘格背景 */}
                  <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden opacity-30 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    style={{
                      backgroundImage: `linear-gradient(45deg, #a1a1aa 25%, transparent 25%), linear-gradient(-45deg, #a1a1aa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #a1a1aa 75%), linear-gradient(-45deg, transparent 75%, #a1a1aa 75%)`,
                      backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
                    }}
                  />

                  {/* 背景色层 */}
                  <div className="absolute inset-0 rounded-[2.5rem] shadow-2xl transition-colors duration-300 z-10"
                    style={bgStyle}
                  />

                  {/* Mask 图标层 */}
                  {preview ? (
                    isOriginalColor ? (
                      // 模式 A: 原色模式
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden rounded-[2.5rem]">
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            width: `${config.goldenRatio * 100}%`,
                            height: `${config.goldenRatio * 100}%`,
                            maxWidth: 'none',
                            maxHeight: 'none',
                            objectFit: 'contain'
                          }}
                          className="drop-shadow-sm transition-all duration-300"
                        />
                      </div>
                    ) : (
                      // 模式 B: 单色模式
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden rounded-[2.5rem]">
                        <div
                          className="transition-all duration-300"
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: config.fg,
                            maskImage: `url(${preview})`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: `${config.goldenRatio * 100}%`,
                            WebkitMaskImage: `url(${preview})`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: `${config.goldenRatio * 100}%`,
                          }}
                        />
                      </div>
                    )
                  ) : (
                    // 空状态
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 pointer-events-none text-zinc-400">
                      <div className="p-4 bg-white/80 dark:bg-black/60 backdrop-blur-xs rounded-2xl flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs font-bold uppercase tracking-widest">{t.clickToUpload}</span>
                      </div>
                    </div>
                  )}

                  {/* 原始 SVG 悬浮窗 */}
                  {preview && (
                    <div className="flex flex-col items-center gap-1 absolute -top-10 -left-10 lg:-top-10 lg:-left-10 z-30 transition-all duration-300 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-2 pointer-events-none">
                      <div className="w-20 h-20 p-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl flex items-center justify-center bg-white/90 dark:bg-zinc-800/50 backdrop-blur-md overflow-hidden"
                        style={{
                          backgroundImage: `linear-gradient(45deg, rgba(161, 161, 170, 0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(161, 161, 170, 0.2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(161, 161, 170, 0.2) 75%), linear-gradient(-45deg, transparent 75%, rgba(161, 161, 170, 0.2) 75%)`,
                          backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                      >
                        <img src={preview} alt="Raw" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 opacity-70 shadow-xl shadow-indigo-500/10">
                        {t.rawImage}
                      </span>
                    </div>
                  )}

                  <input type="file" accept=".svg, .png, .jpg, .jpeg, .webp" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40" />
                </div>

                {/* 仅在有预览时显示缩放 */}
                {preview && (
                  <div className="absolute right-1 lg:right-2 top-1/2 -translate-y-1/2 z-20">
                    <VerticalSlider
                      label={t.scale || "Scale"}
                      value={config.goldenRatio}
                      onChange={(v) => setConfig({ ...config, goldenRatio: v })}
                    />
                  </div>
                )}
              </div>

              <div className="text-center">
                {/* 标题或说明 */}
                {/* <h3 className="text-base font-bold text-zinc-900 dark:text-white">{t.uploadTitle}</h3> */}
                <p className="text-xs text-zinc-400">{t.uploadDesc}</p>
              </div>

              {/* === 非 SVG 格式提示 === */}
              {file && !isSvg && (
                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-3 text-left">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {t.bitmapDetected}
                    </p>
                    <p className="text-[10px] text-amber-600/80 dark:text-amber-500/80 leading-relaxed">
                      {t.bitmapTip}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto lg:pt-6">
              <button onClick={handleSubmit} disabled={!file || loading}
                className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-xl shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${!file ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none' : loading ? 'bg-zinc-900 dark:bg-indigo-600 cursor-wait' : 'bg-zinc-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500'
                  }`}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
                {loading ? t.processing : t.generate}
              </button>
            </div>
          </div>

          {/* 右侧：配置与代码 */}
          <div className="flex-1 flex flex-col h-auto lg:h-full bg-white dark:bg-zinc-900 min-w-0">

            {/* 配置组 */}
            <div
              className={`transition-all duration-500 shrink-0 h-auto border-b border-zinc-100 dark:border-zinc-800
                ${resultHtml ? 'p-6 bg-zinc-50/50 dark:bg-black/20' : 'p-8 bg-white dark:bg-zinc-900'}`
              }
            >
              <div className={`grid gap-8 transition-all duration-500 
                ${resultHtml ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 max-w-2xl mx-auto'}`}
              >
                {/* Meta Group - 占据 5/12 宽度 */}
                <div className={`space-y-4 min-w-0 ${resultHtml ? 'lg:col-span-5' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase">{t.appInfo}</h3>
                  </div>
                  {/* 使用相同的容器感，确保左右对齐 */}
                  <div className="flex flex-col gap-3">
                    <CompactInput label={t.fullName} value={config.name} onChange={v => setConfig({ ...config, name: v })} placeholder="My App" />
                    <CompactInput label={t.shortName} value={config.shortName} onChange={v => setConfig({ ...config, shortName: v })} placeholder="App" />
                  </div>
                </div>

                {/* Style Group - 占据 7/12 宽度 */}
                <div className={`space-y-4 min-w-0 ${resultHtml ? 'lg:col-span-7' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase">{t.styleConfig}</h3>
                  </div>

                  {/* 移除 p-2，改用 overflow-hidden 确保内部组件 hover 背景能填满圆角 */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden flex flex-col">
                    <MinimalColor label={t.browserTheme} value={config.brand} onChange={v => setConfig({ ...config, brand: v })} />
                    <div className="h-px bg-zinc-200/50 dark:bg-zinc-700/50 mx-2 my-1" />
                    <MinimalColor
                      label={t.iconBg}
                      value={config.bg}
                      onChange={v => setConfig({ ...config, bg: v })}
                      allowTransparent={true} // 开启透明选项
                    />
                    {/* <div className="h-px bg-zinc-200/20 dark:bg-zinc-700/20" /> */}
                    <MinimalColor label={t.logoFill} value={config.fg} onChange={v => setConfig({ ...config, fg: v })} allowOriginal={true}
                      // 如果不是 SVG，强制禁用
                      disabled={!!file && !isSvg}
                    />
                    {/* 解释为什么被禁用了 */}
                    {file && !isSvg && (
                      <div className="px-3 pb-2 -mt-1">
                        <p className="text-[10px] text-zinc-400">
                          {t.colorTintDisabledTip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 生成的 HTML 代码 */}
            <div className="flex-1 flex flex-col min-h-0 relative bg-zinc-50 dark:bg-black/40">
              <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  <Terminal className="w-4 h-4 text-emerald-500" />{t.htmlTitle}
                </div>
                {resultHtml && (
                  <div>
                  <CopyButton text={resultHtml} />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-zinc-50 dark:bg-[#0d0d0d] transition-colors duration-300">
                {resultHtml ? (
                  <pre className="text-xs font-mono leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre">
                    <code dangerouslySetInnerHTML={{ __html: highlightHtml(resultHtml) }} />
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-500 select-none opacity-50">
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

      {/* Footer */}
      <div className="shrink-0 w-full text-center text-[10px] text-zinc-400 dark:text-zinc-600 font-mono py-8 mt-2 lg:-mt-4 lg:py-0 lg:flex-1 lg:flex lg:items-center lg:justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 lg:translate-y-2">
          <div className="flex items-center gap-1.5"><span className="opacity-50">©2025</span><a href="https://github.com/sinspired" target="_blank" className="hover:text-indigo-500 font-bold capitalize">sinspired</a></div>
          <span className="hidden lg:block opacity-30">|</span>
          <div className="flex items-center gap-3"><a href="https://github.com/sinspired/icon-forge" target="_blank" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"><span className="font-medium">icon-forge</span></a><span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" /><span className="opacity-40 uppercase">v1.0.0</span></div>
        </div>
      </div>
    </div>
  );
}
