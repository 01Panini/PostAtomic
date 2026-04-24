import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';
import { useUsage } from '../hooks/useUsage';

function AtomLogo({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <defs>
                <linearGradient id="ws-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#ws-bg)" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)" />
            <circle cx="16" cy="16" r="2.4" fill="white" />
        </svg>
    );
}

/* ── Nav icons (no emojis) ── */
const ICON_MACHINE = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const ICON_HISTORY = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const ICON_SETTINGS = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const ICON_LOGOUT = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function NavItem({ to, icon, label, end }) {
    return (
        <NavLink to={to} end={end}
            className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                        ? 'bg-[#2563EB]/[.12] text-[#60A5FA] border border-[#2563EB]/20'
                        : 'text-[#4D6B8A] hover:text-[#8BA8C8] hover:bg-white/[.03]'
                }`
            }>
            <span className="flex-shrink-0">{icon}</span>
            {label}
        </NavLink>
    );
}

export default function WorkspacePage() {
    const { user, tenant, logout } = useAuth();
    const brand = useBrand();
    const { dailyUsed, dailyLimit, plan } = useUsage();
    const navigate = useNavigate();

    const tenantName = brand?.tenantMeta?.name || tenant?.name || 'Workspace';
    const logoUrl = brand?.tenantMeta?.logoUrl;

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const dailyPct = Math.min(((dailyUsed || 0) / (dailyLimit || 3)) * 100, 100);
    const isAtLimit = (dailyUsed || 0) >= (dailyLimit || 3);

    return (
        <div className="flex h-screen overflow-hidden bg-void">
            {/* ── SIDEBAR ── */}
            <aside className="w-56 flex-shrink-0 bg-[#060E20] border-r border-white/[.05] flex flex-col overflow-y-auto">
                {/* Brand header */}
                <div className="p-4 border-b border-white/[.05]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {logoUrl
                                ? <img src={logoUrl} className="w-full h-full object-cover rounded-lg" alt="logo" />
                                : <AtomLogo size={32} />
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-[#F0F6FF]">{tenantName}</p>
                            <p className="text-[10px] text-[#4D6B8A] font-semibold uppercase tracking-wider">PostAtomic</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-3 py-4">
                    <p className="text-[9px] font-bold tracking-[.14em] uppercase text-[#2D4D7E] px-3 mb-2">Conteúdo</p>
                    <NavItem to="/workspace" end icon={ICON_MACHINE} label="Post Machine" />
                    <NavItem to="/workspace/dashboard" icon={ICON_HISTORY} label="Histórico" />

                    <p className="text-[9px] font-bold tracking-[.14em] uppercase text-[#2D4D7E] px-3 mt-5 mb-2">Configuração</p>
                    {user?.role === 'owner' && (
                        <NavItem to="/workspace/settings" icon={ICON_SETTINGS} label="Configurações" />
                    )}
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Daily usage + user */}
                <div className="p-4 border-t border-white/[.05] flex flex-col gap-4">
                    {/* Daily limit */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4D6B8A]">Hoje</p>
                            <p className={`text-[10px] font-bold ${isAtLimit ? 'text-[#EF4444]' : 'text-[#4D6B8A]'}`}>
                                {dailyUsed || 0}/{dailyLimit || 3}
                            </p>
                        </div>
                        <div className="h-1 bg-[#0A1628] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${dailyPct}%`, background: isAtLimit ? '#EF4444' : '#2563EB' }} />
                        </div>
                        <p className="text-[10px] text-[#4D6B8A] mt-1 capitalize">{plan || 'trial'} · renova às 00:00</p>
                    </div>

                    {/* User row */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate text-[#8BA8C8]">{user?.name}</p>
                            <p className="text-[10px] text-[#4D6B8A] truncate">{user?.email}</p>
                        </div>
                        <button onClick={handleLogout}
                            className="text-[#4D6B8A] hover:text-[#EF4444] transition-colors flex-shrink-0"
                            title="Sair">
                            {ICON_LOGOUT}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 overflow-hidden bg-[#03091A]">
                <Outlet />
            </main>
        </div>
    );
}
