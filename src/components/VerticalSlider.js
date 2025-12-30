"use client";

import React from "react";

export default function VerticalSlider({ label, value, min = 0.2, max = 3, step = 0.05, onChange }) {
  return (
    <div className="flex flex-col items-center justify-center py-2 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors rounded-lg w-10 group">
      
      {/* 标签 */}
      <span className="text-[10px] font-mono text-zinc-400 text-center select-none uppercase">
        {label}
      </span>

      {/* 滑块容器 */}
      <div className="relative h-32 w-full flex items-center justify-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          // 引用 globals.css 中的类名 .range-slider
          className="range-slider absolute w-32 h-6 -rotate-90 origin-center"
        />
      </div>

      {/* 数值 */}
      <span className="text-[10px] font-mono text-zinc-400 text-center w-8 select-none">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}