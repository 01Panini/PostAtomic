export function Card({ children, className = '', onClick, selected }) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border transition-all duration-200 p-5
                ${onClick ? 'cursor-pointer' : ''}
                ${selected
                    ? 'bg-blue/[.12] border-blue/50 shadow-[0_0_0_1px_rgba(0,87,183,.3)]'
                    : 'bg-white/[.02] border-[#0D1325] hover:border-[#162035]'}
                ${className}`}
        >
            {children}
        </div>
    );
}
