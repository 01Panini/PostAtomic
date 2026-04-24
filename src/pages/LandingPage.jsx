import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-base text-text-1" style={{ fontFamily: "'Satoshi',sans-serif" }}>
            {/* Nav */}
            <nav className="flex items-center justify-between px-8 py-5 border-b border-border max-w-6xl mx-auto">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center" style={{ boxShadow: '0 0 18px rgba(0,87,183,.5)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" />
                        </svg>
                    </div>
                    <span className="text-sm font-extrabold tracking-tight">PostAtomic</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/auth?tab=login')} className="text-sm font-bold text-text-2 hover:text-text-1 transition-colors px-4 py-2">
                        Entrar
                    </button>
                    <button onClick={() => navigate('/auth?tab=signup')} className="text-sm font-extrabold bg-blue text-white px-5 py-2.5 rounded-xl hover:-translate-y-0.5 transition-all" style={{ boxShadow: '0 4px 20px rgba(0,87,183,.4)' }}>
                        Começar grátis
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="max-w-4xl mx-auto px-8 pt-28 pb-20 text-center">
                <div className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-widest uppercase text-blue-light border border-blue/25 bg-blue/[.08] px-4 py-2 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-light animate-pulse" />
                    Geração de conteúdo com IA
                </div>

                <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-text-1">
                    Posts profissionais<br />
                    <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(77,154,255,.6)' }}>no seu DNA visual</span>
                </h1>

                <p className="text-lg text-text-2 max-w-2xl mx-auto leading-relaxed mb-10">
                    Configure a identidade da sua marca uma vez. Gere posts, carrosséis e stories com IA que soa exatamente como você — sem prompt engineering, sem templates genéricos.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => navigate('/auth?tab=signup')}
                        className="flex items-center gap-2.5 text-base font-extrabold bg-blue text-white px-8 py-4 rounded-2xl hover:-translate-y-1 transition-all"
                        style={{ boxShadow: '0 8px 32px rgba(0,87,183,.45)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" /></svg>
                        Criar conta grátis
                    </button>
                    <button onClick={() => navigate('/auth?tab=login')} className="text-sm font-bold text-text-2 hover:text-text-1 transition-colors">
                        Já tenho conta →
                    </button>
                </div>

                <p className="text-xs text-text-3 mt-4">10 gerações grátis · sem cartão de crédito</p>
            </div>

            {/* Features */}
            <div className="max-w-5xl mx-auto px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        {
                            icon: '🎨',
                            title: 'Identidade visual completa',
                            desc: 'Cores, módulos, tom de voz, público-alvo. Tudo configurado em 5 minutos.',
                        },
                        {
                            icon: '⚡',
                            title: 'Geração em segundos',
                            desc: 'Post único, carrossel de até 10 slides ou story. A IA cria com o DNA da sua marca.',
                        },
                        {
                            icon: '📐',
                            title: 'Export em 1080px',
                            desc: 'PNG em resolução real para Instagram, LinkedIn e qualquer rede social.',
                        },
                    ].map((f) => (
                        <div key={f.title} className="bg-white/[.02] border border-border rounded-2xl p-6 hover:border-border-2 transition-colors">
                            <div className="text-3xl mb-4">{f.icon}</div>
                            <h3 className="text-sm font-extrabold mb-2 text-text-1">{f.title}</h3>
                            <p className="text-sm text-text-2 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border py-8 text-center">
                <p className="text-xs text-text-3">PostAtomic · Feito com IA · {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}
