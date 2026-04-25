const LABEL_STYLE = {
    fontSize: 11,
    fontWeight: 500,
    color: '#616161',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
    fontFamily: 'Inter, sans-serif',
};

const INPUT_BASE = {
    background: '#0F0F0F',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 13,
    padding: '9px 12px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    transition: 'border-color 0.15s',
    resize: 'none',
    boxSizing: 'border-box',
};

const INPUT_ERROR = {
    borderColor: 'rgba(239,68,68,0.5)',
};

export function Input({ label, error, as = 'input', style: extraStyle = {}, className = '', ...props }) {
    const Tag = as;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
            {label && <label style={LABEL_STYLE}>{label}</label>}
            <Tag
                style={{
                    ...INPUT_BASE,
                    ...(error ? INPUT_ERROR : {}),
                    ...extraStyle,
                }}
                className={className}
                {...props}
            />
            {error && (
                <p style={{ fontSize: 12, color: '#F87171', margin: 0, fontFamily: 'Inter, sans-serif' }}>{error}</p>
            )}
        </div>
    );
}

export function Select({ label, error, style: extraStyle = {}, className = '', children, ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
            {label && <label style={LABEL_STYLE}>{label}</label>}
            <select
                style={{
                    ...INPUT_BASE,
                    ...(error ? INPUT_ERROR : {}),
                    ...extraStyle,
                    appearance: 'none',
                    cursor: 'pointer',
                }}
                className={className}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p style={{ fontSize: 12, color: '#F87171', margin: 0, fontFamily: 'Inter, sans-serif' }}>{error}</p>
            )}
        </div>
    );
}
