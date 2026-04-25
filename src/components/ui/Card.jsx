export function Card({ children, className = '', onClick, selected, style: extraStyle = {} }) {
    return (
        <div
            onClick={onClick}
            style={{
                borderRadius: 12,
                border: selected
                    ? '1px solid rgba(12,201,129,0.35)'
                    : '1px solid rgba(255,255,255,0.06)',
                background: selected
                    ? 'rgba(12,201,129,0.06)'
                    : 'rgba(255,255,255,0.02)',
                padding: 16,
                transition: 'all 0.15s',
                cursor: onClick ? 'pointer' : 'default',
                ...extraStyle,
            }}
            className={className}
        >
            {children}
        </div>
    );
}
