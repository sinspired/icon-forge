"use client";
import { Languages } from "lucide-react";

export default function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(l => (l === "zh" ? "en" : "zh"))}
      className="relative group flex items-center px-1.5 py-1.5 rounded-full 
                 bg-zinc-100 dark:bg-zinc-800 
                 border border-zinc-200 dark:border-zinc-700 
                 hover:bg-zinc-200 dark:hover:bg-zinc-700 
                 transition-all"
    >
      <Languages className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />

      {/* 右上角语言角标 */}
      <span className="absolute -top-1 -right-3 flex items-center justify-center 
                       bg-zinc-900 dark:bg-zinc-100 
                       text-[7px] leading-none font-black 
                       text-white dark:text-zinc-900 
                       px-1 py-0.5 rounded-full shadow-sm 
                       border border-white dark:border-zinc-900">
        {lang === "zh" ? "中" : "EN"}
      </span>

      {/* Tooltip */}
      {/* <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 opacity-0 
                       group-hover:opacity-100 pointer-events-none 
                       whitespace-nowrap px-2 py-1 text-[10px] rounded 
                       bg-zinc-800 text-white dark:bg-zinc-700 
                       transition-opacity z-50">
        {lang === "zh" ? "Switch to English" : "切换到中文"}
      </span> */}
    </button>
  );
}