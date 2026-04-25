import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { ColorPicker } from '../components/ui/ColorPicker';
import { TagInput } from '../components/ui/TagInput';
import { useMobile } from '../hooks/useMobile';

const S = {
    input: {
        background: '#0F0F0F',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        color: '#FFFFFF',
        fontSize: 13,
        padding: '9px 12px',
        outline: 'none',
        fontFamily: 'Inter, sans-serif',
        width: '100%',
        transition: 'border-color 0.15s',
    },
    label: {
        fontSize: 11,
        fontWeight: 500,
        color: '#616161',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: 6,
    },
};

function Field({ label, as: Tag = 'input', rows, ...props }) {
    return (
        <div>
            {label && <label style={S.label}>{label}</label>}
            <Tag rows={rows} style={{ ...S.input, resize: 'none' }} {...props} />
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{title}</h2>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {children}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { tenant, refreshTenant, user } = useAuth();
    const isMobile = useMobile();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const [name, setName] = useState(tenant?.name || '');
    const [description, setDescription] = useState(tenant?.description || '');
    const [segment, setSegment] = useState(tenant?.segment || '');
    const [tone, setTone] = useState(tenant?.tone || '');
    const [defaultCta, setDefaultCta] = useState(tenant?.default_cta || '');
    const [tags, setTags] = useState(tenant?.tags || []);

    const cfg = tenant?.brand_config || {};
    const [primary, setPrimary] = useState(cfg.primary || '#0CC981');
    const [accent, setAccent] = useState(cfg.accent || '#00FF2A');
    const [bgDark, setBgDark] = useState(cfg.bgDark || '#050505');
    const [bgLight, setBgLight] = useState(cfg.bgLight || '#F4F6F9');
    const [modules, setModules] = useState(cfg.modules || []);
    const [handle, setHandle] = useState(cfg.handle || '');
    const [domain, setDomain] = useState(cfg.domain || '');

    const isOwner = user?.role === 'owner';

    const save = async () => {
        if (!isOwner) return;
        setSaving(true); setError('');
        try {
            await api.tenants.update(tenant.slug, {
                name, description, segment, tone, default_cta: defaultCta, tags,
                brand_config: {
                    ...cfg, primary, accent, bgDark, bgLight,
                    modules: modules.map(m => ({ ...m, key: m.key || m.name.toLowerCase().replace(/\s+/g, '_') })),
                    handle: handle.replace(/^@/, ''),
                    domain: domain.replace(/^https?:\/\//, ''),
                },
            });
            await refreshTenant();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) { setError(e.message || 'Erro ao salvar'); }
        setSaving(false);
    };

    if (!isOwner) return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#121212', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#616161" strokeWidth="1.5" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Apenas o proprietário</p>
                <p style={{ fontSize: 13, color: '#616161' }}>Somente o owner pode editar as configurações.</p>
            </div>
        </div>
    );

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: isMobile ? '20px 16px 80px' : 32, background: '#050505', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, letterSpacing: -0.4, color: '#FFFFFF', marginBottom: 4 }}>Configurações</h1>
                    <p style={{ fontSize: 13, color: '#616161' }}>Edite a identidade e a marca do workspace.</p>
                </div>

                <Section title="Identidade">
                    <Field label="Nome da empresa" value={name} onChange={e => setName(e.target.value)} />
                    <Field label="Descrição" as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                    <Field label="Segmento" value={segment} onChange={e => setSegment(e.target.value)} placeholder="Ex: SaaS, Govtech, Saúde…" />
                    <Field label="Tom de voz" value={tone} onChange={e => setTone(e.target.value)} placeholder="Ex: Autoritativo, Próximo…" />
                    <Field label="CTA padrão" value={defaultCta} onChange={e => setDefaultCta(e.target.value)} placeholder="Ex: Agende uma demo" />
                </Section>

                <Section title="Tags de Conteúdo">
                    <TagInput tags={tags} onChange={setTags} min={0} max={15} suggestions={[]} />
                    <p style={{ fontSize: 12, color: '#616161' }}>Tags orientam a IA na geração de conteúdo.</p>
                </Section>

                <Section title="Cores da Marca">
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                        <ColorPicker label="Cor primária" value={primary} onChange={setPrimary} />
                        <ColorPicker label="Cor de destaque" value={accent} onChange={setAccent} />
                        <ColorPicker label="Fundo escuro" value={bgDark} onChange={setBgDark} />
                        <ColorPicker label="Fundo claro" value={bgLight} onChange={setBgLight} />
                    </div>
                </Section>

                <Section title="Módulos / Produtos">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {modules.map((m, i) => (
                            <div key={m.key || i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 10 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <input style={{ ...S.input }} value={m.name} placeholder={`Módulo ${i + 1}`}
                                        onChange={e => setModules(ms => ms.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                                </div>
                                <div style={{ width: isMobile ? 90 : 110, flexShrink: 0 }}>
                                    <ColorPicker label="" value={m.color}
                                        onChange={v => setModules(ms => ms.map((x, j) => j === i ? { ...x, color: v } : x))} />
                                </div>
                                <button onClick={() => setModules(ms => ms.filter((_, j) => j !== i))}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616161', fontSize: 18, padding: '0 4px', lineHeight: 1, transition: 'color 0.15s', flexShrink: 0 }}
                                    onMouseEnter={e => e.target.style.color = '#F87171'}
                                    onMouseLeave={e => e.target.style.color = '#616161'}>×</button>
                            </div>
                        ))}
                        {modules.length < 5 && (
                            <button onClick={() => setModules(m => [...m, { key: `mod_${Date.now()}`, name: '', color: primary }])}
                                style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 0', fontSize: 13, color: '#616161', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.target.style.borderColor = 'rgba(12,201,129,0.35)'; e.target.style.color = '#0CC981'; }}
                                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = '#616161'; }}>
                                + Adicionar módulo
                            </button>
                        )}
                    </div>
                </Section>

                <Section title="Presença Digital">
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                        <Field label="Handle (@)" placeholder="@suaempresa" value={handle} onChange={e => setHandle(e.target.value)} />
                        <Field label="Domínio" placeholder="suaempresa.com" value={domain} onChange={e => setDomain(e.target.value)} />
                    </div>
                </Section>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#F87171' }}>{error}</div>
                )}

                <button onClick={save} disabled={saving}
                    style={{
                        padding: '12px 0', background: '#FFFFFF', color: '#050505', border: 'none', borderRadius: 9999,
                        fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.6 : 1, fontFamily: 'Inter, sans-serif',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'opacity 0.15s',
                    }}>
                    {saving && <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#050505', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                    {saved ? 'Salvo com sucesso' : 'Salvar configurações'}
                </button>
            </div>
        </div>
    );
}
