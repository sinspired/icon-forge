"use client";

import { Ban, Image as ImageIcon, Palette } from "lucide-react";
import { toInputColor } from "@/lib/utils";

export default function MinimalColor({ 
  label, 
  value, 
  onChange, 
  allowTransparent = false, 
  allowOriginal = false 
}) {
  // 判断当前状态
  const isTransparent = value === 'transparent';
  const isOriginal = value === 'original';
  const isColor = !isTransparent && !isOriginal;

  // 处理颜色变更：如果用户通过取色器选色，必然切换回 Hex 模式
  const handleColorChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center justify-between h-12 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group">
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </span>

      <div className="flex items-center gap-2">
        {/* 状态文字 (仅 hover 显示，保持极简) */}
        <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase mr-1">
          {isTransparent ? 'Transparent' : isOriginal ? 'Original' : value}
        </span>

        {/* 快捷切换按钮组 */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5 border border-zinc-200 dark:border-zinc-700">
            
          {/* 1. 透明按钮 */}
          {allowTransparent && (
            <button
              onClick={() => onChange('transparent')}
              title="Transparent"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isTransparent 
                  ? "bg-white dark:bg-zinc-600 text-red-500 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <Ban className="w-3 h-3" />
            </button>
          )}

          {/* 2. 原色按钮 */}
          {allowOriginal && (
            <button
              onClick={() => onChange('original')}
              title="Original Color"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isOriginal 
                  ? "bg-white dark:bg-zinc-600 text-indigo-500 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
            </button>
          )}

          {/* 3. 颜色选择器 (始终显示，激活时高亮) */}
          <div className={`relative w-6 h-6 rounded-full overflow-hidden transition-all cursor-pointer ${
             isColor ? "ring-1 ring-zinc-400 dark:ring-zinc-500 scale-100 mx-0.5" : "scale-75 opacity-50 hover:opacity-100"
          }`}>
            {/* 视觉圆点 */}
            <div 
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: isColor ? value : '#000000' }} 
            >
                {/* 如果非颜色模式，显示一个图标占位 */}
                {!isColor && <div className="w-full h-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center"><Palette className="w-3 h-3 text-zinc-500"/></div>}
            </div>

            {/* 原生 Input 覆盖 */}
            <input
              type="color"
              value={toInputColor(isColor ? value : '#000000')} 
              onChange={handleColorChange}
              className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}