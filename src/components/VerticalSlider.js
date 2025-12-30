"use client";

import React from "react";

export default function VerticalSlider({ label, value, min = 0.2, max = 3, step = 0.05, onChange }) {
  
  const marks = [
    { val: 0.65, label: '65%' },
    { val: 1.0, label: '100%' },
    { val: 1.5, label: '150%' },
    { val: 2.0, label: '200%' },
    { val: 2.5, label: '250%' },
  ];

  const getPosition = (val) => {
    return ((val - min) / (max - min)) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors rounded-lg w-10 group relative">
      
      {/* 标签 */}
      <span className="text-[10px] font-mono text-zinc-400 text-center select-none uppercase">
        {label}
      </span>

      {/* 滑块容器 */}
      <div className="relative h-40 lg:h-54 xl:h-70 w-full flex items-center justify-center">
        
        {/* === 快捷标记层 (Ticks) - 改为从中心向右定位 === */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 h-full -translate-x-px">
          {marks.map((mark) => (
            <div
              key={mark.val}
              onClick={() => onChange(mark.val)}
              className="absolute left-3 w-max flex items-center gap-1 cursor-pointer group/mark z-10"
              style={{ bottom: `${getPosition(mark.val)}%`, transform: 'translateY(50%)' }}
            >
              {/* 修改点 3: 交换顺序，先显示刻度线(靠近滑块)，再显示文字 */}
              
              {/* 刻度线 */}
              <div className={`h-0.5 transition-all duration-300 ${
                  Math.abs(value - mark.val) < 0.01 
                  ? "w-2 h-0.7 bg-zinc-600 dark:bg-zinc-400" 
                  : "w-1 h-0.4 bg-zinc-300 dark:bg-zinc-600 group-hover/mark:w-2 group-hover/mark:bg-zinc-400"
                }`} 
              />

               {/* 文字提示 */}
              <span className={`text-[9px] font-mono transition-colors ${
                  Math.abs(value - mark.val) < 0.01 
                  ? "text-zinc-600 dark:text-zinc-300 font-bold" 
                  : "text-zinc-300 dark:text-zinc-600 opacity-0 group-hover/mark:opacity-100"
                }`}>
                {mark.label}
              </span>

            </div>
          ))}
        </div>

        {/* === 滑块 Input === */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onDoubleClick={() => onChange(1.0)}
          title="Double click to reset to 100%"
          className="range-slider absolute w-40 lg:w-54 xl:w-70 h-6 -rotate-90 origin-center z-20"
        />
      </div>

      {/* 数值 */}
      <span className="text-[10px] font-mono text-zinc-400 text-center w-8 select-none">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}