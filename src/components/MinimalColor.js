"use client";

import { toInputColor } from "@/lib/utils";

export default function MinimalColor({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between h-12 px-3 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {label}
            </span>

            <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                    {value}
                </span>

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
}