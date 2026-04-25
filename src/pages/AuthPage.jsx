import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

function Field({ label, error, ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#A8A8A8', letterSpacing: 0.2 }}>{label}</label>
            <input
                style={{
                    background: '#121212',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 8,
                    color: '#FFFFFF',
                    fontSize: 14,
                    padding: '10px 14px',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'border-color 0.15s',
                    width: '100%',
                }}
                {...props}
            />
            {error && <p style={{ fontSize: 12, color: '#F87171' }}>{error}</p>}
        </div>
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

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

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
        <div style={{ minHeight: '100dvh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Inter, sans-serif' }}>
            {/* Subtle aurora */}
            <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(12,201,129,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
                {/* Back */}
                <button onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#616161', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 40, padding: 0, transition: 'color 0.15s', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#A8A8A8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#616161'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    Voltar ao início
                </button>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
                    <AtomMark size={30} />
                    <span style={{ fontSize: 16, fontWeight: 700 }}>PostAtomic</span>
                </div>

                {/* Card */}
                <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 4, background: '#0F0F0F', borderRadius: 10, padding: 4, marginBottom: 28, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {[{ v: 'login', l: 'Entrar' }, { v: 'signup', l: 'Criar conta' }].map(t => (
                            <button key={t.v} onClick={() => { setTab(t.v); setError(''); }}
                                style={{
                                    flex: 1, padding: '9px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                                    background: tab === t.v ? '#191919' : 'transparent',
                                    color: tab === t.v ? '#FFFFFF' : '#616161',
                                    fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                                    transition: 'all 0.15s',
                                    boxShadow: tab === t.v ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                                }}>
                                {t.l}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {tab === 'signup' && (
                            <>
                                <Field label="Seu nome" placeholder="João Silva" value={form.name} onChange={set('name')} required />
                                <Field label="Nome da empresa" placeholder="Empresa Exemplo" value={form.companyName} onChange={set('companyName')} required />
                            </>
                        )}
                        <Field label="E-mail" type="email" placeholder="voce@empresa.com" value={form.email} onChange={set('email')} required />
                        <Field label="Senha" type="password" placeholder={tab === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'} value={form.password} onChange={set('password')} required />

                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#F87171' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            style={{
                                marginTop: 4, padding: '12px 0', background: '#FFFFFF', color: '#050505',
                                border: 'none', borderRadius: 9999, fontSize: 14, fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                            }}>
                            {loading && <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#050505', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                            {tab === 'login' ? 'Entrar' : 'Criar conta e configurar marca'}
                        </button>
                    </form>

                    <p style={{ fontSize: 13, color: '#616161', textAlign: 'center', marginTop: 20 }}>
                        {tab === 'login' ? (
                            <>Não tem conta?{' '}
                                <button onClick={() => { setTab('signup'); setError(''); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0CC981', fontSize: 13, fontFamily: 'Inter, sans-serif', padding: 0 }}>
                                    Crie grátis
                                </button>
                            </>
                        ) : (
                            <>Já tem conta?{' '}
                                <button onClick={() => { setTab('login'); setError(''); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0CC981', fontSize: 13, fontFamily: 'Inter, sans-serif', padding: 0 }}>
                                    Entre aqui
                                </button>
                            </>
                        )}
                    </p>
                </div>

                <p style={{ fontSize: 12, color: '#616161', textAlign: 'center', marginTop: 20 }}>
                    10 gerações grátis · sem cartão de crédito
                </p>
            </div>
        </div>
    );
}
