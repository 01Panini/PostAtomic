import { useState, useEffect } from 'react';
import { useBrand } from '../../contexts/BrandContext';
import { useUsage } from '../../hooks/useUsage';
import { usePosts } from '../../hooks/usePosts';
import { api } from '../../lib/api';
import { Slide } from './Slide';

const DIMS = {
    post:     { w: 1080, h: 1350, sc: 0.355, label: '1080 × 1350' },
    carousel: { w: 1080, h: 1350, sc: 0.355, label: '1080 × 1350 / slide' },
    story:    { w: 1080, h: 1920, sc: 0.235, label: '1080 × 1920' },
};

const TEMPLATES = [
    { v: 'classic',   l: 'Classic',   d: 'Escuro + Claro alternados' },
    { v: 'impact',    l: 'Impact',    d: 'Stat dominante, foco no número' },
    { v: 'contrast',  l: 'Contrast',  d: 'Split-panel problema → solução' },
    { v: 'manifesto', l: 'Manifesto', d: 'Editorial gradient, thought leadership' },
];

async function doExport(el, name) {
    if (!window.html2canvas) { alert('Exportador carregando, aguarde e tente novamente.'); return; }
    try {
        await document.fonts.ready;
        const cv = await window.html2canvas(el, {
            scale: 2, useCORS: true, allowTaint: false, logging: false,
            backgroundColor: '#03091A', width: el.offsetWidth, height: el.offsetHeight,
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

export default function PostMachine() {
    const brand = useBrand();
    const { dailyUsed, dailyLimit, plan, refresh: refreshUsage } = useUsage();
    const { save: savePost } = usePosts();

    const [fmt, setFmt] = useState('post');
    const [fw, setFw] = useState('AIDA');
    const [topic, setTopic] = useState('');
    const [custom, setCustom] = useState('');
    const [templateStyle, setTemplateStyle] = useState('classic');
    const [slides, setSlides] = useState([]);
    const [cap, setCap] = useState('');
    const [ht, setHt] = useState('');
    const [cur, setCur] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [copied, setCopied] = useState(false);

    const topics = brand?.topics?.length ? brand.topics : [
        'Dores do público-alvo', 'Resultados e ROI', 'Como funciona',
        'Cases de sucesso', 'Diferenciais',
    ];
    const activeTopic = custom.trim() || topic || topics[0];
    const dims = DIMS[fmt];
    const pw = Math.round(dims.w * dims.sc);
    const ph = Math.round(dims.h * dims.sc);
    const colors = brand?.colors || {};
    const primaryColor = colors.primary || '#2563EB';

    const used = dailyUsed || 0;
    const limit = dailyLimit || 3;
    const atLimit = used >= limit;

    useEffect(() => {
        const lnk = document.createElement('link');
        lnk.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400&display=swap';
        lnk.rel = 'stylesheet'; document.head.appendChild(lnk);
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(s);
    }, []);

    const buildPrompt = () => {
        const name = brand?.tenantMeta?.name || 'a empresa';
        const cta = brand?.tenantMeta?.defaultCta || 'Entre em contato';
        const modules = brand?.modules || [];
        const firstModKey = modules[0]?.key || 'none';

        let tplInstr = '';
        if (templateStyle === 'impact') {
            tplInstr = `TEMPLATE: IMPACT — stat gigante é o herói. Sempre inclua stat + statLabel impactantes. Headline curta e direta (máx 8 palavras). Subheadline opcional.`;
        } else if (templateStyle === 'contrast') {
            tplInstr = `TEMPLATE: CONTRAST — layout split problema/solução. Inclua 4 items (2 problemas, 2 soluções) quando possível. Headline como transformação.`;
        } else if (templateStyle === 'manifesto') {
            tplInstr = `TEMPLATE: MANIFESTO — editorial, pensamento forte. Headline como declaração audaciosa (8-12 palavras). Subheadline como citação ou provocação. Itens como bullets de convicção.`;
        }

        let instr = '';
        if (fmt === 'post') {
            instr = `Gere 1 slide (post único). Use stat impactante se aplicável.`;
        } else if (fmt === 'carousel') {
            instr = `Gere entre 5 e 10 slides para carrossel:
Slide 1 (theme:dark): hook — headline que PARA o scroll
Slides intermediários: dark para dor/problema, light para solução/resultado. Cada slide avança a história.
Slide final (theme:dark): CTA forte. Prefira 7-8 slides para temas ricos.`;
        } else {
            const phases = fw === 'AIDA'
                ? ['Atenção', 'Interesse', 'Desejo', 'Ação']
                : ['Problema', 'Agitação', 'Impacto', 'Solução', 'CTA'];
            instr = `Gere ${phases.length} slides de story · framework ${fw} · fases: ${phases.join(', ')}.
REGRA CRÍTICA: máx 2 elementos por slide — stat+headline OU headline+subheadline OU headline+items(2) OU headline+cta. NUNCA combine tudo.
Todos theme:dark.`;
        }

        return `${instr}
${tplInstr ? `\n${tplInstr}` : ''}

FOCO: ${activeTopic}
MÓDULOS DISPONÍVEIS: ${modules.map(m => m.key).join(', ') || 'none'}

REGRAS:
- chip: rótulo curto em MAIÚSCULAS relacionado ao segmento (sem emojis)
- cta: "${cta}"
- accentModule: use um dos módulos disponíveis ou "none"
- headline: hook forte, nunca genérico, nunca use emojis
- stat: número impactante quando aplicável (ex: "78%", "3×", "12mil")
- Nunca use emojis em nenhum campo

Responda APENAS JSON válido:
{"slides":[{"theme":"dark","chip":"","stat":"","statLabel":"","headline":"","subheadline":"","items":[],"cta":"${cta}","accentModule":"${firstModKey}","phase":""}],"caption":"","hashtags":""}`;
    };

    const gen = async () => {
        if (atLimit) {
            setErr(`Limite diário de ${limit} posts atingido. Renova à meia-noite.`);
            return;
        }
        setLoading(true); setErr(''); setSlides([]); setCur(0);
        try {
            const r = await api.posts.generate({
                systemPrompt: brand?.systemPrompt || '',
                messages: [{ role: 'user', content: buildPrompt() }],
                temperature: 1,
                templateStyle,
            });
            if (r.error) throw new Error(r.error);
            const txt = r.content?.find(c => c.type === 'text')?.text || '{}';
            const parsed = JSON.parse(txt.replace(/```json\n?|\n?```/g, '').trim());
            if (!parsed.slides?.length) throw new Error('Nenhum slide retornado.');
            setSlides(parsed.slides);
            setCap(parsed.caption || '');
            setHt(parsed.hashtags || '');
            savePost({
                format: fmt,
                framework: fw || null,
                topic: activeTopic,
                slides: parsed.slides,
                caption: parsed.caption,
                hashtags: parsed.hashtags,
                template_style: templateStyle,
            });
            refreshUsage();
        } catch (e) {
            setErr(e.message || 'Erro ao gerar.');
        }
        setLoading(false);
    };

    const dl = (i) => { const el = document.getElementById(`exp${i}`); if (el) doExport(el, `post-${fmt}-${i + 1}.png`); };
    const dlAll = async () => { for (let i = 0; i < slides.length; i++) { dl(i); await new Promise(r => setTimeout(r, 800)); } };
    const copy = () => navigator.clipboard.writeText(`${cap}\n\n${ht}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });

    return (
        <div className="flex overflow-hidden h-full bg-[#03091A] text-[#F0F6FF]">
            {/* ── SIDEBAR ── */}
            <div className="w-64 flex-shrink-0 bg-[#060E20] border-r border-white/[.05] flex flex-col gap-5 overflow-y-auto max-h-screen p-4">

                {/* Format selector */}
                <div>
                    <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#2D4D7E] mb-2">Formato</p>
                    {[
                        { v: 'post',     l: 'Post Único',  s: '1 slide' },
                        { v: 'carousel', l: 'Carrossel',   s: 'até 10 slides' },
                        { v: 'story',    l: 'Story',       s: '1080 × 1920' },
                    ].map(f => (
                        <button key={f.v} onClick={() => { setFmt(f.v); setSlides([]); setCur(0); }}
                            style={{ borderLeft: `3px solid ${fmt === f.v ? primaryColor : 'transparent'}` }}
                            className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg mb-1 text-left transition-all
                                ${fmt === f.v ? 'bg-white/[.06]' : 'bg-white/[.02] hover:bg-white/[.04]'}`}>
                            <span className={`text-xs font-semibold ${fmt === f.v ? 'text-[#60A5FA]' : 'text-[#4D6B8A]'}`}>{f.l}</span>
                            <span className="text-[10px] text-[#2D4D7E] font-medium">{f.s}</span>
                        </button>
                    ))}
                </div>

                {/* Story framework */}
                {fmt === 'story' && (
                    <div>
                        <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#2D4D7E] mb-2">Framework</p>
                        <div className="flex gap-1 bg-[#03091A] rounded-lg p-1">
                            {['AIDA', 'PAIS'].map(f => (
                                <button key={f} onClick={() => setFw(f)}
                                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all
                                        ${fw === f ? 'bg-[#2563EB] text-white' : 'text-[#2D4D7E] hover:text-[#4D6B8A]'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-[#2D4D7E] mt-2 leading-relaxed">
                            {fw === 'AIDA' ? 'Atenção → Interesse → Desejo → Ação' : 'Problema → Agitação → Impacto → Solução → CTA'}
                        </p>
                    </div>
                )}

                {/* Template style */}
                <div>
                    <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#2D4D7E] mb-2">Template</p>
                    <div className="flex flex-col gap-1">
                        {TEMPLATES.map(t => (
                            <button key={t.v} onClick={() => setTemplateStyle(t.v)}
                                className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all
                                    ${templateStyle === t.v
                                        ? 'border-[#2563EB]/40 bg-[#2563EB]/[.1] text-[#60A5FA]'
                                        : 'border-transparent text-[#4D6B8A] hover:text-[#8BA8C8] hover:bg-white/[.03]'
                                    }`}>
                                <span className="font-semibold">{t.l}</span>
                                {templateStyle === t.v && (
                                    <span className="block text-[10px] text-[#4D6B8A] mt-0.5 font-normal">{t.d}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Topics */}
                <div>
                    <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#2D4D7E] mb-2">Foco do Conteúdo</p>
                    <div className="flex flex-col gap-1 mb-3">
                        {topics.map(t => (
                            <button key={t} onClick={() => { setTopic(t); setCustom(''); }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all
                                    ${topic === t && !custom
                                        ? 'border-[#2563EB]/40 text-[#60A5FA] bg-[#2563EB]/[.08]'
                                        : 'border-[#1E3560] text-[#4D6B8A] hover:text-[#8BA8C8]'
                                    }`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <textarea rows={2} value={custom} onChange={e => setCustom(e.target.value)}
                        placeholder="Ou escreva foco customizado…"
                        className="w-full bg-[#03091A] border border-[#1E3560] rounded-lg text-[#F0F6FF] text-xs px-3 py-2 resize-none outline-none placeholder:text-[#2D4D7E] focus:border-[#2563EB]/60 transition-colors" />
                </div>

                {/* Daily usage */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#2D4D7E]">Hoje</p>
                        <p className={`text-[10px] font-bold ${atLimit ? 'text-[#EF4444]' : 'text-[#2D4D7E]'}`}>{used}/{limit}</p>
                    </div>
                    <div className="h-1.5 bg-[#0A1628] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((used / limit) * 100, 100)}%`, background: atLimit ? '#EF4444' : primaryColor }} />
                    </div>
                    <p className="text-[10px] text-[#2D4D7E] mt-1">Renova às 00:00 · {plan || 'trial'}</p>
                </div>

                {/* Generate button */}
                <button onClick={gen} disabled={loading || atLimit}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:scale-[.98]"
                    style={{
                        background: atLimit ? '#1E3560' : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                        boxShadow: atLimit ? 'none' : `0 4px 24px rgba(37,99,235,0.45)`,
                    }}>
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                            Pesquisando e gerando…
                        </>
                    ) : atLimit ? (
                        'Limite diário atingido'
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Gerar Post
                        </>
                    )}
                </button>

                {err && (
                    <div className="bg-[#EF4444]/10 border border-[#EF4444]/25 rounded-xl p-3 text-xs text-[#F87171] leading-relaxed">
                        {err}
                    </div>
                )}
            </div>

            {/* ── MAIN CANVAS ── */}
            <div className="flex-1 overflow-y-auto">
                {!loading && !slides.length && (
                    <div className="h-full flex flex-col items-center justify-center gap-4 p-10 text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#2563EB]/[.08] border border-[#2563EB]/15">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold mb-2 tracking-tight">Pronto para gerar</p>
                            <p className="text-sm text-[#4D6B8A] max-w-xs leading-relaxed">
                                Escolha o formato, template e foco, depois clique em{' '}
                                <strong className="text-[#60A5FA]">Gerar Post</strong>.
                            </p>
                            <p className="text-xs text-[#2D4D7E] mt-3">
                                O sistema pesquisa dados reais antes de cada geração.
                            </p>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="h-full flex flex-col items-center justify-center gap-5">
                        <div className="w-10 h-10 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
                        <div className="text-center">
                            <p className="text-sm text-[#8BA8C8] tracking-wide">Pesquisando dados reais…</p>
                            <p className="text-xs text-[#4D6B8A] mt-1">Gerando conteúdo estratégico</p>
                        </div>
                    </div>
                )}

                {!loading && slides.length > 0 && (
                    <div className="p-6 flex flex-col gap-5">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-base font-bold tracking-tight">
                                    {fmt === 'post' ? 'Post Único' : fmt === 'carousel' ? 'Carrossel' : `Story · ${fw}`}
                                    <span className="ml-2 text-xs font-medium text-[#4D6B8A] capitalize">· {templateStyle}</span>
                                </p>
                                <p className="text-[10px] text-[#4D6B8A] font-medium uppercase tracking-widest mt-0.5">
                                    {slides.length} slide{slides.length > 1 ? 's' : ''} · {dims.label}
                                </p>
                            </div>
                            {slides.length > 1 && (
                                <button onClick={dlAll}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1E3560] bg-white/[.03] text-[#4D6B8A] text-xs font-medium hover:border-[#2563EB]/40 hover:text-[#60A5FA] transition-all">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                    Baixar Todos
                                </button>
                            )}
                        </div>

                        <div className="flex gap-5 items-start">
                            {/* Slide preview */}
                            <div className="flex flex-col items-center gap-3 flex-shrink-0">
                                <div className="overflow-hidden rounded-xl border border-white/[.07] shadow-card"
                                    style={{ width: pw, height: ph }}>
                                    <div style={{ width: dims.w, height: dims.h, transform: `scale(${dims.sc})`, transformOrigin: 'top left' }}>
                                        <Slide slide={slides[cur]} w={dims.w} h={dims.h} fmt={fmt} idx={cur} total={slides.length} templateStyle={templateStyle} />
                                    </div>
                                </div>

                                {slides.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setCur(c => (c - 1 + slides.length) % slides.length)}
                                            className="w-8 h-8 rounded-full border border-[#1E3560] bg-[#060E20] text-[#4D6B8A] flex items-center justify-center hover:border-[#2563EB]/40 hover:text-[#60A5FA] transition-all text-sm">←</button>
                                        <div className="flex gap-1.5">
                                            {slides.map((_, i) => (
                                                <button key={i} onClick={() => setCur(i)}
                                                    className={`rounded-full transition-all ${i === cur ? 'w-5 h-1.5 bg-[#2563EB]' : 'w-1.5 h-1.5 bg-[#1E3560]'}`} />
                                            ))}
                                        </div>
                                        <button onClick={() => setCur(c => (c + 1) % slides.length)}
                                            className="w-8 h-8 rounded-full border border-[#1E3560] bg-[#060E20] text-[#4D6B8A] flex items-center justify-center hover:border-[#2563EB]/40 hover:text-[#60A5FA] transition-all text-sm">→</button>
                                    </div>
                                )}

                                <button onClick={() => dl(cur)}
                                    className="flex items-center gap-2 border border-[#1E3560] bg-white/[.03] text-[#4D6B8A] text-xs font-medium py-2 px-4 rounded-lg hover:text-[#60A5FA] hover:border-[#2563EB]/40 transition-all"
                                    style={{ width: pw }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                    Baixar Slide {cur + 1}/{slides.length}
                                </button>
                            </div>

                            {/* Slide strip */}
                            {slides.length > 1 && (
                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                    <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#2D4D7E]">Todos os slides</p>
                                    {slides.map((sl, i) => (
                                        <div key={i} onClick={() => setCur(i)}
                                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all
                                                ${i === cur ? 'bg-[#2563EB]/[.1] border-[#2563EB]/30' : 'bg-white/[.02] border-white/[.04] hover:border-white/[.08]'}`}>
                                            <div className="w-7 overflow-hidden rounded-md border border-white/[.07] flex-shrink-0"
                                                style={{ height: Math.round(28 * (dims.h / dims.w)) }}>
                                                <div style={{ width: dims.w, height: dims.h, transform: `scale(${28 / dims.w})`, transformOrigin: 'top left' }}>
                                                    <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} templateStyle={templateStyle} />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium truncate ${i === cur ? 'text-[#60A5FA]' : 'text-[#4D6B8A]'}`}>
                                                    {sl.phase ? `${sl.phase} — ` : `Slide ${i + 1} — `}
                                                    {(sl.headline || '').substring(0, 28)}{sl.headline?.length > 28 ? '…' : ''}
                                                </p>
                                                <p className="text-[10px] text-[#2D4D7E] mt-0.5">{sl.theme === 'light' ? 'Light' : 'Dark'}</p>
                                            </div>
                                            <button onClick={e => { e.stopPropagation(); dl(i); }}
                                                className="text-[#2D4D7E] hover:text-[#60A5FA] text-sm transition-colors flex-shrink-0">↓</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Caption */}
                        {cap && (
                            <div className="bg-[#060E20] border border-white/[.05] rounded-xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#4D6B8A]">Caption Sugerida</p>
                                    <button onClick={copy}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/[.08] text-[#60A5FA] hover:bg-[#2563EB]/[.15] transition-colors">
                                        {copied ? 'Copiado!' : 'Copiar Tudo'}
                                    </button>
                                </div>
                                <p className="text-sm text-[#8BA8C8] leading-relaxed mb-2 whitespace-pre-wrap">{cap}</p>
                                <p className="text-xs text-[#60A5FA] font-medium leading-relaxed">{ht}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* EXPORT CONTAINER (off-screen) */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                {slides.map((sl, i) => (
                    <div key={i} id={`exp${i}`} style={{ width: dims.w, height: dims.h, overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#03091A', position: 'relative' }}>
                        <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} templateStyle={templateStyle} />
                    </div>
                ))}
            </div>
        </div>
    );
}
