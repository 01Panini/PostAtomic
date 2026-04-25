import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';
import { useUsage } from '../hooks/useUsage';
import { useMobile } from '../hooks/useMobile';

const IC = {
    machine: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    history: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    ),
    settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    ),
    logout: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

/* ── Desktop sidebar NavItem ── */
function SideNavItem({ to, icon, label, end }) {
    return (
        <NavLink to={to} end={end}
            style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 10px', borderRadius: 8,
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                textDecoration: 'none',
                color: isActive ? '#FFFFFF' : '#616161',
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                transition: 'all 0.15s',
            })}>
            <span style={{ flexShrink: 0 }}>
                {/* Shrink icon to 14px for desktop */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
                    {to.endsWith('/dashboard')
                        ? <><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>
                        : to.endsWith('/settings')
                        ? <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>
                        : <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    }
                </svg>
            </span>
            {label}
        </NavLink>
    );
}

/* ── Mobile bottom tab item ── */
function TabItem({ to, icon, label, end }) {
    return (
        <NavLink to={to} end={end} style={{ textDecoration: 'none', flex: 1 }}>
            {({ isActive }) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '6px 0', color: isActive ? '#0CC981' : '#616161', transition: 'color 0.15s' }}>
                    <span style={{ display: 'flex' }}>{icon}</span>
                    <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, letterSpacing: 0.2, fontFamily: 'Inter, sans-serif' }}>{label}</span>
                </div>
            )}
        </NavLink>
    );
}

export default function WorkspacePage() {
    const { user, tenant, logout } = useAuth();
    const brand = useBrand();
    const { dailyUsed, dailyLimit, plan } = useUsage();
    const navigate = useNavigate();
    const isMobile = useMobile();

    const tenantName = brand?.tenantMeta?.name || tenant?.name || 'Workspace';
    const logoUrl = brand?.tenantMeta?.logoUrl;
    const used = dailyUsed || 0;
    const limit = dailyLimit || 3;
    const isAtLimit = used >= limit;
    const pct = Math.min((used / limit) * 100, 100);
    const isOwner = user?.role === 'owner';

    const handleLogout = () => { logout(); navigate('/', { replace: true }); };

    /* ────────────────────────── MOBILE layout ─────────────────────────────── */
    if (isMobile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#050505', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
                {/* Mobile top bar */}
                <div style={{ flexShrink: 0, height: 48, background: '#0F0F0F', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', paddingLeft: 16, paddingRight: 16, gap: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: '#191919', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {logoUrl
                            ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0CC981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        }
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tenantName}</p>

                    {/* Usage pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '4px 10px' }}>
                        <div style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: isAtLimit ? '#EF4444' : '#0CC981', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: isAtLimit ? '#F87171' : '#A8A8A8' }}>{used}/{limit}</span>
                    </div>

                    <button onClick={handleLogout}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616161', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
                        onMouseLeave={e => e.currentTarget.style.color = '#616161'}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>

                {/* Content — shrinks between top and bottom bar */}
                <main style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                    <Outlet />
                </main>

                {/* Mobile bottom tab bar */}
                <nav className="mobile-bottom-nav">
                    <TabItem to="/workspace" end icon={IC.machine} label="Post Machine" />
                    <TabItem to="/workspace/dashboard" icon={IC.history} label="Histórico" />
                    {isOwner && <TabItem to="/workspace/settings" icon={IC.settings} label="Config" />}
                </nav>
            </div>
        );
    }

    /* ────────────────────────── DESKTOP layout ─────────────────────────────── */
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050505', fontFamily: 'Inter, sans-serif' }}>

            {/* ── SIDEBAR ── */}
            <aside style={{ width: 220, flexShrink: 0, background: '#0F0F0F', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Brand */}
                <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#191919', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {logoUrl
                                ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0CC981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            }
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tenantName}</p>
                            <p style={{ fontSize: 10, color: '#616161', fontWeight: 400, letterSpacing: 0.3 }}>PostAtomic</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#616161', padding: '0 8px', marginBottom: 4 }}>Conteúdo</p>
                    <SideNavItem to="/workspace" end label="Post Machine" />
                    <SideNavItem to="/workspace/dashboard" label="Histórico" />

                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#616161', padding: '0 8px', marginTop: 16, marginBottom: 4 }}>Configuração</p>
                    {isOwner && <SideNavItem to="/workspace/settings" label="Configurações" />}
                </nav>

                <div style={{ flex: 1 }} />

                {/* Daily usage */}
                <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: '#616161', fontWeight: 500 }}>Hoje</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: isAtLimit ? '#F87171' : '#A8A8A8' }}>{used}/{limit}</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: isAtLimit ? '#EF4444' : '#0CC981', borderRadius: 99, transition: 'width 0.5s' }} />
                        </div>
                        <p style={{ fontSize: 10, color: '#616161', marginTop: 4 }}>{plan || 'trial'} · renova às 00:00</p>
                    </div>

                    {/* User row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#A8A8A8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                            <p style={{ fontSize: 10, color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        </div>
                        <button onClick={handleLogout}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616161', flexShrink: 0, padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
                            onMouseLeave={e => e.currentTarget.style.color = '#616161'}
                            title="Sair">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <main style={{ flex: 1, overflow: 'hidden', background: '#050505' }}>
                <Outlet />
            </main>
        </div>
    );
}
