import { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { api } from '../../../lib/api';
import { buildSystemPrompt } from '../../../lib/buildSystemPrompt';

function MiniSlide({ slide, brand }) {
    const colors = brand?.brand_config || {};
    const primary = colors.primary || '#0057B7';
    const accent = colors.accent || '#4D9AFF';
    const bg = colors.bgDark || '#040C1A';
    const modules = colors.modules || [];
    const mod = modules.find(m => m.key === slide.accentModule) || modules[0];
    const modColor = mod?.color || accent;

    return (
        <div className="rounded-xl overflow-hidden aspect-[4/5] w-full flex flex-col justify-between p-5 relative"
            style={{ background: `radial-gradient(ellipse 100% 52% at 50% -8%, ${primary}44 0%, ${bg} 55%)` }}>
            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[.04]" style={{ zIndex: 1 }}>
                {Array.from({ length: 8 }, (_, i) => <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke={accent} strokeWidth="1" />)}
                {Array.from({ length: 10 }, (_, i) => <line key={`h${i}`} x1="0" y1={`${(i + 1) * 10}%`} x2="100%" y2={`${(i + 1) * 10}%`} stroke={accent} strokeWidth="1" />)}
            </svg>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{ background: `${modColor}22`, border: `1px solid ${modColor}28`, color: modColor }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: modColor }} />
                    GESTÃO MUNICIPAL
                </span>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                {slide.stat && <div className="text-3xl font-black tracking-tighter mb-1 text-white">{slide.stat}</div>}
                <div className="text-white font-black leading-tight text-sm mb-2">{slide.headline}</div>
                {slide.subheadline && <div className="text-white/50 text-xs leading-snug">{slide.subheadline}</div>}
            </div>

            <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 10 }}>
                <span className="text-white/25 text-[9px] font-bold uppercase tracking-wider">
                    {brand?.name || 'CityOS'}
                </span>
                {slide.cta && (
                    <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full text-white"
                        style={{ background: primary }}>{slide.cta} →</span>
                )}
            </div>
        </div>
    );
}

export default function Step6Preview({ data, onBack, onFinish, saving }) {
    const [samples, setSamples] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [finishing, setFinishing] = useState(false);

    const generate = async () => {
        setGenerating(true);
        setError('');
        try {
            const tenantLike = {
                name: data.name,
                segment: data.segment,
                description: data.description,
                target_audience: data.target_audience,
                tone: data.tone,
                default_cta: data.default_cta,
                tags: data.tags,
                brand_config: data.brand_config,
            };
            const systemPrompt = buildSystemPrompt(tenantLike);

            const r = await api.posts.generate({
                systemPrompt,
                messages: [{
                    role: 'user',
                    content: `Gere 3 posts únicos de exemplo para ${data.name}.
Cada post com: headline impactante, stat opcional, subheadline.
Temas variados com base em: ${data.tags?.join(', ')}.
Responda APENAS JSON:
{"slides":[{"theme":"dark","chip":"","stat":"","statLabel":"","headline":"","subheadline":"","items":[],"cta":"${data.default_cta || ''}","accentModule":"${data.brand_config?.modules?.[0]?.key || 'none'}","phase":""}],"caption":"","hashtags":""}`,
                }],
            });

            const txt = r.content?.find(c => c.type === 'text')?.text || '{}';
            const parsed = JSON.parse(txt.replace(/```json\n?|\n?```/g, '').trim());
            if (parsed.slides?.length) setSamples(parsed.slides.slice(0, 3));
        } catch (e) {
            setError(e.message || 'Erro ao gerar amostras');
        }
        setGenerating(false);
    };

    useEffect(() => { generate(); }, []);

    const finish = async () => {
        setFinishing(true);
        await onFinish();
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Preview e Confirmação</h1>
                <p className="text-text-2">Veja como seus posts vão parecer com a identidade configurada.</p>
            </div>

            {generating ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <div className="w-10 h-10 border-2 border-blue/20 border-t-blue rounded-full animate-spin" />
                    <p className="text-sm text-text-3">Gerando amostras com IA…</p>
                </div>
            ) : samples.length ? (
                <div className="grid grid-cols-3 gap-4">
                    {samples.map((s, i) => <MiniSlide key={i} slide={s} brand={data} />)}
                </div>
            ) : error ? (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                    <button onClick={generate} className="ml-3 underline">Tentar novamente</button>
                </div>
            ) : null}

            <div className="bg-white/[.02] border border-[#0D1325] rounded-2xl p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold">Resumo da configuração</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-text-2">
                    <span><span className="text-text-3">Empresa:</span> {data.name}</span>
                    <span><span className="text-text-3">Segmento:</span> {data.segment}</span>
                    <span><span className="text-text-3">Tom:</span> {data.tone}</span>
                    <span><span className="text-text-3">Tags:</span> {data.tags?.length}</span>
                    <span><span className="text-text-3">Módulos:</span> {data.brand_config?.modules?.length}</span>
                    <span><span className="text-text-3">Plataformas:</span> {data.platforms?.join(', ')}</span>
                </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={onBack} className="w-28">← Voltar</Button>
                <Button variant="primary" className="flex-1" onClick={finish} loading={finishing || saving}>
                    🚀 Finalizar e Acessar Workspace
                </Button>
            </div>
        </div>
    );
}
