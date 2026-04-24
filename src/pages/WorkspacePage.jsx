import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';
import { useUsage } from '../hooks/useUsage';

function NavItem({ to, icon, label, end }) {
    return (
        <NavLink to={to} end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                    ? 'bg-blue/[.12] text-blue-light border border-blue/20'
                    : 'text-text-3 hover:text-text-2 hover:bg-white/[.03]'
                }`
            }>
            <span className="text-base leading-none">{icon}</span>
            {label}
        </NavLink>
    );
}

export default function WorkspacePage() {
    const { user, tenant, logout } = useAuth();
    const brand = useBrand();
    const { used, limit, plan } = useUsage();
    const navigate = useNavigate();

    const primaryColor = brand?.colors?.primary || '#0057B7';
    const tenantName = brand?.tenantMeta?.name || tenant?.name || 'Workspace';
    const logoUrl = brand?.tenantMeta?.logoUrl;

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-base" style={{ fontFamily: "'Satoshi',sans-serif" }}>
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 bg-surface border-r border-border flex flex-col gap-4 overflow-y-auto">
                {/* Brand header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                            style={{ background: logoUrl ? 'transparent' : primaryColor, boxShadow: logoUrl ? 'none' : `0 0 14px ${primaryColor}55` }}>
                            {logoUrl
                                ? <img src={logoUrl} className="w-full h-full object-cover" alt="logo" />
                                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" /></svg>
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-extrabold truncate text-text-1">{tenantName}</p>
                            <p className="text-[10px] text-text-3 font-bold uppercase tracking-wider">PostAtomic</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-3">
                    <p className="text-[9px] font-extrabold tracking-[.12em] uppercase text-text-3 px-3 mb-1">Conteúdo</p>
                    <NavItem to="/workspace" end icon="✦" label="Post Machine" />
                    <NavItem to="/workspace/dashboard" icon="📋" label="Histórico" />

                    <p className="text-[9px] font-extrabold tracking-[.12em] uppercase text-text-3 px-3 mt-4 mb-1">Configuração</p>
                    {user?.role === 'owner' && (
                        <NavItem to="/workspace/settings" icon="⚙️" label="Configurações" />
                    )}
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Usage + user */}
                <div className="p-4 border-t border-border flex flex-col gap-3">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-text-3">Uso</p>
                            <p className="text-[10px] text-text-3 font-bold">{used}/{limit}</p>
                        </div>
                        <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                                style={{ width: `${Math.min((used / limit) * 100, 100)}%`, background: used >= limit ? '#F87171' : primaryColor }} />
                        </div>
                        <p className="text-[10px] text-text-3 mt-1 capitalize">{plan}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-text-2">{user?.name}</p>
                            <p className="text-[10px] text-text-3 truncate">{user?.email}</p>
                        </div>
                        <button onClick={handleLogout} className="text-text-3 hover:text-red-400 transition-colors ml-2 flex-shrink-0" title="Sair">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
