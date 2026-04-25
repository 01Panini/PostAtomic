import { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { api } from '../../../lib/api';
import { buildSystemPrompt } from '../../../lib/buildSystemPrompt';

function MiniSlide({ slide, brand }) {
    const colors = brand?.brand_config || {};
    const primary = colors.primary || '#0CC981';
    const accent = colors.accent || '#00FF2A';
    const bg = colors.bgDark || '#050505';
    const modules = colors.modules || [];
    const mod = modules.find(m => m.key === slide.accentModule) || modules[0];
    const modColor = mod?.color || accent;

    return (
        <div style={{
            borderRadius: 12, overflow: 'hidden', aspectRatio: '4/5', width: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 16, position: 'relative',
            background: `radial-gradient(ellipse 100% 52% at 50% -8%, ${primary}44 0%, ${bg} 55%)`,
        }}>
            <div>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '4px 8px', borderRadius: 9999,
                    background: `${modColor}22`, border: `1px solid ${modColor}28`, color: modColor,
                    fontFamily: 'Inter, sans-serif',
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: modColor, flexShrink: 0 }} />
                    {mod?.name || 'MÓDULO'}
                </span>
            </div>

            <div>
                {slide.stat && <div style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', lineHeight: 1, marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>{slide.stat}</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4, marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>{slide.headline}</div>
                {slide.subheadline && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>{slide.subheadline}</div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
                    {brand?.name || 'PostAtomic'}
                </span>
                {slide.cta && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 9999, background: primary, color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                        {slide.cta} →
                    </span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Inter, sans-serif' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF', marginBottom: 8 }}>Preview e Confirmação</h1>
                <p style={{ fontSize: 14, color: '#A8A8A8' }}>Veja como seus posts vão parecer com a identidade configurada.</p>
            </div>

            {generating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '60px 0' }}>
                    <div style={{ width: 32, height: 32, border: '2px solid rgba(12,201,129,0.2)', borderTopColor: '#0CC981', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    <p style={{ fontSize: 13, color: '#616161' }}>Gerando amostras com IA…</p>
                </div>
            ) : samples.length ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    {samples.map((s, i) => <MiniSlide key={i} slide={s} brand={data} />)}
                </div>
            ) : error ? (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#F87171' }}>
                    {error}
                    <button onClick={generate} style={{ marginLeft: 10, textDecoration: 'underline', background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Tentar novamente</button>
                </div>
            ) : null}

            {/* Summary */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 12 }}>Resumo da configuração</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                        ['Empresa', data.name],
                        ['Segmento', data.segment],
                        ['Tom', data.tone],
                        ['Tags', data.tags?.length],
                        ['Módulos', data.brand_config?.modules?.length],
                        ['Plataformas', data.platforms?.join(', ')],
                    ].map(([k, v]) => (
                        <span key={k} style={{ fontSize: 12, color: '#A8A8A8' }}>
                            <span style={{ color: '#616161' }}>{k}:</span> {v}
                        </span>
                    ))}
                </div>
            </div>

            {error && <p style={{ fontSize: 12, color: '#F87171' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" size="md" onClick={onBack} style={{ width: 100 }}>← Voltar</Button>
                <Button variant="primary" onClick={finish} loading={finishing || saving} style={{ flex: 1 }}>
                    Finalizar e Acessar Workspace
                </Button>
            </div>
        </div>
    );
}
