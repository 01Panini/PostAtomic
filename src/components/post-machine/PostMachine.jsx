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

async function doExport(el, name) {
    if (!window.html2canvas) { alert('Exportador carregando, aguarde e tente novamente.'); return; }
    try {
        await document.fonts.ready;
        const cv = await window.html2canvas(el, {
            scale: 2, useCORS: true, allowTaint: false, logging: false,
            backgroundColor: '#040C1A', width: el.offsetWidth, height: el.offsetHeight,
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
    const { used, limit, plan, refresh: refreshUsage } = useUsage();
    const { save: savePost } = usePosts();

    const [fmt, setFmt] = useState('post');
    const [fw, setFw] = useState('AIDA');
    const [topic, setTopic] = useState('');
    const [custom, setCustom] = useState('');
    const [slides, setSlides] = useState([]);
    const [cap, setCap] = useState('');
    const [ht, setHt] = useState('');
    const [cur, setCur] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [copied, setCopied] = useState(false);

    const topics = brand?.topics?.length ? brand.topics : ['Dores do público-alvo', 'Resultados e ROI', 'Como funciona', 'Cases de sucesso', 'Diferenciais'];
    const activeTopic = custom.trim() || topic || topics[0];
    const dims = DIMS[fmt];
    const pw = Math.round(dims.w * dims.sc);
    const ph = Math.round(dims.h * dims.sc);
    const colors = brand?.colors || {};
    const primaryColor = colors.primary || '#0057B7';

    // Load html2canvas + font
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

        let instr = '';
        if (fmt === 'post') {
            instr = `Gere 1 slide (post único). Use stat impactante se aplicável.`;
        } else if (fmt === 'carousel') {
            instr = `Gere entre 5 e 10 slides para carrossel:
Slide 1 (theme:dark): hook — headline que PARA o scroll
Slides intermediários: dark para dor/problema, light para solução/resultado. Cada slide avança a história.
Slide final (theme:dark): CTA forte. Prefira 7-8 slides para temas ricos.`;
        } else {
            const phases = fw === 'AIDA' ? ['Atenção', 'Interesse', 'Desejo', 'Ação'] : ['Problema', 'Agitação', 'Impacto', 'Solução', 'CTA'];
            instr = `Gere ${phases.length} slides de story · framework ${fw} · fases: ${phases.join(', ')}.
REGRA CRÍTICA: máx 2 elementos por slide — stat+headline OU headline+subheadline OU headline+items(2) OU headline+cta. NUNCA combine tudo.
Todos theme:dark.`;
        }

        return `${instr}

FOCO: ${activeTopic}
MÓDULOS DISPONÍVEIS: ${modules.map(m => m.key).join(', ') || 'none'}

REGRAS:
- chip: "GESTÃO MUNICIPAL" ou similar ao segmento
- cta: "${cta}"
- accentModule: use um dos módulos disponíveis ou "none"
- headline: hook forte, nunca genérico
- stat: número impactante quando aplicável

Responda APENAS JSON válido:
{"slides":[{"theme":"dark","chip":"","stat":"","statLabel":"","headline":"","subheadline":"","items":[],"cta":"${cta}","accentModule":"${firstModKey}","phase":""}],"caption":"","hashtags":""}`;
    };

    const gen = async () => {
        if (used >= limit) { setErr(`Limite do plano ${plan} atingido (${limit} gerações/mês).`); return; }
        setLoading(true); setErr(''); setSlides([]); setCur(0);
        try {
            const r = await api.posts.generate({
                systemPrompt: brand?.systemPrompt || '',
                messages: [{ role: 'user', content: buildPrompt() }],
                temperature: 1,
            });
            if (r.error) throw new Error(r.error);
            const txt = r.content?.find(c => c.type === 'text')?.text || '{}';
            const parsed = JSON.parse(txt.replace(/```json\n?|\n?```/g, '').trim());
            if (!parsed.slides?.length) throw new Error('Nenhum slide retornado.');
            setSlides(parsed.slides); setCap(parsed.caption || ''); setHt(parsed.hashtags || '');
            // auto-save
            savePost({ format: fmt, framework: fw || null, topic: activeTopic, slides: parsed.slides, caption: parsed.caption, hashtags: parsed.hashtags });
            refreshUsage();
        } catch (e) { setErr(e.message || 'Erro ao gerar.'); }
        setLoading(false);
    };

    const dl = (i) => { const el = document.getElementById(`exp${i}`); if (el) doExport(el, `post-${fmt}-${i + 1}.png`); };
    const dlAll = async () => { for (let i = 0; i < slides.length; i++) { dl(i); await new Promise(r => setTimeout(r, 800)); } };
    const copy = () => navigator.clipboard.writeText(`${cap}\n\n${ht}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });

    return (
        <div style={{ background: '#04040E', color: '#E8EDF5', fontFamily: "'Satoshi',sans-serif" }} className="flex overflow-hidden h-full">
            {/* SIDEBAR */}
            <div className="w-64 flex-shrink-0 bg-[#060714] border-r border-[#0D1325] flex flex-col gap-5 overflow-y-auto max-h-screen p-4">
                {/* Format */}
                <div>
                    <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-[#3E4A5E] mb-2">Formato</p>
                    {[{ v: 'post', l: 'Post Único', s: '1 slide' }, { v: 'carousel', l: 'Carrossel', s: 'até 10 slides' }, { v: 'story', l: 'Story', s: '1080×1920' }].map(f => (
                        <button key={f.v} onClick={() => { setFmt(f.v); setSlides([]); setCur(0); }}
                            style={{ borderLeft: `3px solid ${fmt === f.v ? primaryColor : 'transparent'}` }}
                            className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg mb-1 text-left transition-all
                                ${fmt === f.v ? 'bg-white/[.08]' : 'bg-white/[.02] hover:bg-white/[.04]'}`}>
                            <span style={{ color: fmt === f.v ? '#4D9AFF' : '#7A849A' }} className="text-xs font-bold">{f.l}</span>
                            <span className="text-[10px] text-[#3E4A5E] font-bold">{f.s}</span>
                        </button>
                    ))}
                </div>

                {/* Framework (story only) */}
                {fmt === 'story' && (
                    <div>
                        <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-[#3E4A5E] mb-2">Framework</p>
                        <div className="flex gap-1 bg-[#06071A] rounded-lg p-1">
                            {['AIDA', 'PAIS'].map(f => (
                                <button key={f} onClick={() => setFw(f)}
                                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all
                                        ${fw === f ? 'bg-blue text-white' : 'text-[#3E4A5E] hover:text-[#7A849A]'}`}>{f}</button>
                            ))}
                        </div>
                        <p className="text-[10px] text-[#3E4A5E] mt-2 leading-relaxed">{fw === 'AIDA' ? 'Atenção → Interesse → Desejo → Ação' : 'Problema → Agitação → Impacto → Solução → CTA'}</p>
                    </div>
                )}

                {/* Topics */}
                <div>
                    <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-[#3E4A5E] mb-2">Foco do Conteúdo</p>
                    <div className="flex flex-col gap-1 mb-3">
                        {topics.map(t => (
                            <button key={t} onClick={() => { setTopic(t); setCustom(''); }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all
                                    ${topic === t && !custom ? 'border-blue/40 text-[#4D9AFF] bg-blue/[.1]' : 'border-[#162035] text-[#3E4A5E] hover:text-[#7A849A]'}`}>{t}</button>
                        ))}
                    </div>
                    <textarea rows={2} value={custom} onChange={e => setCustom(e.target.value)}
                        placeholder="Ou escreva foco customizado…"
                        className="w-full bg-[#060814] border border-[#162035] rounded-lg text-[#E8EDF5] text-xs px-3 py-2 resize-none outline-none placeholder:text-[#3E4A5E] focus:border-blue transition-colors" />
                </div>

                {/* Usage */}
                <div>
                    <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-[#3E4A5E] mb-1.5">Uso este mês</p>
                    <div className="h-1.5 bg-[#0D1325] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((used / limit) * 100, 100)}%`, background: used >= limit ? '#F87171' : primaryColor }} />
                    </div>
                    <p className="text-[10px] text-[#3E4A5E] mt-1">{used} / {limit} gerações · {plan}</p>
                </div>

                {/* Generate */}
                <button onClick={gen} disabled={loading || used >= limit}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`, boxShadow: `0 4px 28px ${primaryColor}44` }}>
                    {loading
                        ? <><span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />Gerando…</>
                        : <>✦ Gerar Post</>}
                </button>

                {err && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-xs text-red-400 leading-relaxed">{err}</div>}
            </div>

            {/* MAIN */}
            <div className="flex-1 overflow-y-auto">
                {!loading && !slides.length && (
                    <div className="h-full flex flex-col items-center justify-center gap-4 p-10 text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${primaryColor}18`, border: `1px solid ${primaryColor}28` }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#4D9AFF" strokeWidth={1.5} /></svg>
                        </div>
                        <div>
                            <p className="text-lg font-extrabold mb-2 tracking-tight">Pronto para gerar</p>
                            <p className="text-sm text-[#3E4A5E] max-w-xs leading-relaxed">Escolha o formato e o foco, depois clique em <strong className="text-[#4D9AFF]">Gerar Post</strong>.</p>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-2 border-blue/20 border-t-blue rounded-full animate-spin" style={{ borderTopColor: primaryColor }} />
                        <p className="text-sm text-[#3E4A5E] tracking-wide">Gerando conteúdo estratégico…</p>
                    </div>
                )}

                {!loading && slides.length > 0 && (
                    <div className="p-6 flex flex-col gap-5">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-base font-extrabold tracking-tight">
                                    {fmt === 'post' ? 'Post Único' : fmt === 'carousel' ? 'Carrossel' : `Story · ${fw}`}
                                </p>
                                <p className="text-[10px] text-[#3E4A5E] font-bold uppercase tracking-widest mt-0.5">{slides.length} slide{slides.length > 1 ? 's' : ''} · {dims.label}</p>
                            </div>
                            {slides.length > 1 && (
                                <button onClick={dlAll} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#162035] bg-white/[.04] text-[#7A849A] text-xs font-bold hover:border-blue/40 hover:text-[#4D9AFF] transition-all">
                                    ↓ Baixar Todos
                                </button>
                            )}
                        </div>

                        <div className="flex gap-5 items-start">
                            {/* Preview */}
                            <div className="flex flex-col items-center gap-3 flex-shrink-0">
                                <div className="overflow-hidden rounded-xl border border-[#0D1325] shadow-[0_8px_48px_rgba(0,0,0,.55)]"
                                    style={{ width: pw, height: ph }}>
                                    <div style={{ width: dims.w, height: dims.h, transform: `scale(${dims.sc})`, transformOrigin: 'top left' }}>
                                        <Slide slide={slides[cur]} w={dims.w} h={dims.h} fmt={fmt} idx={cur} total={slides.length} />
                                    </div>
                                </div>
                                {slides.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setCur(c => (c - 1 + slides.length) % slides.length)}
                                            className="w-8 h-8 rounded-full border border-[#162035] bg-[#06071A] text-[#7A849A] flex items-center justify-center hover:border-blue/40 hover:text-[#4D9AFF] transition-all">←</button>
                                        <div className="flex gap-1.5">
                                            {slides.map((_, i) => (
                                                <button key={i} onClick={() => setCur(i)}
                                                    className={`rounded-full transition-all ${i === cur ? 'w-5 h-1.5 bg-blue' : 'w-1.5 h-1.5 bg-[#162035]'}`} />
                                            ))}
                                        </div>
                                        <button onClick={() => setCur(c => (c + 1) % slides.length)}
                                            className="w-8 h-8 rounded-full border border-[#162035] bg-[#06071A] text-[#7A849A] flex items-center justify-center hover:border-blue/40 hover:text-[#4D9AFF] transition-all">→</button>
                                    </div>
                                )}
                                <button onClick={() => dl(cur)}
                                    className="flex items-center gap-2 border border-[#162035] bg-white/[.04] text-[#7A849A] text-xs font-bold py-2 px-4 rounded-lg hover:text-[#4D9AFF] hover:border-blue/40 transition-all"
                                    style={{ width: pw }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
                                    Baixar PNG — Slide {cur + 1}/{slides.length}
                                </button>
                            </div>

                            {/* Slide strip */}
                            {slides.length > 1 && (
                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                    <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-[#3E4A5E]">Todos os slides</p>
                                    {slides.map((sl, i) => (
                                        <div key={i} onClick={() => setCur(i)}
                                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all
                                                ${i === cur ? 'bg-blue/[.12] border-blue/30' : 'bg-white/[.02] border-[#0D1325] hover:border-[#162035]'}`}>
                                            <div className="w-7 overflow-hidden rounded-md border border-white/[.07] flex-shrink-0"
                                                style={{ height: Math.round(28 * (dims.h / dims.w)) }}>
                                                <div style={{ width: dims.w, height: dims.h, transform: `scale(${28 / dims.w})`, transformOrigin: 'top left' }}>
                                                    <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-bold truncate ${i === cur ? 'text-[#4D9AFF]' : 'text-[#7A849A]'}`}>
                                                    {sl.phase ? `${sl.phase} — ` : `Slide ${i + 1} — `}{(sl.headline || '').substring(0, 28)}{sl.headline?.length > 28 ? '…' : ''}
                                                </p>
                                                <p className="text-[10px] text-[#3E4A5E] mt-0.5">{sl.theme === 'light' ? '○ Light' : '● Dark'}</p>
                                            </div>
                                            <button onClick={e => { e.stopPropagation(); dl(i); }}
                                                className="text-[#3E4A5E] hover:text-[#4D9AFF] text-sm transition-colors flex-shrink-0">↓</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Caption */}
                        {cap && (
                            <div className="bg-[#060714] border border-[#0D1325] rounded-xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-[#3E4A5E]">Caption Sugerida</p>
                                    <button onClick={copy}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-blue/30 bg-blue/10 text-[#4D9AFF] hover:bg-blue/20 transition-colors">
                                        {copied ? '✓ Copiado!' : 'Copiar Tudo'}
                                    </button>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed mb-2 whitespace-pre-wrap">{cap}</p>
                                <p className="text-xs text-[#4D9AFF] font-semibold leading-relaxed">{ht}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* HIDDEN EXPORT CONTAINER */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                {slides.map((sl, i) => (
                    <div key={i} id={`exp${i}`} style={{ width: dims.w, height: dims.h, overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#040C1A', position: 'relative' }}>
                        <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} />
                    </div>
                ))}
            </div>
        </div>
    );
}
