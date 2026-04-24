import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Atom logo SVG ── */
function AtomLogo({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <defs>
                <linearGradient id="ll-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#ll-bg)" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)" />
            <circle cx="16" cy="16" r="2.4" fill="white" />
            <circle cx="16" cy="16" r="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>
    );
}

/* ── Feature card data ── */
const FEATURES = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ),
        title: 'DNA da sua marca',
        desc: 'Cores, módulos, tom de voz e público-alvo. Configure uma vez — toda geração soa exatamente como você.',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ),
        title: 'Pesquisa em tempo real',
        desc: 'Antes de cada geração, o sistema busca dados reais do seu segmento. Números que convencem, não chutam.',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#60A5FA" strokeWidth="1.6" /><path d="M8 12h8M8 8h8M8 16h5" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" /></svg>
        ),
        title: 'Templates premium',
        desc: 'Post único, carrossel de até 10 slides ou story. Três templates de alta performance — Impact, Contrast, Manifesto.',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#60A5FA" strokeWidth="1.6" /><path d="M12 7v5l3 3" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" /></svg>
        ),
        title: '3 posts por dia',
        desc: 'Limite diário que reinicia à meia-noite. Foco na qualidade, não na quantidade — cada post com pesquisa dedicada.',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" /><rect x="3" y="3" width="18" height="18" rx="3" stroke="#60A5FA" strokeWidth="1.6" /></svg>
        ),
        title: 'Export 1080px',
        desc: 'PNG em resolução real para Instagram, LinkedIn e qualquer rede. Sem marca d\'água no plano Pro.',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" /></svg>
        ),
        title: 'Multi-tenant',
        desc: 'Cada marca tem seu próprio workspace isolado. Time inteiro usando a mesma identidade visual.',
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    /* ── IntersectionObserver for scroll animations ── */
    useEffect(() => {
        const els = document.querySelectorAll('.animate-on-scroll');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.12 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-void text-[#F0F6FF] overflow-x-hidden">

            {/* ── NAV ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[.05]" style={{ background: 'rgba(3,9,26,0.82)', backdropFilter: 'blur(16px)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <AtomLogo size={30} />
                        <span className="text-sm font-bold tracking-tight text-[#F0F6FF]">PostAtomic</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/auth?tab=login')}
                            className="text-sm font-semibold text-[#8BA8C8] hover:text-[#F0F6FF] transition-colors px-4 py-2">
                            Entrar
                        </button>
                        <button onClick={() => navigate('/auth?tab=signup')}
                            className="btn-glow text-sm font-bold bg-[#2563EB] text-white px-5 py-2.5 rounded-xl">
                            Começar grátis
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="star-field relative pt-32 pb-28 flex flex-col items-center text-center px-6">
                {/* Grid overlay */}
                <div className="absolute inset-0 grid-overlay pointer-events-none opacity-40" />

                {/* Nebula orb */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div className="relative z-10 max-w-4xl mx-auto animate-fade-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#60A5FA] border border-[#2563EB]/25 bg-[#2563EB]/[.08] px-4 py-2 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
                        Geração de conteúdo com IA
                    </div>

                    {/* Headline */}
                    <h1 className="font-display text-5xl md:text-7xl font-normal leading-[1.05] tracking-tight mb-6">
                        <span className="gradient-text">Conteúdo com</span>
                        <br />
                        <span className="text-[#F0F6FF]">DNA da sua marca</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#8BA8C8] max-w-2xl mx-auto leading-relaxed mb-10">
                        Configure sua identidade uma vez. A IA pesquisa dados reais, escolhe o melhor ângulo e gera posts, carrosséis e stories que soam exatamente como você.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <button onClick={() => navigate('/auth?tab=signup')}
                            className="btn-glow flex items-center gap-3 text-base font-bold bg-[#2563EB] text-white px-8 py-4 rounded-2xl">
                            <AtomLogo size={20} />
                            Criar conta grátis
                        </button>
                        <button onClick={() => navigate('/auth?tab=login')}
                            className="flex items-center gap-2 text-sm font-semibold text-[#8BA8C8] hover:text-[#F0F6FF] transition-colors">
                            Já tenho conta
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        </button>
                    </div>
                    <p className="text-xs text-[#4D6B8A]">10 gerações grátis · sem cartão de crédito</p>
                </div>

                {/* Floating preview card */}
                <div className="relative z-10 mt-20 max-w-2xl mx-auto w-full animate-fade-up" style={{ animationDelay: '0.3s' }}>
                    <div className="glass-card rounded-3xl p-6 shadow-card">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
                            <div className="w-3 h-3 rounded-full bg-[#10B981]/60" />
                            <span className="text-[10px] text-[#4D6B8A] font-mono ml-2">PostAtomic — Post Machine</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {['Carrossel · 8 slides', 'Post único', 'Story · AIDA'].map((t, i) => (
                                <div key={t} className="rounded-xl border border-white/[.06] bg-white/[.03] p-3">
                                    <div className="w-full aspect-[4/5] rounded-lg mb-2 overflow-hidden"
                                        style={{ background: `radial-gradient(ellipse at 50% -10%, rgba(37,99,235,${0.35 - i * 0.08}) 0%, #060E20 60%)` }}>
                                        <div className="h-full flex flex-col justify-end p-2">
                                            <div className="h-2 bg-white/25 rounded-full mb-1.5 w-3/4" />
                                            <div className="h-1.5 bg-white/15 rounded-full w-1/2" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-[#4D6B8A] font-medium">{t}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-on-scroll">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-[#2563EB] mb-3">Plataforma completa</p>
                        <h2 className="font-display text-4xl md:text-5xl font-normal text-[#F0F6FF] mb-4">
                            Tudo que você precisa<br />
                            <span className="gradient-text-blue">para criar com consistência</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <div key={f.title}
                                className={`glass-card animate-on-scroll stagger-${(i % 3) + 1} rounded-2xl p-6 cursor-default`}>
                                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/[.1] border border-[#2563EB]/20 flex items-center justify-center mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-sm font-bold mb-2 text-[#F0F6FF]">{f.title}</h3>
                                <p className="text-sm text-[#8BA8C8] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-28 px-6 relative">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 60%)' }} />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-16 animate-on-scroll">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-[#2563EB] mb-3">Como funciona</p>
                        <h2 className="font-display text-4xl md:text-5xl font-normal text-[#F0F6FF]">
                            De zero a post<br />
                            <span className="gradient-text">em 90 segundos</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-5">
                        {[
                            { n: '01', t: 'Configure sua marca', d: 'Preencha um onboarding de 6 etapas: identidade, público, tom de voz, cores e módulos. Leva 5 minutos.' },
                            { n: '02', t: 'Escolha o formato e o foco', d: 'Post único, carrossel ou story. Selecione um tema ou escreva o seu — a IA entende contexto.' },
                            { n: '03', t: 'Pesquisa automática', d: 'Antes de gerar, o sistema busca dados reais do seu segmento. Números e tendências que fazem a diferença.' },
                            { n: '04', t: 'Baixe e publique', d: 'PNG em 1080px pronto para qualquer rede. Caption sugerida com hashtags incluídas.' },
                        ].map((s, i) => (
                            <div key={s.n} className={`animate-on-scroll stagger-${i + 1} flex items-start gap-5 glass-card rounded-2xl p-6`}>
                                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/[.12] border border-[#2563EB]/25 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-black text-[#60A5FA] font-mono">{s.n}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#F0F6FF] mb-1">{s.t}</h3>
                                    <p className="text-sm text-[#8BA8C8] leading-relaxed">{s.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BOTTOM ── */}
            <section className="star-field py-28 px-6 text-center relative">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(37,99,235,0.18) 0%, transparent 60%)' }} />
                <div className="relative z-10 max-w-2xl mx-auto animate-on-scroll">
                    <h2 className="font-display text-4xl md:text-5xl font-normal text-[#F0F6FF] mb-6">
                        Pronto para criar<br />
                        <span className="gradient-text">com consistência?</span>
                    </h2>
                    <p className="text-[#8BA8C8] mb-10 leading-relaxed">
                        Comece hoje com 10 gerações gratuitas. Sem cartão de crédito, sem compromisso.
                    </p>
                    <button onClick={() => navigate('/auth?tab=signup')}
                        className="btn-glow inline-flex items-center gap-3 text-base font-bold bg-[#2563EB] text-white px-10 py-5 rounded-2xl">
                        <AtomLogo size={22} />
                        Criar conta grátis
                    </button>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/[.05] py-8 px-6 text-center">
                <div className="flex items-center justify-center gap-2.5 mb-3">
                    <AtomLogo size={20} />
                    <span className="text-xs font-bold text-[#4D6B8A]">PostAtomic</span>
                </div>
                <p className="text-xs text-[#4D6B8A]">Feito com IA · {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}
