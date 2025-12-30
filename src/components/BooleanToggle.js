'use client'

export default function BooleanToggle({ label, value, onChange }) {
    return (
        <div className='flex items-center justify-between gap-1 px-1'>
            <span className='text-xs text-zinc-400 dark:text-zinc-400 uppercase'>
                {label}
            </span>

            <button
                onClick={() => onChange(!value)}
                className={`
                    w-10 h-5 rounded-full transition-all relative
                    ${value ? 'bg-rose-500 dark:bg-rose-500' : 'bg-zinc-100 dark:bg-zinc-800'}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all
                        ${value ? 'translate-x-5' : ''}
                    `}
                />
            </button>
        </div>
    )
}
