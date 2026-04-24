export function Button({ children, variant = 'primary', size = 'md', className = '', loading, ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-gradient-to-br from-blue to-blue-dark text-white shadow-[0_4px_28px_rgba(0,87,183,.42)] hover:shadow-[0_8px_36px_rgba(0,87,183,.52)] hover:-translate-y-0.5 active:scale-[.98]',
        secondary: 'bg-white/[.04] border border-[#162035] text-text-2 hover:bg-blue/[.14] hover:border-blue/40 hover:text-blue-light active:scale-[.97]',
        ghost: 'text-text-2 hover:text-text-1 hover:bg-white/[.04]',
        danger: 'bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-3 text-sm',
        lg: 'px-7 py-4 text-base',
        xl: 'w-full px-6 py-4 text-base',
    };
    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
            {loading && <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />}
            {children}
        </button>
    );
}
