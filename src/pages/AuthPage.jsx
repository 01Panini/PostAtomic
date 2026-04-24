import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function AtomLogo({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <defs>
                <linearGradient id="auth-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#auth-bg)" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)" />
            <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)" />
            <circle cx="16" cy="16" r="2.4" fill="white" />
            <circle cx="16" cy="16" r="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>
    );
}

export default function AuthPage() {
    const [params] = useSearchParams();
    const [tab, setTab] = useState(params.get('tab') === 'signup' ? 'signup' : 'login');
    const [form, setForm] = useState({ name: '', companyName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/workspace', { replace: true });
    }, [user, navigate]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                await login(form.email, form.password);
            } else {
                if (!form.name.trim()) throw new Error('Informe seu nome');
                if (!form.companyName.trim()) throw new Error('Informe o nome da empresa');
                if (form.password.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');
                const data = await signup(form.email, form.password, form.name, form.companyName);
                if (!data.tenant?.brand_config?.modules?.length) {
                    navigate('/onboarding', { replace: true });
                    return;
                }
            }
            navigate('/workspace', { replace: true });
        } catch (err) {
            setError(err.message || 'Erro ao autenticar');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-void flex items-center justify-center p-4 star-field">
            {/* Subtle nebula */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(37,99,235,0.12) 0%, transparent 60%)' }} />

            <div className="relative z-10 w-full max-w-md animate-fade-up">
                {/* Back button */}
                <button onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm text-[#4D6B8A] hover:text-[#8BA8C8] transition-colors mb-8 group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Voltar ao início
                </button>

                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <AtomLogo size={36} />
                    <span className="text-lg font-bold tracking-tight text-[#F0F6FF]">PostAtomic</span>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-8 shadow-card">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-[#060E20] rounded-xl p-1 mb-8 border border-white/[.04]">
                        {[{ v: 'login', l: 'Entrar' }, { v: 'signup', l: 'Criar conta' }].map((t) => (
                            <button key={t.v} onClick={() => { setTab(t.v); setError(''); }}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    tab === t.v
                                        ? 'bg-[#0A1628] text-[#F0F6FF] shadow-sm'
                                        : 'text-[#4D6B8A] hover:text-[#8BA8C8]'
                                }`}>
                                {t.l}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        {tab === 'signup' && (
                            <>
                                <Input label="Seu nome" placeholder="João Silva" value={form.name} onChange={set('name')} required />
                                <Input label="Nome da empresa" placeholder="Prefeitura de Exemplo" value={form.companyName} onChange={set('companyName')} required />
                            </>
                        )}

                        <Input label="E-mail" type="email" placeholder="voce@empresa.com" value={form.email} onChange={set('email')} required />
                        <Input label="Senha" type="password" placeholder={tab === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'} value={form.password} onChange={set('password')} required />

                        {error && (
                            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl px-4 py-3 text-sm text-[#F87171]">
                                {error}
                            </div>
                        )}

                        <Button variant="primary" size="lg" type="submit" loading={loading} className="mt-2">
                            {tab === 'login' ? 'Entrar' : 'Criar conta e configurar marca'}
                        </Button>
                    </form>

                    <p className="text-xs text-[#4D6B8A] text-center mt-6">
                        {tab === 'login' ? (
                            <>Não tem conta?{' '}
                                <button onClick={() => { setTab('signup'); setError(''); }} className="text-[#60A5FA] hover:underline">
                                    Crie grátis
                                </button>
                            </>
                        ) : (
                            <>Já tem conta?{' '}
                                <button onClick={() => { setTab('login'); setError(''); }} className="text-[#60A5FA] hover:underline">
                                    Entre aqui
                                </button>
                            </>
                        )}
                    </p>
                </div>

                <p className="text-xs text-[#4D6B8A] text-center mt-6">
                    10 gerações grátis · sem cartão de crédito
                </p>
            </div>
        </div>
    );
}
