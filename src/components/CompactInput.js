"use client";
export default function CompactInput({ label, value, onChange, placeholder }) {
    return (
        <div className="group relative w-full h-12">
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="peer w-full h-full pl-3 pr-3 pt-4 pb-1 text-sm bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 rounded-lg  focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:border-indigo-500 outline-none transition-all placeholder-transparent text-zinc-800 dark:text-zinc-200"
                placeholder={placeholder}
            />
            <label className="absolute left-3 top-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-indigo-500 pointer-events-none">
                {label}
            </label>
        </div>
    )
}