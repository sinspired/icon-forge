"use client";

import { Ban, Image as ImageIcon, Palette } from "lucide-react";
import { toInputColor } from "@/lib/utils";

export default function MinimalColor({ 
  label, 
  value, 
  onChange, 
  allowTransparent = false, 
  allowOriginal = false,
  disabled = false
}) {
  const isTransparent = value === 'transparent';
  const isOriginal = value === 'original';
  const isColor = !isTransparent && !isOriginal;

  const handleColorChange = (e) => {
    if (disabled) return;
    onChange(e.target.value);
  };

  return (
    <div 
      className={`
        flex items-center justify-between h-12 px-3 transition-all duration-300
        ${disabled 
          ? "opacity-40 grayscale cursor-not-allowed bg-zinc-50 dark:bg-zinc-900/50" 
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 group"
        }
      `}
    >
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </span>

      <div className={`flex items-center gap-2 ${disabled ? "pointer-events-none" : ""}`}>
        {/* 状态文字 */}
        <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase mr-1">
          {disabled ? 'N/A' : (isTransparent ? 'Transparent' : isOriginal ? 'Original' : value)}
        </span>

        {/* 按钮组 */}
        <div className={`
          flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5 border border-zinc-200 dark:border-zinc-700
          ${disabled ? "border-zinc-100 dark:border-zinc-800 bg-transparent" : ""}
        `}>
            
          {allowTransparent && (
            <button
              onClick={() => onChange('transparent')}
              disabled={disabled}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isTransparent 
                  ? "bg-white dark:bg-zinc-600 text-red-500 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <Ban className="w-3 h-3" />
            </button>
          )}

          {allowOriginal && (
            <button
              onClick={() => onChange('original')}
              disabled={disabled}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isOriginal 
                  ? "bg-white dark:bg-zinc-600 text-indigo-500 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
            </button>
          )}

          <div className={`relative w-6 h-6 rounded-full overflow-hidden transition-all ${
             isColor && !disabled ? "ring-1 ring-zinc-400 dark:ring-zinc-500 scale-100 mx-0.5" : "scale-75 opacity-50"
          }`}>
            <div 
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: isColor ? value : '#000000' }} 
            >
                {!isColor && <div className="w-full h-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center"><Palette className="w-3 h-3 text-zinc-500"/></div>}
            </div>

            <input
              type="color"
              value={toInputColor(isColor ? value : '#000000')} 
              onChange={handleColorChange}
              disabled={disabled}
              className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}