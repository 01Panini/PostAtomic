export function Input({ label, error, className = '', as = 'input', ...props }) {
    const Tag = as;
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">{label}</label>}
            <Tag
                className={`w-full bg-[#060814] border rounded-xl text-text-1 font-[Satoshi] text-sm px-3.5 py-3 outline-none transition-colors placeholder:text-text-3 resize-none
                    ${error ? 'border-red-500/60 focus:border-red-500' : 'border-[#162035] focus:border-blue'}
                    ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

export function Select({ label, error, className = '', children, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">{label}</label>}
            <select
                className={`w-full bg-[#060814] border rounded-xl text-text-1 font-[Satoshi] text-sm px-3.5 py-3 outline-none transition-colors
                    ${error ? 'border-red-500/60' : 'border-[#162035] focus:border-blue'}
                    ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
