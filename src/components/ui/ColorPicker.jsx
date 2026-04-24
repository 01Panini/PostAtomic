export function ColorPicker({ label, value, onChange }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <span className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">{label}</span>}
            <div className="flex items-center gap-2 bg-[#060814] border border-[#162035] rounded-xl px-3 py-2.5 focus-within:border-blue transition-colors">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full rounded-lg" style={{ background: value }} />
                </div>
                <input value={value} onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-transparent text-text-1 text-sm font-mono outline-none uppercase"
                    placeholder="#000000" maxLength={7} />
            </div>
        </div>
    );
}
