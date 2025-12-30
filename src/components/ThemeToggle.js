"use client";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ThemeToggle({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const modes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  const currentMode = modes.find(m => m.id === theme) || modes[2];
  const Icon = currentMode.icon; // 提取为大写开头的变量

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-zinc-700 dark:text-zinc-300"
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="capitalize">{theme}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {modes.map((m) => {
              const MIcon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => { setTheme(m.id); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    theme === m.id 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MIcon className="w-3.5 h-3.5" /> {m.label}
                  </div>
                  {theme === m.id && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}