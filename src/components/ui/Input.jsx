export function Input({ label, error, className = '', as = 'input', ...props }) {
    const Tag = as;
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-[10px] font-bold tracking-[.12em] uppercase text-[#4D6B8A]">
                    {label}
                </label>
            )}
            <Tag
                className={`w-full bg-[#03091A] border rounded-xl text-[#F0F6FF] text-sm px-3.5 py-3 outline-none transition-colors placeholder:text-[#2D4D7E] resize-none
                    ${error ? 'border-[#EF4444]/60 focus:border-[#EF4444]' : 'border-[#1E3560] focus:border-[#2563EB]/60'}
                    ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-[#F87171]">{error}</p>}
        </div>
    );
}

export function Select({ label, error, className = '', children, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-[10px] font-bold tracking-[.12em] uppercase text-[#4D6B8A]">
                    {label}
                </label>
            )}
            <select
                className={`w-full bg-[#03091A] border rounded-xl text-[#F0F6FF] text-sm px-3.5 py-3 outline-none transition-colors
                    ${error ? 'border-[#EF4444]/60' : 'border-[#1E3560] focus:border-[#2563EB]/60'}
                    ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-xs text-[#F87171]">{error}</p>}
        </div>
    );
}
