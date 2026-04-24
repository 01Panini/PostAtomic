export function Button({ children, variant = 'primary', size = 'md', className = '', loading, ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';

    const variants = {
        primary:   'bg-[#2563EB] text-white shadow-[0_4px_24px_rgba(37,99,235,0.45)] hover:shadow-[0_8px_36px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 active:scale-[.98]',
        secondary: 'bg-white/[.04] border border-[#1E3560] text-[#8BA8C8] hover:bg-[#2563EB]/[.1] hover:border-[#2563EB]/40 hover:text-[#60A5FA] active:scale-[.97]',
        ghost:     'text-[#8BA8C8] hover:text-[#F0F6FF] hover:bg-white/[.04]',
        danger:    'bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#F87171] hover:bg-[#EF4444]/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-3 text-sm',
        lg: 'px-7 py-4 text-base',
        xl: 'w-full px-6 py-4 text-base',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && (
                <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin flex-shrink-0" />
            )}
            {children}
        </button>
    );
}
