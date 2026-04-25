const SPIN = (
    <span style={{
        width: 14, height: 14,
        border: '2px solid rgba(0,0,0,0.2)',
        borderTopColor: '#050505',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        display: 'inline-block',
        flexShrink: 0,
    }} />
);

const SPIN_LIGHT = (
    <span style={{
        width: 14, height: 14,
        border: '2px solid rgba(255,255,255,0.15)',
        borderTopColor: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        display: 'inline-block',
        flexShrink: 0,
    }} />
);

const BASE = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 0.15s, background 0.15s',
    outline: 'none',
};

const VARIANTS = {
    primary: {
        background: '#FFFFFF',
        color: '#050505',
        borderRadius: 9999,
    },
    secondary: {
        background: 'rgba(255,255,255,0.05)',
        color: '#A8A8A8',
        borderRadius: 9999,
        border: '1px solid rgba(255,255,255,0.1)',
    },
    ghost: {
        background: 'transparent',
        color: '#616161',
        borderRadius: 8,
    },
    danger: {
        background: 'rgba(239,68,68,0.08)',
        color: '#F87171',
        borderRadius: 9999,
        border: '1px solid rgba(239,68,68,0.2)',
    },
};

const SIZES = {
    sm: { padding: '6px 14px', fontSize: 12 },
    md: { padding: '9px 20px', fontSize: 13 },
    lg: { padding: '12px 28px', fontSize: 14 },
    xl: { padding: '12px 0', fontSize: 14, width: '100%' },
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading,
    style: extraStyle = {},
    className = '',
    ...props
}) {
    const isLight = variant === 'primary';

    return (
        <button
            style={{
                ...BASE,
                ...VARIANTS[variant],
                ...SIZES[size],
                opacity: (loading || props.disabled) ? 0.55 : 1,
                cursor: (loading || props.disabled) ? 'not-allowed' : 'pointer',
                ...extraStyle,
            }}
            disabled={loading || props.disabled}
            className={className}
            {...props}
        >
            {loading && (isLight ? SPIN : SPIN_LIGHT)}
            {children}
        </button>
    );
}
