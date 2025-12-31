"use client";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ThemeToggle({ theme, setTheme }) {
  const [open, setOpen] = useState(false);

  const modes = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ];

  const currentMode = modes.find(m => m.id === theme) || modes[2];
  const Icon = currentMode.icon;

  return (
    <div className="relative -mr-3 md:mr-0">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-1 px-2 py-1.5 rounded-full 
                   bg-zinc-100 dark:bg-zinc-800 
                   border border-zinc-200 dark:border-zinc-700 
                   hover:bg-zinc-200 dark:hover:bg-zinc-700 
                   transition-all"
      >
        <Icon className={"w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 "} />

        <ChevronDown
          className={`w-2.5 h-2.5 text-zinc-400 transition-transform duration-200 
                      ${open ? "rotate-180" : "opacity-40 group-hover:opacity-100"}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-zinc-900 
                          border border-zinc-200 dark:border-zinc-800 
                          rounded-xl shadow-xl z-50 py-1 overflow-hidden 
                          animate-in fade-in zoom-in-95 duration-150">
            {modes.map(m => {
              const MIcon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setTheme(m.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 
                              text-[10px] transition-colors ${theme === m.id
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <MIcon className="w-3 h-3" />
                    <span className="capitalize">{m.id}</span>
                  </div>
                  {theme === m.id && (
                    <Check className="w-2.5 h-2.5 text-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}