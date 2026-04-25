import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Atom mark ── */
function AtomMark({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#0CC981" strokeWidth="1.5" />
            <ellipse cx="14" cy="14" rx="9" ry="3.5" stroke="white" strokeWidth="1.2" fill="none" />
            <ellipse cx="14" cy="14" rx="9" ry="3.5" stroke="white" strokeWidth="1.2" fill="none" transform="rotate(60 14 14)" />
            <ellipse cx="14" cy="14" rx="9" ry="3.5" stroke="white" strokeWidth="1.2" fill="none" transform="rotate(120 14 14)" />
            <circle cx="14" cy="14" r="2" fill="#0CC981" />
        </svg>
    );
}

/* ── Feature data ── */
const FEATURES = [
    {
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        title: 'Pesquisa antes de gerar',
        desc: 'Antes de cada post, o sistema busca dados reais do seu segmento. Números concretos, não chutes.',
    },
    {
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" /><path d="M8 12h8M8 8h8M8 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>,
        title: 'Templates premium',
        desc: 'Classic, Impact, Contrast e Manifesto — quatro templates projetados para alta performance.',
    },
    {
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        title: 'DNA da sua marca',
        desc: 'Configure identidade, tom de voz e módulos uma vez. Todo post gerado soa exatamente como você.',
    },
    {
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" /><path d="M12 7v5l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>,
        title: 'Limite diário inteligente',
        desc: '3 posts por dia, com reset à meia-noite. Foco em qualidade, não em volume.',
    },
    {
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" /></svg>,
        title: 'Export em 1080px',
        desc: 'PNG pronto para Instagram, LinkedIn e qualquer rede. Sem marca d\'água no plano Pro.',
    },
    {
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>,
        title: 'Multi-tenant',
        desc: 'Cada marca com workspace isolado. Time inteiro usando a mesma identidade visual.',
    },
];

const STEPS = [
    { n: '01', t: 'Configure sua marca', d: 'Identidade, público-alvo, tom de voz, cores e módulos em 5 minutos.' },
    { n: '02', t: 'Escolha formato e foco', d: 'Post único, carrossel ou story. Selecione um tema ou escreva o seu.' },
    { n: '03', t: 'IA pesquisa e gera', d: 'Dados reais injetados automaticamente. PNG em 1080px pronto para publicar.' },
];

const LOGOS = ['Linear', 'Vercel', 'Notion', 'Stripe', 'Figma', 'Loom', 'Slack', 'Raycast'];

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1 }
        );
        document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div style={{ background: '#050505', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>

            {/* ── NAV ── */}
            <nav className="nav-blur fixed top-0 left-0 right-0 z-50">
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AtomMark size={26} />
                        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>PostAtomic</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        {['Funcionalidades', 'Como funciona', 'Planos'].map(l => (
                            <span key={l} style={{ fontSize: 14, color: '#A8A8A8', cursor: 'pointer', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.target.style.color = '#fff'}
                                onMouseLeave={e => e.target.style.color = '#A8A8A8'}>
                                {l}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/auth?tab=login')}
                            style={{ fontSize: 14, color: '#A8A8A8', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.target.style.color = '#fff'}
                            onMouseLeave={e => e.target.style.color = '#A8A8A8'}>
                            Entrar
                        </button>
                        <button onClick={() => navigate('/auth?tab=signup')} className="btn-primary"
                            style={{ fontSize: 14, padding: '8px 20px', fontWeight: 700 }}>
                            Começar grátis
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="aurora-bg" style={{ paddingTop: 160, paddingBottom: 100, textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
                    {/* Badge */}
                    <div className="badge animate-fade-up" style={{ display: 'inline-flex', marginBottom: 28, animationDelay: '0ms' }}>
                        <span className="green-dot" />
                        Geração com IA + pesquisa em tempo real
                    </div>

                    {/* H1 */}
                    <h1 className="animate-fade-up" style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 20, animationDelay: '100ms' }}>
                        Conteúdo com<br />
                        <span className="gradient-text-green">DNA da sua marca</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-fade-up" style={{ fontSize: 18, color: '#A8A8A8', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 36px', animationDelay: '200ms' }}>
                        Configure sua identidade uma vez. A IA pesquisa dados reais e gera posts, carrosséis e stories que soam exatamente como você.
                    </p>

                    {/* CTAs */}
                    <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14, animationDelay: '300ms' }}>
                        <button onClick={() => navigate('/auth?tab=signup')} className="btn-primary">
                            Criar conta grátis
                        </button>
                        <button onClick={() => navigate('/auth?tab=login')} className="btn-secondary">
                            Já tenho conta
                        </button>
                    </div>
                    <p className="animate-fade-up" style={{ fontSize: 13, color: '#616161', animationDelay: '300ms' }}>
                        10 gerações grátis · sem cartão de crédito
                    </p>
                </div>

                {/* AI chat widget mock */}
                <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, maxWidth: 460, margin: '64px auto 0', padding: '0 24px', animationDelay: '400ms' }}>
                    <div style={{ background: '#191919', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}>
                        {/* Header row */}
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#616161" strokeWidth="1.5" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                <span style={{ fontSize: 13, color: '#A8A8A8', fontWeight: 400 }}>Gere posts com IA</span>
                            </div>
                            <span style={{ fontSize: 11, color: '#616161', background: 'rgba(12,201,129,0.12)', border: '1px solid rgba(12,201,129,0.2)', borderRadius: 99, padding: '2px 8px', color: '#0CC981' }}>Pro</span>
                        </div>
                        {/* Input row */}
                        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18, color: '#616161', fontWeight: 300, lineHeight: 1 }}>+</span>
                            <span style={{ fontSize: 15, color: '#616161', flex: 1, textAlign: 'left' }}>Carrossel sobre resultados do Q1…</span>
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                                {[0,1,2,3,4].map(i => <rect key={i} x={i*4} y={14-(6+i%3*3)} width="3" height={6+i%3*3} fill="#0CC981" opacity="0.6" rx="1" />)}
                            </svg>
                        </div>
                        {/* Format pills */}
                        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6 }}>
                            {['Post Único', 'Carrossel', 'Story'].map((l, i) => (
                                <span key={l} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: i === 1 ? 'rgba(12,201,129,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i === 1 ? 'rgba(12,201,129,0.25)' : 'rgba(255,255,255,0.08)'}`, color: i === 1 ? '#0CC981' : '#616161' }}>{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <p style={{ fontSize: 13, color: '#616161', padding: '0 40px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        Confiado por equipes de conteúdo
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 64, overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                    <div style={{ display: 'flex', gap: 64, animation: 'marquee 20s linear infinite', flexShrink: 0 }}>
                        {[...LOGOS, ...LOGOS].map((l, i) => (
                            <span key={i} style={{ fontSize: 15, fontWeight: 700, color: '#2A2A2A', letterSpacing: -0.3, whiteSpace: 'nowrap' }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section id="funcionalidades" style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
                    {/* Header */}
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 60 }}>
                        <p className="section-label" style={{ marginBottom: 12 }}>Funcionalidades</p>
                        <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.8 }}>
                            IA que trabalha<br />do jeito que você trabalha
                        </h2>
                    </div>

                    {/* 3-col grid with border separators */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                        {FEATURES.map((f, i) => (
                            <div key={f.title}
                                className={`feature-card animate-on-scroll stagger-${(i % 3) + 1}`}
                                style={{
                                    borderRight: i % 3 < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                    borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                }}>
                                <div className="icon-box" style={{ marginBottom: 40 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, letterSpacing: -0.3 }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: '#A8A8A8', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="como-funciona" style={{ padding: '0 0 100px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 60 }}>
                        <p className="section-label" style={{ marginBottom: 12 }}>Como funciona</p>
                        <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.8 }}>
                            De zero a post<br />em 90 segundos
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                        {STEPS.map((s, i) => (
                            <div key={s.n}
                                className={`feature-card animate-on-scroll stagger-${i + 1}`}
                                style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 60, fontVariantNumeric: 'tabular-nums' }}>{s.n}</div>
                                <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, letterSpacing: -0.3 }}>{s.t}</h3>
                                <p style={{ fontSize: 14, color: '#A8A8A8', lineHeight: 1.6 }}>{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ── */}
            <section className="aurora-bg" style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
                    <div className="animate-on-scroll">
                        <p className="section-label" style={{ marginBottom: 20 }}>Comece hoje</p>
                        <h2 style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1, marginBottom: 16, lineHeight: 1.1 }}>
                            Pronto para criar<br />com consistência?
                        </h2>
                        <p style={{ fontSize: 16, color: '#A8A8A8', marginBottom: 40, lineHeight: 1.6 }}>
                            10 gerações gratuitas. Sem cartão de crédito, sem compromisso.
                        </p>
                        <button onClick={() => navigate('/auth?tab=signup')} className="btn-primary" style={{ fontSize: 16 }}>
                            Criar conta grátis
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AtomMark size={22} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>PostAtomic</span>
                </div>
                <p style={{ fontSize: 13, color: '#616161' }}>Feito com IA · {new Date().getFullYear()}</p>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Privacidade', 'Termos', 'Contato'].map(l => (
                        <span key={l} style={{ fontSize: 13, color: '#616161', cursor: 'pointer', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.target.style.color = '#fff'}
                            onMouseLeave={e => e.target.style.color = '#616161'}>
                            {l}
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    );
}
