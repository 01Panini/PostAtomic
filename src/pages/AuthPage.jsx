import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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
                // If tenant has no brand_config modules → go to onboarding
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
        <div className="min-h-screen bg-base flex items-center justify-center p-4" style={{ fontFamily: "'Satoshi',sans-serif" }}>
            <div className="w-full max-w-md animate-fade-up">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-10">
                    <div className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0,87,183,.5)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" />
                        </svg>
                    </div>
                    <span className="text-base font-extrabold tracking-tight text-text-1">PostAtomic</span>
                </div>

                {/* Card */}
                <div className="bg-surface border border-border rounded-2xl p-8">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-base rounded-xl p-1 mb-8">
                        {[{ v: 'login', l: 'Entrar' }, { v: 'signup', l: 'Criar conta' }].map((t) => (
                            <button key={t.v} onClick={() => { setTab(t.v); setError(''); }}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t.v ? 'bg-surface-2 text-text-1' : 'text-text-3 hover:text-text-2'}`}>
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
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <Button variant="primary" size="lg" type="submit" loading={loading} className="mt-2">
                            {tab === 'login' ? 'Entrar' : 'Criar conta e configurar marca →'}
                        </Button>
                    </form>

                    <p className="text-xs text-text-3 text-center mt-6">
                        {tab === 'login' ? (
                            <>Não tem conta? <button onClick={() => setTab('signup')} className="text-blue-light hover:underline">Crie grátis</button></>
                        ) : (
                            <>Já tem conta? <button onClick={() => setTab('login')} className="text-blue-light hover:underline">Entre aqui</button></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
