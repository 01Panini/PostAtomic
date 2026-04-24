import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ColorPicker } from '../components/ui/ColorPicker';
import { TagInput } from '../components/ui/TagInput';

function Section({ title, children }) {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-extrabold text-text-1 border-b border-border pb-3">{title}</h2>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    const { tenant, refreshTenant, user } = useAuth();
    const brand = useBrand();

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Identity
    const [name, setName] = useState(tenant?.name || '');
    const [description, setDescription] = useState(tenant?.description || '');
    const [segment, setSegment] = useState(tenant?.segment || '');
    const [tone, setTone] = useState(tenant?.tone || '');
    const [defaultCta, setDefaultCta] = useState(tenant?.default_cta || '');
    const [tags, setTags] = useState(tenant?.tags || []);

    // Colors
    const cfg = tenant?.brand_config || {};
    const [primary, setPrimary] = useState(cfg.primary || '#0057B7');
    const [accent, setAccent] = useState(cfg.accent || '#4D9AFF');
    const [bgDark, setBgDark] = useState(cfg.bgDark || '#040C1A');
    const [bgLight, setBgLight] = useState(cfg.bgLight || '#F4F6F9');

    // Modules
    const [modules, setModules] = useState(cfg.modules || []);
    const [handle, setHandle] = useState(cfg.handle || '');
    const [domain, setDomain] = useState(cfg.domain || '');

    const isOwner = user?.role === 'owner';

    const save = async () => {
        if (!isOwner) return;
        setSaving(true);
        setError('');
        try {
            await api.tenants.update(tenant.slug, {
                name,
                description,
                segment,
                tone,
                default_cta: defaultCta,
                tags,
                brand_config: {
                    ...cfg,
                    primary, accent, bgDark, bgLight,
                    modules: modules.map(m => ({ ...m, key: m.key || m.name.toLowerCase().replace(/\s+/g, '_') })),
                    handle: handle.replace(/^@/, ''),
                    domain: domain.replace(/^https?:\/\//, ''),
                },
            });
            await refreshTenant();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            setError(e.message || 'Erro ao salvar');
        }
        setSaving(false);
    };

    if (!isOwner) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-sm">
                    <div className="text-4xl mb-4">🔒</div>
                    <p className="text-base font-extrabold text-text-1 mb-2">Apenas o proprietário</p>
                    <p className="text-sm text-text-2">Somente o owner da conta pode editar as configurações da marca.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6" style={{ fontFamily: "'Satoshi',sans-serif" }}>
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black tracking-tight mb-1 text-text-1">Configurações</h1>
                    <p className="text-sm text-text-2">Edite a identidade e a marca do workspace.</p>
                </div>

                {/* Identity */}
                <Section title="Identidade">
                    <Input label="Nome da empresa" value={name} onChange={(e) => setName(e.target.value)} />
                    <div>
                        <label className="block text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3 mb-2">Descrição</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-base border border-border-2 rounded-xl text-text-1 text-sm px-4 py-3 outline-none resize-none placeholder:text-text-3 focus:border-blue transition-colors" />
                    </div>
                    <Input label="Segmento" value={segment} onChange={(e) => setSegment(e.target.value)} placeholder="Ex: Govtech, SaaS, Saúde…" />
                    <Input label="Tom de voz" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Ex: Autoritativo, Próximo, Técnico…" />
                    <Input label="CTA padrão" value={defaultCta} onChange={(e) => setDefaultCta(e.target.value)} placeholder="Ex: Agende uma demo" />
                </Section>

                {/* Tags */}
                <Section title="Tags de Conteúdo">
                    <TagInput tags={tags} onChange={setTags} min={0} max={15}
                        suggestions={[]} />
                    <p className="text-xs text-text-3">Tags orientam a IA na geração de conteúdo.</p>
                </Section>

                {/* Colors */}
                <Section title="Cores da Marca">
                    <div className="grid grid-cols-2 gap-4">
                        <ColorPicker label="Cor primária" value={primary} onChange={setPrimary} />
                        <ColorPicker label="Cor de destaque" value={accent} onChange={setAccent} />
                        <ColorPicker label="Fundo escuro" value={bgDark} onChange={setBgDark} />
                        <ColorPicker label="Fundo claro" value={bgLight} onChange={setBgLight} />
                    </div>
                </Section>

                {/* Modules */}
                <Section title="Módulos / Produtos">
                    <div className="flex flex-col gap-3">
                        {modules.map((m, i) => (
                            <div key={m.key || i} className="flex items-center gap-3 bg-base border border-border rounded-xl p-3">
                                <div className="flex-1">
                                    <Input label={`Módulo ${i + 1}`} value={m.name}
                                        onChange={(e) => setModules(ms => ms.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                                </div>
                                <div className="w-32 flex-shrink-0">
                                    <ColorPicker label="Cor" value={m.color}
                                        onChange={(v) => setModules(ms => ms.map((x, j) => j === i ? { ...x, color: v } : x))} />
                                </div>
                                <button onClick={() => setModules(ms => ms.filter((_, j) => j !== i))}
                                    className="text-text-3 hover:text-red-400 transition-colors text-lg mt-4">×</button>
                            </div>
                        ))}
                        {modules.length < 5 && (
                            <button onClick={() => setModules(m => [...m, { key: `mod_${Date.now()}`, name: '', color: accent }])}
                                className="w-full border border-dashed border-border-2 rounded-xl py-3 text-sm text-text-3 hover:border-blue/40 hover:text-blue-light transition-colors">
                                + Adicionar módulo
                            </button>
                        )}
                    </div>
                </Section>

                {/* Digital presence */}
                <Section title="Presença Digital">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Handle (@)" placeholder="@suaempresa" value={handle} onChange={(e) => setHandle(e.target.value)} />
                        <Input label="Domínio" placeholder="suaempresa.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
                    </div>
                </Section>

                {/* Save */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
                )}

                <Button variant="primary" size="lg" onClick={save} loading={saving}>
                    {saved ? '✓ Salvo!' : 'Salvar configurações'}
                </Button>
            </div>
        </div>
    );
}
