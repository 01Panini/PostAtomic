import { useState, useEffect } from 'react';
import { useBrand } from '../../contexts/BrandContext';
import { useUsage } from '../../hooks/useUsage';
import { usePosts } from '../../hooks/usePosts';
import { useMobile } from '../../hooks/useMobile';
import { api } from '../../lib/api';
import { Slide } from './Slide';

const DIMS = {
    post:     { w: 1080, h: 1350, label: '1080 × 1350' },
    carousel: { w: 1080, h: 1350, label: '1080 × 1350 / slide' },
    story:    { w: 1080, h: 1920, label: '1080 × 1920' },
};

const TEMPLATES = [
    { v: 'classic',   l: 'Classic' },
    { v: 'impact',    l: 'Impact' },
    { v: 'contrast',  l: 'Contrast' },
    { v: 'manifesto', l: 'Manifesto' },
];

async function doExport(el, name) {
    if (!window.html2canvas) { alert('Exportador carregando, tente novamente.'); return; }
    try {
        await document.fonts.ready;
        const cv = await window.html2canvas(el, {
            scale: 2, useCORS: true, allowTaint: false, logging: false,
            backgroundColor: '#050505', width: el.offsetWidth, height: el.offsetHeight,
            scrollX: 0, scrollY: 0,
        });
        cv.toBlob((blob) => {
            const u = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = u; a.download = name; a.click();
            setTimeout(() => URL.revokeObjectURL(u), 5000);
        }, 'image/png');
    } catch (e) { console.error(e); alert('Erro ao exportar.'); }
}

function SLabel({ children }) {
    return <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#616161', marginBottom: 6, paddingLeft: 2 }}>{children}</p>;
}

/* ── Reusable controls content (used in both sidebar and mobile sheet) ── */
function ControlsContent({ fmt, setFmt, fw, setFw, tpl, setTpl, topic, setTopic, custom, setCustom, topics, primaryColor, used, limit, atLimit, plan, loading, gen, err, slides, setCur }) {
    const pill = (active) => ({
        padding: '5px 11px', borderRadius: 9999, fontSize: 12, fontWeight: active ? 500 : 400,
        background: active ? '#191919' : 'transparent',
        color: active ? '#FFFFFF' : '#616161',
        border: `1px solid ${active ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Format */}
            <div>
                <SLabel>Formato</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[{ v: 'post', l: 'Post Único', s: '1 slide' }, { v: 'carousel', l: 'Carrossel', s: 'até 10' }, { v: 'story', l: 'Story', s: '1080×1920' }].map(f => (
                        <button key={f.v} onClick={() => { setFmt(f.v); setCur(0); }}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                                background: fmt === f.v ? '#191919' : 'transparent',
                                border: `1px solid ${fmt === f.v ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                                borderLeft: `2px solid ${fmt === f.v ? primaryColor : 'transparent'}`,
                                transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
                            }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: fmt === f.v ? '#FFFFFF' : '#A8A8A8' }}>{f.l}</span>
                            <span style={{ fontSize: 11, color: '#616161' }}>{f.s}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story framework */}
            {fmt === 'story' && (
                <div>
                    <SLabel>Framework</SLabel>
                    <div style={{ display: 'flex', gap: 4, background: '#0F0F0F', borderRadius: 8, padding: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
                        {['AIDA', 'PAIS'].map(f => (
                            <button key={f} onClick={() => setFw(f)}
                                style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: fw === f ? 600 : 400, background: fw === f ? '#191919' : 'transparent', color: fw === f ? '#FFFFFF' : '#616161', transition: 'all 0.15s' }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Template */}
            <div>
                <SLabel>Template</SLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {TEMPLATES.map(t => (
                        <button key={t.v} onClick={() => setTpl(t.v)} style={pill(tpl === t.v)}>{t.l}</button>
                    ))}
                </div>
            </div>

            {/* Topic */}
            <div>
                <SLabel>Foco</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
                    {topics.map(t => (
                        <button key={t} onClick={() => { setTopic(t); setCustom(''); }}
                            style={{
                                textAlign: 'left', padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
                                fontSize: 12, fontFamily: 'Inter, sans-serif',
                                background: topic === t && !custom ? 'rgba(12,201,129,0.08)' : 'transparent',
                                color: topic === t && !custom ? '#0CC981' : '#A8A8A8',
                                border: `1px solid ${topic === t && !custom ? 'rgba(12,201,129,0.2)' : 'transparent'}`,
                                transition: 'all 0.15s',
                            }}>
                            {t}
                        </button>
                    ))}
                </div>
                <textarea rows={2} value={custom} onChange={e => setCustom(e.target.value)}
                    placeholder="Ou escreva foco customizado…"
                    style={{ width: '100%', background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#FFFFFF', fontSize: 12, padding: '8px 10px', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s', boxSizing: 'border-box' }} />
            </div>

            {/* Daily */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <SLabel>Hoje</SLabel>
                    <span style={{ fontSize: 11, fontWeight: 600, color: atLimit ? '#F87171' : '#A8A8A8' }}>{used}/{limit}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${Math.min((used / limit) * 100, 100)}%`, background: atLimit ? '#EF4444' : '#0CC981', borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 10, color: '#616161' }}>Renova às 00:00 · {plan || 'trial'}</p>
            </div>

            {/* Generate */}
            <button onClick={gen} disabled={loading || atLimit}
                style={{
                    width: '100%', padding: '11px 0', borderRadius: 9999,
                    background: atLimit ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                    color: atLimit ? '#616161' : '#050505',
                    border: atLimit ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    fontSize: 13, fontWeight: 700, cursor: loading || atLimit ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'all 0.15s',
                }}>
                {loading
                    ? <><span style={{ width: 13, height: 13, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#050505', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Gerando…</>
                    : atLimit ? 'Limite atingido' : 'Gerar Post'}
            </button>

            {err && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#F87171', lineHeight: 1.5 }}>
                    {err}
                </div>
            )}
        </div>
    );
}

export default function PostMachine() {
    const brand = useBrand();
    const { dailyUsed, dailyLimit, plan, refresh: refreshUsage } = useUsage();
    const { save: savePost } = usePosts();
    const isMobile = useMobile();

    const [fmt, setFmt] = useState('post');
    const [fw, setFw] = useState('AIDA');
    const [topic, setTopic] = useState('');
    const [custom, setCustom] = useState('');
    const [tpl, setTpl] = useState('classic');
    const [slides, setSlides] = useState([]);
    const [cap, setCap] = useState('');
    const [ht, setHt] = useState('');
    const [cur, setCur] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [copied, setCopied] = useState(false);
    const [controlsOpen, setControlsOpen] = useState(true); // mobile sheet open/close

    const topics = brand?.topics?.length ? brand.topics
        : ['Dores do público-alvo', 'Resultados e ROI', 'Como funciona', 'Cases de sucesso', 'Diferenciais'];
    const activeTopic = custom.trim() || topic || topics[0];
    const dims = DIMS[fmt];
    const colors = brand?.colors || {};
    const primaryColor = colors.primary || '#0CC981';
    const used = dailyUsed || 0;
    const limit = dailyLimit || 3;
    const atLimit = used >= limit;

    // Compute slide display scale
    const slideScale = isMobile
        ? Math.min((window.innerWidth - 32) / dims.w, 0.33)
        : 0.33;
    const pw = Math.round(dims.w * slideScale);
    const ph = Math.round(dims.h * slideScale);

    useEffect(() => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(s);
        // Satoshi font for export rendering
        const lnk = document.createElement('link');
        lnk.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400&display=swap';
        lnk.rel = 'stylesheet'; document.head.appendChild(lnk);
    }, []);

    const buildPrompt = () => {
        const cta = brand?.tenantMeta?.defaultCta || 'Entre em contato';
        const modules = brand?.modules || [];
        const firstModKey = modules[0]?.key || 'none';

        let tplInstr = '';
        if (tpl === 'impact') tplInstr = `TEMPLATE: IMPACT — stat gigante é o herói. Inclua stat + statLabel impactantes obrigatoriamente. Headline curta (máx 8 palavras).`;
        else if (tpl === 'contrast') tplInstr = `TEMPLATE: CONTRAST — layout split problema/solução. 4 items (2 problemas, 2 soluções). Headline como transformação.`;
        else if (tpl === 'manifesto') tplInstr = `TEMPLATE: MANIFESTO — declaração audaciosa (8-12 palavras). Subheadline como provocação. Items como bullets de convicção.`;

        let instr = '';
        if (fmt === 'post') {
            instr = `Gere 1 slide (post único). Use stat impactante se aplicável.`;
        } else if (fmt === 'carousel') {
            instr = `Gere 5-10 slides carrossel:\nSlide 1 (theme:dark): hook que PARA o scroll\nSlides intermediários: alterne dark (problema) e light (solução)\nSlide final (theme:dark): CTA forte`;
        } else {
            const phases = fw === 'AIDA' ? ['Atenção','Interesse','Desejo','Ação'] : ['Problema','Agitação','Impacto','Solução','CTA'];
            instr = `Gere ${phases.length} slides de story, framework ${fw}, fases: ${phases.join(', ')}. Máx 2 elementos por slide. Todos theme:dark.`;
        }

        return `${instr}${tplInstr ? '\n' + tplInstr : ''}

FOCO: ${activeTopic}
MÓDULOS: ${modules.map(m => m.key).join(', ') || 'none'}

REGRAS:
- chip: rótulo curto MAIÚSCULAS do segmento (sem emojis)
- cta: "${cta}"
- accentModule: um dos módulos ou "none"
- headline: hook forte, sem emojis
- stat: número impactante quando aplicável
- Nunca use emojis em nenhum campo

JSON válido apenas:
{"slides":[{"theme":"dark","chip":"","stat":"","statLabel":"","headline":"","subheadline":"","items":[],"cta":"${cta}","accentModule":"${firstModKey}","phase":""}],"caption":"","hashtags":""}`;
    };

    const gen = async () => {
        if (atLimit) { setErr(`Limite de ${limit} posts por dia atingido. Renova à meia-noite.`); return; }
        setLoading(true); setErr(''); setSlides([]); setCur(0);
        // On mobile: collapse controls sheet when generating
        if (isMobile) setControlsOpen(false);
        try {
            const r = await api.posts.generate({
                systemPrompt: brand?.systemPrompt || '',
                messages: [{ role: 'user', content: buildPrompt() }],
                temperature: 1,
                templateStyle: tpl,
            });
            if (r.error) throw new Error(r.error);
            const txt = r.content?.find(c => c.type === 'text')?.text || '{}';
            const parsed = JSON.parse(txt.replace(/```json\n?|\n?```/g, '').trim());
            if (!parsed.slides?.length) throw new Error('Nenhum slide retornado.');
            setSlides(parsed.slides); setCap(parsed.caption || ''); setHt(parsed.hashtags || '');
            savePost({ format: fmt, framework: fw || null, topic: activeTopic, slides: parsed.slides, caption: parsed.caption, hashtags: parsed.hashtags, template_style: tpl });
            refreshUsage();
        } catch (e) { setErr(e.message || 'Erro ao gerar.'); }
        setLoading(false);
    };

    const dl = i => { const el = document.getElementById(`exp${i}`); if (el) doExport(el, `post-${fmt}-${i + 1}.png`); };
    const dlAll = async () => { for (let i = 0; i < slides.length; i++) { dl(i); await new Promise(r => setTimeout(r, 800)); } };
    const copy = () => navigator.clipboard.writeText(`${cap}\n\n${ht}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });

    const controlsProps = { fmt, setFmt, fw, setFw, tpl, setTpl, topic, setTopic, custom, setCustom, topics, primaryColor, used, limit, atLimit, plan, loading, gen, err, slides, setCur };

    /* ──────────────────────────── CANVAS section ──────────────────────────── */
    const renderCanvas = () => {
        if (loading) return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.08)', borderTopColor: '#0CC981', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#A8A8A8' }}>Pesquisando dados reais…</p>
                    <p style={{ fontSize: 11, color: '#616161', marginTop: 4 }}>Gerando conteúdo estratégico</p>
                </div>
            </div>
        );

        if (!slides.length) return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40, textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: '#121212', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0CC981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Pronto para gerar</p>
                    <p style={{ fontSize: 13, color: '#616161', maxWidth: 260, lineHeight: 1.6 }}>
                        {isMobile ? 'Configure acima e toque em Gerar Post.' : 'Escolha formato, template e foco. O sistema pesquisa dados reais antes de gerar.'}
                    </p>
                </div>
            </div>
        );

        return (
            <div style={{ padding: isMobile ? '16px 16px 80px' : 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Top bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>
                            {fmt === 'post' ? 'Post Único' : fmt === 'carousel' ? 'Carrossel' : `Story · ${fw}`}
                            <span style={{ fontSize: 12, fontWeight: 400, color: '#616161', marginLeft: 8, textTransform: 'capitalize' }}>· {tpl}</span>
                        </p>
                        <p style={{ fontSize: 11, color: '#616161', marginTop: 2 }}>{slides.length} slide{slides.length > 1 ? 's' : ''} · {dims.label}</p>
                    </div>
                    {slides.length > 1 && !isMobile && (
                        <button onClick={dlAll}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, color: '#A8A8A8', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            Baixar Todos
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
                    {/* Slide preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                        <div style={{ overflow: 'hidden', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)', width: pw, height: ph }}>
                            <div style={{ width: dims.w, height: dims.h, transform: `scale(${slideScale})`, transformOrigin: 'top left' }}>
                                <Slide slide={slides[cur]} w={dims.w} h={dims.h} fmt={fmt} idx={cur} total={slides.length} templateStyle={tpl} />
                            </div>
                        </div>

                        {/* Navigation dots */}
                        {slides.length > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button onClick={() => setCur(c => (c - 1 + slides.length) % slides.length)}
                                    style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: '#121212', color: '#A8A8A8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.15s' }}>←</button>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    {slides.map((_, i) => (
                                        <button key={i} onClick={() => setCur(i)}
                                            style={{ borderRadius: 99, border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: i === cur ? 18 : 6, height: 6, background: i === cur ? '#0CC981' : 'rgba(255,255,255,0.15)' }} />
                                    ))}
                                </div>
                                <button onClick={() => setCur(c => (c + 1) % slides.length)}
                                    style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: '#121212', color: '#A8A8A8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.15s' }}>→</button>
                            </div>
                        )}

                        {/* Download current slide */}
                        <button onClick={() => dl(cur)}
                            style={{ width: pw, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, color: '#A8A8A8', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            Baixar Slide {cur + 1}/{slides.length}
                        </button>
                    </div>

                    {/* Slide strip (desktop only) */}
                    {slides.length > 1 && !isMobile && (
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#616161' }}>Todos os slides</p>
                            {slides.map((sl, i) => (
                                <div key={i} onClick={() => setCur(i)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                                        background: i === cur ? 'rgba(255,255,255,0.04)' : 'transparent',
                                        border: `1px solid ${i === cur ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
                                        transition: 'all 0.15s',
                                    }}>
                                    <div style={{ width: 28, height: Math.round(28 * (dims.h / dims.w)), overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                                        <div style={{ width: dims.w, height: dims.h, transform: `scale(${28 / dims.w})`, transformOrigin: 'top left' }}>
                                            <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} templateStyle={tpl} />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 12, fontWeight: 500, color: i === cur ? '#FFFFFF' : '#A8A8A8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {sl.phase ? `${sl.phase} — ` : `Slide ${i + 1} — `}{(sl.headline || '').substring(0, 30)}{sl.headline?.length > 30 ? '…' : ''}
                                        </p>
                                        <p style={{ fontSize: 10, color: '#616161', marginTop: 2 }}>{sl.theme === 'light' ? 'Light' : 'Dark'}</p>
                                    </div>
                                    <button onClick={e => { e.stopPropagation(); dl(i); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616161', fontSize: 14, flexShrink: 0, padding: '0 2px', transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#616161'}>↓</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mobile slide list (horizontal scroll) */}
                    {slides.length > 1 && isMobile && (
                        <div style={{ width: '100%' }}>
                            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#616161', marginBottom: 8 }}>Todos os slides</p>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
                                {slides.map((sl, i) => {
                                    const tsc = 40 / dims.w;
                                    const th = Math.round(40 * (dims.h / dims.w));
                                    return (
                                        <button key={i} onClick={() => setCur(i)}
                                            style={{ flexShrink: 0, borderRadius: 6, border: `2px solid ${i === cur ? '#0CC981' : 'rgba(255,255,255,0.08)'}`, overflow: 'hidden', background: 'none', cursor: 'pointer', padding: 0, width: 40, height: th, transition: 'border-color 0.15s' }}>
                                            <div style={{ width: dims.w, height: dims.h, transform: `scale(${tsc})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                                                <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} templateStyle={tpl} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Caption */}
                {cap && (
                    <div style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#616161' }}>Caption Sugerida</p>
                            <button onClick={copy}
                                style={{ fontSize: 12, padding: '5px 12px', borderRadius: 9999, border: '1px solid rgba(12,201,129,0.3)', background: 'rgba(12,201,129,0.08)', color: '#0CC981', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}>
                                {copied ? 'Copiado!' : 'Copiar Tudo'}
                            </button>
                        </div>
                        <p style={{ fontSize: 13, color: '#A8A8A8', lineHeight: 1.7, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{cap}</p>
                        <p style={{ fontSize: 12, color: '#0CC981', lineHeight: 1.6 }}>{ht}</p>
                    </div>
                )}
            </div>
        );
    };

    /* ──────────────────────────── RENDER ──────────────────────────────────── */
    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', overflow: 'hidden', background: '#050505', fontFamily: 'Inter, sans-serif', color: '#FFFFFF' }}>

            {/* ── MOBILE: collapsible controls sheet ── */}
            {isMobile && (
                <div>
                    {/* Toggle pill */}
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050505' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {[
                                { v: 'post', l: 'Post' }, { v: 'carousel', l: 'Carrossel' }, { v: 'story', l: 'Story' }
                            ].map(f => (
                                <button key={f.v} onClick={() => { setFmt(f.v); setCur(0); }}
                                    style={{ padding: '4px 10px', borderRadius: 99, fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s', fontWeight: fmt === f.v ? 600 : 400, background: fmt === f.v ? '#191919' : 'transparent', color: fmt === f.v ? '#FFFFFF' : '#616161', border: `1px solid ${fmt === f.v ? 'rgba(255,255,255,0.12)' : 'transparent'}` }}>
                                    {f.l}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setControlsOpen(v => !v)}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer', background: controlsOpen ? 'rgba(12,201,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${controlsOpen ? 'rgba(12,201,129,0.25)' : 'rgba(255,255,255,0.1)'}`, color: controlsOpen ? '#0CC981' : '#A8A8A8', transition: 'all 0.15s' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            {controlsOpen ? 'Fechar' : 'Configurar'}
                        </button>
                    </div>

                    {/* Expandable panel */}
                    <div className="pm-controls-sheet" style={{ maxHeight: controlsOpen ? 700 : 0, overflowY: controlsOpen ? 'auto' : 'hidden' }}>
                        <div style={{ padding: '16px 16px 20px' }}>
                            <ControlsContent {...controlsProps} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── DESKTOP: left sidebar ── */}
            {!isMobile && (
                <div style={{ width: 240, flexShrink: 0, background: '#050505', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <div style={{ padding: '16px 14px' }}>
                        <ControlsContent {...controlsProps} />
                    </div>
                </div>
            )}

            {/* ── CANVAS ── */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#050505', display: 'flex', flexDirection: 'column' }}>
                {renderCanvas()}
            </div>

            {/* Off-screen export targets */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                {slides.map((sl, i) => (
                    <div key={i} id={`exp${i}`} style={{ width: dims.w, height: dims.h, overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#050505', position: 'relative' }}>
                        <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} templateStyle={tpl} />
                    </div>
                ))}
            </div>
        </div>
    );
}
