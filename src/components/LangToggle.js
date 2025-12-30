"use client";

import { Languages } from "lucide-react";

export default function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(l => (l === "zh" ? "en" : "zh"))}
      className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      <Languages className="w-3.5 h-3.5" />
      <span className="text-[9px]">{lang === "zh" ? "CN" : "EN"}</span>
    </button>
  );
}