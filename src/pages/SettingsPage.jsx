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
        <div className="bg-[#060E20] border border-white/[.05] rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-[#F0F6FF] border-b border-white/[.05] pb-4">{title}</h2>
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

    const [name, setName] = useState(tenant?.name || '');
    const [description, setDescription] = useState(tenant?.description || '');
    const [segment, setSegment] = useState(tenant?.segment || '');
    const [tone, setTone] = useState(tenant?.tone || '');
    const [defaultCta, setDefaultCta] = useState(tenant?.default_cta || '');
    const [tags, setTags] = useState(tenant?.tags || []);

    const cfg = tenant?.brand_config || {};
    const [primary, setPrimary] = useState(cfg.primary || '#2563EB');
    const [accent, setAccent] = useState(cfg.accent || '#60A5FA');
    const [bgDark, setBgDark] = useState(cfg.bgDark || '#03091A');
    const [bgLight, setBgLight] = useState(cfg.bgLight || '#F4F6F9');

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
                name, description, segment, tone,
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
            <div className="h-full flex items-center justify-center p-8 bg-[#03091A]">
                <div className="text-center max-w-sm">
                    <div className="w-14 h-14 rounded-2xl bg-[#1E3560] border border-white/[.05] flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#4D6B8A" strokeWidth="1.8" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#4D6B8A" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p className="text-base font-bold text-[#F0F6FF] mb-2">Apenas o proprietário</p>
                    <p className="text-sm text-[#4D6B8A]">Somente o owner da conta pode editar as configurações da marca.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 bg-[#03091A]">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1 text-[#F0F6FF]">Configurações</h1>
                    <p className="text-sm text-[#4D6B8A]">Edite a identidade e a marca do workspace.</p>
                </div>

                {/* Identity */}
                <Section title="Identidade">
                    <Input label="Nome da empresa" value={name} onChange={(e) => setName(e.target.value)} />
                    <div>
                        <label className="block text-[10px] font-bold tracking-[.12em] uppercase text-[#4D6B8A] mb-2">Descrição</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[#03091A] border border-[#1E3560] rounded-xl text-[#F0F6FF] text-sm px-4 py-3 outline-none resize-none placeholder:text-[#2D4D7E] focus:border-[#2563EB]/60 transition-colors" />
                    </div>
                    <Input label="Segmento" value={segment} onChange={(e) => setSegment(e.target.value)} placeholder="Ex: Govtech, SaaS, Saúde…" />
                    <Input label="Tom de voz" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Ex: Autoritativo, Próximo, Técnico…" />
                    <Input label="CTA padrão" value={defaultCta} onChange={(e) => setDefaultCta(e.target.value)} placeholder="Ex: Agende uma demo" />
                </Section>

                {/* Tags */}
                <Section title="Tags de Conteúdo">
                    <TagInput tags={tags} onChange={setTags} min={0} max={15} suggestions={[]} />
                    <p className="text-xs text-[#4D6B8A]">Tags orientam a IA na geração de conteúdo.</p>
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
                            <div key={m.key || i} className="flex items-center gap-3 bg-[#03091A] border border-[#1E3560] rounded-xl p-3">
                                <div className="flex-1">
                                    <Input label={`Módulo ${i + 1}`} value={m.name}
                                        onChange={(e) => setModules(ms => ms.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                                </div>
                                <div className="w-32 flex-shrink-0">
                                    <ColorPicker label="Cor" value={m.color}
                                        onChange={(v) => setModules(ms => ms.map((x, j) => j === i ? { ...x, color: v } : x))} />
                                </div>
                                <button onClick={() => setModules(ms => ms.filter((_, j) => j !== i))}
                                    className="text-[#4D6B8A] hover:text-[#EF4444] transition-colors text-xl mt-4 flex-shrink-0">×</button>
                            </div>
                        ))}
                        {modules.length < 5 && (
                            <button onClick={() => setModules(m => [...m, { key: `mod_${Date.now()}`, name: '', color: accent }])}
                                className="w-full border border-dashed border-[#1E3560] rounded-xl py-3 text-sm text-[#4D6B8A] hover:border-[#2563EB]/40 hover:text-[#60A5FA] transition-colors">
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
                    <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl px-4 py-3 text-sm text-[#F87171]">{error}</div>
                )}

                <Button variant="primary" size="lg" onClick={save} loading={saving}>
                    {saved ? 'Salvo com sucesso' : 'Salvar configurações'}
                </Button>
            </div>
        </div>
    );
}
