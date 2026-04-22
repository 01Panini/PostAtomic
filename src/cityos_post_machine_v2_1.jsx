import { useState, useEffect } from "react";

const DS = {
    p: '#0057B7',
    dark: { bg: '#040C1A', surf: '#080F1C', sm: '#0E1627', bord: '#162035', t1: '#E8EDF5', t2: '#7A849A', t3: '#3E4A5E' },
    light: { bg: '#F4F6F9', surf: '#FFFFFF', sm: '#F0F4FA', bord: '#E2E6EC', t1: '#14171C', t2: '#5A6070', t3: '#9CA3AF' },
    mod: {
        cityos: { c: '#4D9AFF', s: 'rgba(77,154,255,0.13)', n: 'CityOS' },
        flowos: { c: '#FBBF24', s: 'rgba(251,191,36,0.13)', n: 'FlowOS' },
        coreos: { c: '#A78BFA', s: 'rgba(167,139,250,0.13)', n: 'CoreOS' },
        none: { c: '#4D9AFF', s: 'rgba(77,154,255,0.13)', n: 'CityOS' },
    }
};
const DIMS = {
    post: { w: 1080, h: 1350, sc: 0.355, label: '1080 × 1350' },
    carousel: { w: 1080, h: 1350, sc: 0.355, label: '1080 × 1350 / slide', maxSlides: 10 },
    story: { w: 1080, h: 1920, sc: 0.235, label: '1080 × 1920' },
};
const TOPICS = [
    'Dores de gestores municipais',
    'Ouvidoria e atendimento ao cidadão',
    'Execução operacional com FlowOS',
    'Inteligência de dados com CoreOS',
    'ROI e resultados para prefeituras',
    'Antes e depois do CityOS',
    'Implementação rápida',
    'Prestação de contas transparente',
];
const PHASE_COLORS = {
    'Atenção': '#F87171', 'Attention': '#F87171', 'Problema': '#F87171',
    'Interesse': '#4D9AFF', 'Interest': '#4D9AFF', 'Agitação': '#FBBF24',
    'Desejo': '#34D399', 'Desire': '#34D399', 'Impacto': '#FBBF24',
    'Solução': '#34D399', 'Solution': '#34D399',
    'Ação': '#4D9AFF', 'Action': '#4D9AFF', 'CTA': '#4D9AFF',
};

const CSS = `
  @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#04040E;font-family:'Satoshi',sans-serif;}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pop{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
  .gbtn{width:100%;padding:15px;border-radius:12px;border:none;cursor:pointer;
    font-family:'Satoshi',sans-serif;font-size:15px;font-weight:800;letter-spacing:-.01em;
    background:linear-gradient(135deg,#0057B7,#003A82);color:#fff;
    box-shadow:0 4px 28px rgba(0,87,183,.42);transition:all .2s;
    display:flex;align-items:center;justify-content:center;gap:10px;}
  .gbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 36px rgba(0,87,183,.52);}
  .gbtn:active:not(:disabled){transform:scale(.98);}
  .gbtn:disabled{opacity:.4;cursor:not-allowed;}
  .dbtn{display:flex;align-items:center;justify-content:center;gap:8px;
    padding:11px 18px;border-radius:10px;border:1px solid #162035;cursor:pointer;
    font-family:'Satoshi',sans-serif;font-size:13px;font-weight:700;
    background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);transition:all .2s;}
  .dbtn:hover{background:rgba(0,87,183,.14);border-color:rgba(0,87,183,.4);color:#4D9AFF;}
  .dbtn:active{transform:scale(.97);}
  .seg{display:flex;gap:4px;background:#06071A;border-radius:10px;padding:4px;}
  .sbtn{flex:1;padding:8px 10px;border-radius:7px;border:none;cursor:pointer;
    font-family:'Satoshi',sans-serif;font-size:12px;font-weight:700;
    background:transparent;color:#3E4A5E;transition:all .2s;}
  .sbtn.on{background:#0057B7;color:#fff;}
  .sbtn:not(.on):hover{color:#7A849A;}
  .lbl{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
    color:#3E4A5E;margin-bottom:8px;display:block;}
  .inp{width:100%;background:#060814;border:1px solid #162035;border-radius:10px;
    color:#E8EDF5;font-family:'Satoshi',sans-serif;font-size:13px;
    padding:11px 13px;outline:none;transition:border-color .2s;resize:none;}
  .inp:focus{border-color:#0057B7;}
  .inp::placeholder{color:#3E4A5E;}
  .tbtn{width:100%;text-align:left;padding:7px 11px;border-radius:8px;border:1px solid #162035;
    background:transparent;color:#3E4A5E;font-family:'Satoshi',sans-serif;
    font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;}
  .tbtn:hover{border-color:rgba(0,87,183,.35);color:#7A849A;}
  .tbtn.on{border-color:rgba(0,87,183,.4);color:#4D9AFF;background:rgba(0,87,183,.1);}
  .dot{width:6px;height:6px;border-radius:50%;background:#162035;cursor:pointer;border:none;transition:all .25s;}
  .dot.on{background:#0057B7;width:20px;border-radius:3px;}
  .nav{width:36px;height:36px;border-radius:50%;border:1px solid #162035;
    background:#06071A;color:#7A849A;cursor:pointer;font-size:15px;
    display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .nav:hover{border-color:#0057B7;color:#4D9AFF;}
  .cpbtn{padding:7px 14px;border-radius:8px;border:1px solid rgba(0,87,183,.3);
    background:rgba(0,87,183,.1);color:#4D9AFF;font-family:'Satoshi',sans-serif;
    font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;}
  .cpbtn:hover{background:rgba(0,87,183,.2);}
  .anim{animation:pop .3s ease both;}
`;

const mo = k => DS.mod[k] || DS.mod.none;
function rgb(h) {
    if (!h || !h.startsWith('#')) return '77,154,255';
    return `${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)}`;
}

function Grid({ w, h, op = .055 }) {
    const L = [], s = 108;
    for (let x = s; x < w; x += s) L.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} stroke={`rgba(77,154,255,${op})`} strokeWidth={1} />);
    for (let y = s; y < h; y += s) L.push(<line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} stroke={`rgba(77,154,255,${op})`} strokeWidth={1} />);
    return <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>{L}</svg>;
}
function Orb({ x, y, r, color, o = .2 }) {
    return <div style={{
        position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle,rgba(${rgb(color)},${o}) 0%,transparent 70%)`
    }} />;
}

/* Fixed brand badge — always "GESTÃO MUNICIPAL" */
function GovBadge({ mod = 'none', fs = 20 }) {
    const m = mo(mod);
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: `${Math.round(fs * .38)}px ${Math.round(fs * .88)}px`, borderRadius: 9999,
            background: m.s, border: `1px solid ${m.c}28`,
            fontSize: fs, fontWeight: 800, letterSpacing: '.08em', color: m.c, textTransform: 'uppercase'
        }}>
            <div style={{
                width: Math.round(fs * .38), height: Math.round(fs * .38), borderRadius: '50%',
                background: m.c, boxShadow: `0 0 9px ${m.c}90`
            }} />
            GESTÃO MUNICIPAL
        </div>
    );
}

/* CityOS brand signature — dark=true for dark backgrounds, dark=false for light */
function Sig({ dark = true, fs = 19 }) {
    return (
        <span style={{
            fontSize: fs, fontWeight: 800, letterSpacing: '.06em',
            color: dark ? 'rgba(255,255,255,.28)' : 'rgba(0,40,100,.32)',
            textTransform: 'uppercase'
        }}>CityOS</span>
    );
}

/* ── TEMPLATE: HERO DARK ── */
function TplHD({ d, w, h }) {
    const m = mo(d.accentModule), p = Math.round(w * .059);
    const hfs = h > 1400 ? Math.round(w * .094) : Math.round(w * .082);
    const sfs = Math.round(w * .037), stFs = Math.round(w * .163);
    return (
        <div style={{
            width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif",
            background: `radial-gradient(ellipse 100% 52% at 50% -8%,rgba(0,87,183,.3) 0%,#040C1A 55%)`
        }}>
            <Grid w={w} h={h} />
            <Orb x={w * .5} y={0} r={w * .78} color={m.c} o={.09} />
            {[.48, .62].map((r, i) => <div key={i} style={{ position: 'absolute', top: h * .04, right: -w * r * .32, width: w * r, height: w * r, borderRadius: '50%', border: `1px solid rgba(255,255,255,${.04 - i * .015})`, pointerEvents: 'none' }} />)}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: p, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GovBadge mod={d.accentModule} fs={20} />
                <div>
                    {d.stat && <div style={{ fontSize: stFs, fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', marginBottom: Math.round(h * .017), background: 'linear-gradient(180deg,#FFF 0%,rgba(255,255,255,.4) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{d.stat}</div>}
                    {d.statLabel && <div style={{ fontSize: Math.round(sfs * .82), color: 'rgba(255,255,255,.42)', fontWeight: 500, marginBottom: Math.round(h * .022), lineHeight: 1.4 }}>{d.statLabel}</div>}
                    <div style={{ fontSize: hfs, fontWeight: 900, color: '#FFF', lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: Math.round(h * .02) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: sfs, color: 'rgba(255,255,255,.48)', lineHeight: 1.45, fontWeight: 500, maxWidth: w * .83 }}>{d.subheadline}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 100, padding: `${Math.round(p * .24)}px ${Math.round(p * .5)}px` }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.c, boxShadow: `0 0 10px ${m.c}` }} />
                        <Sig dark fs={19} />
                    </div>
                    {d.cta && <div style={{ background: '#0057B7', color: '#fff', whiteSpace: 'nowrap', padding: `${Math.round(p * .24)}px ${Math.round(p * .52)}px`, borderRadius: 100, fontSize: 22, fontWeight: 800, boxShadow: '0 4px 22px rgba(0,87,183,.48)' }}>{d.cta} →</div>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: HERO LIGHT ── */
function TplHL({ d, w, h }) {
    const m = mo(d.accentModule), p = Math.round(w * .059);
    const hfs = h > 1400 ? Math.round(w * .094) : Math.round(w * .082);
    const sfs = Math.round(w * .037);
    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#FFFFFF', borderLeft: `8px solid ${m.c}` }}>
            <div style={{ position: 'absolute', top: -w * .28, right: -w * .28, width: w * .64, height: w * .64, borderRadius: '50%', background: `radial-gradient(circle,${m.s} 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -w * .12, left: p, width: w * .38, height: w * .38, borderRadius: '50%', background: `radial-gradient(circle,${m.s} 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, paddingTop: p, paddingBottom: p, paddingRight: p, paddingLeft: p + 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GovBadge mod={d.accentModule} fs={20} />
                <div>
                    {d.stat && <div style={{ fontSize: Math.round(w * .15), fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', color: m.c, marginBottom: Math.round(h * .012) }}>{d.stat}</div>}
                    {d.statLabel && <div style={{ fontSize: Math.round(sfs * .8), color: DS.light.t2, marginBottom: Math.round(h * .02), fontWeight: 500 }}>{d.statLabel}</div>}
                    <div style={{ fontSize: hfs, fontWeight: 900, color: DS.light.t1, lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: Math.round(h * .02) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: sfs, color: DS.light.t2, lineHeight: 1.45, fontWeight: 500 }}>{d.subheadline}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Sig dark={false} fs={19} />
                    {d.cta && <div style={{ background: m.c, color: '#fff', padding: `${Math.round(p * .24)}px ${Math.round(p * .52)}px`, borderRadius: 100, fontSize: 22, fontWeight: 800 }}>{d.cta} →</div>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: FEATURE DARK ── */
function TplFD({ d, w, h }) {
    const m = mo(d.accentModule), p = Math.round(w * .059);
    const hfs = Math.round(w * .062), ifs = Math.round(w * .034);
    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: 'linear-gradient(155deg,#040C1A 0%,#060D1B 100%)' }}>
            <Grid w={w} h={h} op={.04} />
            <Orb x={w} y={0} r={w * .65} color={m.c} o={.07} />
            <div style={{ position: 'absolute', top: 0, left: p, right: p, height: 3, background: `linear-gradient(90deg,${m.c} 0%,transparent 85%)` }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: p, paddingTop: p + 14, display: 'flex', flexDirection: 'column', gap: Math.round(h * .03) }}>
                <div>
                    <GovBadge mod={d.accentModule} fs={20} />
                    <div style={{ fontSize: hfs, fontWeight: 900, color: '#FFF', lineHeight: 1.15, letterSpacing: '-.025em', marginTop: Math.round(h * .024) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: Math.round(w * .031), color: 'rgba(255,255,255,.42)', marginTop: Math.round(h * .012), lineHeight: 1.4, fontWeight: 500 }}>{d.subheadline}</div>}
                </div>
                {d.items?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(h * .016), flex: 1 }}>
                        {d.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: `${Math.round(h * .02)}px ${Math.round(w * .035)}px`, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.055)', borderRadius: 16, borderLeft: `3px solid ${m.c}` }}>
                                <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: m.s, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: m.c }}>{String(i + 1).padStart(2, '0')}</div>
                                <span style={{ fontSize: ifs, color: 'rgba(255,255,255,.75)', fontWeight: 500, lineHeight: 1.35 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: Math.round(h * .014), borderTop: '1px solid rgba(255,255,255,.07)' }}>
                    <Sig fs={19} />
                    {d.cta && <span style={{ fontSize: 22, color: m.c, fontWeight: 800 }}>{d.cta} →</span>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: FEATURE LIGHT ── */
function TplFL({ d, w, h }) {
    const m = mo(d.accentModule), p = Math.round(w * .059);
    const hfs = Math.round(w * .062), ifs = Math.round(w * .034);
    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#F4F6F9', borderLeft: `8px solid ${m.c}` }}>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: w * .48, height: w * .48, background: `radial-gradient(circle at bottom right,${m.s} 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, paddingTop: p, paddingBottom: p, paddingRight: p, paddingLeft: p + 8, display: 'flex', flexDirection: 'column', gap: Math.round(h * .026) }}>
                <div>
                    <GovBadge mod={d.accentModule} fs={20} />
                    <div style={{ fontSize: hfs, fontWeight: 900, color: DS.light.t1, lineHeight: 1.15, letterSpacing: '-.025em', marginTop: Math.round(h * .024) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: Math.round(w * .031), color: DS.light.t2, marginTop: Math.round(h * .012), lineHeight: 1.4, fontWeight: 500 }}>{d.subheadline}</div>}
                </div>
                {d.items?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(h * .014), flex: 1 }}>
                        {d.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: `${Math.round(h * .019)}px ${Math.round(w * .03)}px`, background: 'rgba(255,255,255,.9)', border: `1px solid ${DS.light.bord}`, borderRadius: 14, borderLeft: `3px solid ${m.c}`, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: m.s, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: m.c }}>{i + 1}</div>
                                <span style={{ fontSize: ifs, color: DS.light.t1, fontWeight: 500, lineHeight: 1.35 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: Math.round(h * .012), borderTop: `1px solid ${DS.light.bord}` }}>
                    <Sig dark={false} fs={19} />
                    {d.cta && <div style={{ background: m.c, color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 20, fontWeight: 800 }}>{d.cta} →</div>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: CTA DARK ── */
function TplCTA({ d, w, h }) {
    const m = mo(d.accentModule), p = Math.round(w * .065);
    const hfs = h > 1400 ? Math.round(w * .098) : Math.round(w * .085);
    const sfs = Math.round(w * .038);
    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: `radial-gradient(ellipse 115% 70% at 50% 108%,rgba(0,87,183,.42) 0%,#040C1A 55%)` }}>
            <Grid w={w} h={h} />
            <Orb x={w * .5} y={h} r={w * .85} color='#0057B7' o={.18} />
            {[.38, .52, .67].map((r, i) => <div key={i} style={{ position: 'absolute', bottom: -w * r * .48, left: '50%', transform: 'translateX(-50%)', width: w * r, height: w * r, borderRadius: '50%', border: `1px solid rgba(255,255,255,${.06 - i * .018})`, pointerEvents: 'none' }} />)}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: p, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <GovBadge mod={d.accentModule} fs={20} />
                </div>
                <div>
                    {d.stat && <div style={{ fontSize: Math.round(w * .138), fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', marginBottom: Math.round(h * .018), background: 'linear-gradient(180deg,#FFF 0%,rgba(255,255,255,.38) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{d.stat}</div>}
                    <div style={{ fontSize: hfs, fontWeight: 900, color: '#FFF', lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: Math.round(h * .024) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: sfs, color: 'rgba(255,255,255,.46)', lineHeight: 1.5, fontWeight: 500, maxWidth: w * .8, margin: '0 auto' }}>{d.subheadline}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                    {d.cta && <div style={{ background: 'linear-gradient(135deg,#0057B7 0%,#003A82 100%)', color: '#fff', padding: `${Math.round(p * .36)}px ${Math.round(p * .82)}px`, borderRadius: 100, fontSize: 26, fontWeight: 800, boxShadow: '0 0 44px rgba(0,87,183,.58)', letterSpacing: '-.01em' }}>{d.cta} →</div>}
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                        <Sig fs={19} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: STORY ── */
function TplStory({ d, w, h }) {
    const m = mo(d.accentModule), isDark = d.theme !== 'light';
    const pc = PHASE_COLORS[d.phase] || m.c;
    const isCTAPhase = ['Ação', 'CTA', 'Solução'].includes(d.phase);
    const p = Math.round(w * .074), hfs = Math.round(w * .11), sfs = Math.round(w * .05);
    const bg = `radial-gradient(ellipse 110% 65% at 50% ${isCTAPhase ? '105%' : '0%'},rgba(${rgb(pc)},.22) 0%,#040C1A 58%)`;
    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: bg }}>
            <Grid w={w} h={h} op={.04} />
            <Orb x={w * .5} y={isCTAPhase ? h : 0} r={w * .9} color={pc} o={.1} />
            <div style={{ position: 'absolute', top: p, left: p, right: p, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 24px', borderRadius: 100, background: 'rgba(255,255,255,.06)', border: `1px solid ${pc}30`, fontSize: 20, fontWeight: 800, color: pc, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc, boxShadow: `0 0 9px ${pc}` }} />
                    {d.phase || 'GESTÃO MUNICIPAL'}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,.35)', letterSpacing: '.06em' }}>
                    CityOS
                </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, paddingTop: p * 2.8, paddingBottom: p * 2.2, paddingLeft: p, paddingRight: p, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(h * .027) }}>
                {d.stat && <div style={{ fontSize: Math.round(w * .19), fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', background: 'linear-gradient(180deg,#FFF 0%,rgba(255,255,255,.38) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{d.stat}</div>}
                {d.statLabel && <div style={{ fontSize: Math.round(sfs * .75), color: 'rgba(255,255,255,.48)', fontWeight: 500, lineHeight: 1.35 }}>{d.statLabel}</div>}
                <div style={{ fontSize: hfs, fontWeight: 900, color: '#E8EDF5', lineHeight: 1.1, letterSpacing: '-.03em' }}>{d.headline}</div>
                {d.subheadline && <div style={{ fontSize: sfs, color: 'rgba(255,255,255,.5)', lineHeight: 1.45, fontWeight: 500, maxWidth: w * .92 }}>{d.subheadline}</div>}
                {d.items?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(h * .011) }}>
                        {d.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: `${Math.round(h * .015)}px ${Math.round(w * .037)}px`, background: 'rgba(255,255,255,.05)', borderRadius: 14, borderLeft: `3px solid ${pc}` }}>
                                <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: `${pc}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: pc }}>{i + 1}</div>
                                <span style={{ fontSize: Math.round(w * .039), color: 'rgba(255,255,255,.78)', fontWeight: 500, lineHeight: 1.35 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                {d.cta && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'linear-gradient(135deg,#0057B7 0%,#003A82 100%)', color: '#fff', padding: `${Math.round(p * .3)}px ${Math.round(p * .78)}px`, borderRadius: 100, fontSize: 28, fontWeight: 800, boxShadow: '0 4px 28px rgba(0,87,183,.5)', marginTop: Math.round(h * .01) }}>{d.cta} →</div>}
            </div>
        </div>
    );
}

function pickTpl(fmt, idx, total, sl) {
    if (fmt === 'story') return 'story';
    const isLight = sl.theme === 'light';
    if (fmt === 'post') return isLight ? 'hero-light' : 'hero-dark';
    // carousel: capa sempre dark, CTA sempre dark, meio segue theme da IA
    if (idx === 0) return 'hero-dark';
    if (idx === total - 1) return 'cta-dark';
    return isLight ? 'feature-light' : 'feature-dark';
}
function Slide({ slide, w, h, fmt, idx, total }) {
    const t = pickTpl(fmt, idx, total, slide);
    const p = { d: slide, w, h };
    const map = { 'hero-dark': TplHD, 'hero-light': TplHL, 'feature-dark': TplFD, 'feature-light': TplFL, 'cta-dark': TplCTA, 'story': TplStory };
    const T = map[t] || TplHD;
    return <T {...p} />;
}

async function callAPI(fmt, fw, topic) {
    const isC = fmt === 'carousel', isS = fmt === 'story';
    let instr = '';
    if (fmt === 'post') {
        instr = `Gere 1 slide (post único). Use stat impactante se aplicável.`;
    } else if (isC) {
        instr = `Gere entre 5 e 10 slides para carrossel (use quantos forem necessários para desenvolver bem a ideia):
Slide 1 (theme:dark): cover/hook — headline que PARA o scroll com pergunta ou dado chocante
Slides intermediários: varie os temas para criar contraste visual — use "dark" para slides de problema/dor/urgência, use "light" para slides de solução/benefício/resultado. O contraste reforça a virada narrativa. Cada slide avança a história, nunca repete.
Slide final (theme:dark): CTA forte com urgência — o que o gestor perde a cada dia sem o CityOS
Regra: prefira 7-8 slides quando o tema tiver múltiplas camadas. Use 5 apenas para temas simples.`;
    } else {
        const phases = fw === 'AIDA' ? ['Atenção', 'Interesse', 'Desejo', 'Ação'] : ['Problema', 'Agitação', 'Impacto', 'Solução', 'CTA'];
        instr = `Gere ${phases.length} slides de story usando framework ${fw}.
Fases em ordem: ${phases.join(', ')}.
Inclua "phase" com o nome exato. Todos os slides com theme:dark.

REGRA CRÍTICA DE DENSIDADE — cada slide deve ter NO MÁXIMO 2 elementos de conteúdo:
- Slide de IMPACTO (stat): preencha stat + headline. Deixe subheadline, items e cta VAZIOS.
- Slide de TEXTO PURO: preencha headline + subheadline. Deixe stat, items e cta VAZIOS.
- Slide de LISTA: preencha headline + items (máx 2). Deixe stat, subheadline e cta VAZIOS.
- Slide de CTA: preencha headline + cta. Deixe todo o resto VAZIO.
NUNCA combine stat + subheadline + items no mesmo slide. Menos é mais.`;
    }
    let res;
    try {
        res = await fetch('http://localhost:3001/api/generate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514', max_tokens: 2500,
            messages: [{
                role: 'user', content: `Você é o estrategista sênior de conteúdo do CityOS — plataforma govtech B2B SaaS para prefeituras brasileiras.

PRODUTO: CityOS = sistema operacional para cidades.
• CityOS: ouvidoria digital, canal unificado cidadão-prefeitura, SLA automático, controle de demandas
• FlowOS: gestão operacional, tarefas por secretaria, equipes, checklists, dashboards em tempo real
• CoreOS: inteligência artificial, analytics preditivos, heatmaps de demandas, alertas automáticos

PÚBLICO-ALVO: prefeitos, secretários municipais, diretores de TI e operação de prefeituras.
META ÚNICA: gerar desejo imediato de agendar uma demo. Criar a sensação de que operar sem o CityOS é negligência.
FOCO DESTE CONTEÚDO: ${topic}

${instr}

REGRAS DE COPY DE ALTO IMPACTO (CRÍTICO — siga à risca):
- headline: SEMPRE comece com hook que cria desconforto, reflexão ou urgência no gestor
- USE: perguntas diretas ("Sua prefeitura resolve problemas ou só reage a crises?"), dados chocantes ("73% das ordens de serviço somem sem resposta"), afirmações provocativas ("Gestores reagem. Líderes previnem.")
- NUNCA use: "Transforme sua gestão", "Modernize sua prefeitura", "Melhore seus resultados" — são genéricas e invisíveis
- NUNCA repita a headline na subheadline
- subheadline: amplifica o hook com contexto real, não resume o headline
- stat: número que choca — ex: "68%", "R$ 2,3M", "47 dias", "3x mais rápido"
- items: benefícios CONCRETOS e MENSURÁVEIS — não abstratos, não óbvios
- cta: ação direta — "Agende uma demo", "Ver na prática", "Quero testar agora"
- caption: 80-120 palavras em português, tom direto de executivo, começa com o mesmo hook do headline, termina com CTA
- chip: campo usado internamente — use "GESTÃO MUNICIPAL" como padrão

Responda APENAS JSON válido sem markdown:
{"slides":[{"theme":"dark","chip":"GESTÃO MUNICIPAL","stat":"","statLabel":"","headline":"","subheadline":"","items":[],"cta":"","accentModule":"none","phase":""}],"caption":"","hashtags":""}`}]
            })
        });
    } catch {
        throw new Error('Servidor não encontrado. Verifique se "node server.js" está rodando na porta 3001.');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Erro do servidor (${res.status}): ${err.error || res.statusText}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(`Erro da API Anthropic: ${data.error.message || JSON.stringify(data.error)}`);
    const txt = data.content?.find(c => c.type === 'text')?.text || '{}';
    return JSON.parse(txt.replace(/```json\n?|\n?```/g, '').trim());
}

/* ── EXPORT (bug fix: explicit background + scale 2 + no null backgroundColor) ── */
async function doExport(el, name) {
    if (!window.html2canvas) { alert('Exportador ainda carregando. Aguarde 5 segundos e tente novamente.'); return; }
    try {
        await document.fonts.ready;
        const cv = await window.html2canvas(el, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#040C1A',
            width: el.offsetWidth,
            height: el.offsetHeight,
            scrollX: 0,
            scrollY: 0
        });
        cv.toBlob(blob => {
            const u = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = u; a.download = name; a.click();
            setTimeout(() => URL.revokeObjectURL(u), 5000);
        }, 'image/png');
    } catch (e) { console.error(e); alert('Erro ao exportar. Tente novamente.'); }
}

export default function App() {
    const [fmt, setFmt] = useState('post');
    const [fw, setFw] = useState('AIDA');
    const [topic, setTopic] = useState(TOPICS[0]);
    const [custom, setCustom] = useState('');
    const [slides, setSlides] = useState([]);
    const [cap, setCap] = useState('');
    const [ht, setHt] = useState('');
    const [cur, setCur] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [copied, setCopied] = useState(false);

    const dims = DIMS[fmt] || DIMS.post;
    const activeTopic = custom.trim() || topic;

    useEffect(() => {
        const lnk = document.createElement('link');
        lnk.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400&display=swap';
        lnk.rel = 'stylesheet'; document.head.appendChild(lnk);
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(s);
    }, []);

    const gen = async () => {
        setLoading(true); setErr(''); setSlides([]); setCur(0);
        try {
            const r = await callAPI(fmt, fw, activeTopic);
            if (!r.slides?.length) throw new Error('Nenhum slide retornado pela API.');
            setSlides(r.slides); setCap(r.caption || ''); setHt(r.hashtags || '');
        } catch (e) { setErr(e.message || 'Erro ao gerar. Tente novamente.'); }
        setLoading(false);
    };

    const dl = i => { const el = document.getElementById(`exp${i}`); if (el) doExport(el, `cityos-${fmt}-${i + 1}.png`); };
    const dlAll = async () => { for (let i = 0; i < slides.length; i++) { dl(i); await new Promise(r => setTimeout(r, 800)); } };
    const copy = () => navigator.clipboard.writeText(`${cap}\n\n${ht}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });

    const pw = Math.round(dims.w * dims.sc), ph = Math.round(dims.h * dims.sc);

    return (
        <div style={{ minHeight: '100vh', background: '#04040E', color: '#E8EDF5', fontFamily: "'Satoshi',sans-serif", display: 'flex', overflow: 'hidden' }}>
            <style>{CSS}</style>

            {/* SIDEBAR */}
            <div style={{ width: 268, flexShrink: 0, background: '#060714', borderRight: '1px solid #0D1325', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto', maxHeight: '100vh' }}>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: '#0057B7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(0,87,183,.55)' }}>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth={2} /><polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth={2} />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-.02em' }}>Post Machine</div>
                        <div style={{ fontSize: 10, color: '#3E4A5E', letterSpacing: '.06em', fontWeight: 700, textTransform: 'uppercase' }}>CityOS · Social</div>
                    </div>
                </div>

                {/* Formato */}
                <div>
                    <span className="lbl">Formato</span>
                    {[{ v: 'post', l: 'Post Único', s: '1080 × 1350' }, { v: 'carousel', l: 'Carrossel', s: 'até 10 slides' }, { v: 'story', l: 'Story', s: '1080 × 1920' }].map(f => (
                        <button key={f.v} onClick={() => { setFmt(f.v); setSlides([]); setCur(0); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 5, background: fmt === f.v ? 'rgba(0,87,183,.17)' : 'rgba(255,255,255,.02)', borderLeft: `3px solid ${fmt === f.v ? '#0057B7' : 'transparent'}`, transition: 'all .2s', fontFamily: "'Satoshi',sans-serif" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: fmt === f.v ? '#4D9AFF' : '#7A849A' }}>{f.l}</span>
                            <span style={{ fontSize: 10, color: '#3E4A5E', fontWeight: 700 }}>{f.s}</span>
                        </button>
                    ))}
                </div>

                {/* Story Framework */}
                {fmt === 'story' && (
                    <div>
                        <span className="lbl">Framework</span>
                        <div className="seg">
                            {['AIDA', 'PAIS'].map(f => <button key={f} className={`sbtn ${fw === f ? 'on' : ''}`} onClick={() => setFw(f)}>{f}</button>)}
                        </div>
                        <div style={{ marginTop: 7, fontSize: 11, color: '#3E4A5E', lineHeight: 1.55 }}>
                            {fw === 'AIDA' ? 'Atenção → Interesse → Desejo → Ação' : 'Problema → Agitação → Impacto → Solução → CTA'}
                        </div>
                    </div>
                )}

                {/* Tópico */}
                <div>
                    <span className="lbl">Foco do Conteúdo</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                        {TOPICS.map(t => (
                            <button key={t} className={`tbtn ${topic === t && !custom ? 'on' : ''}`} onClick={() => { setTopic(t); setCustom(''); }}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <textarea className="inp" rows={2} placeholder="Ou escreva foco customizado..." value={custom} onChange={e => setCustom(e.target.value)} />
                </div>

                {/* Gerar */}
                <button className="gbtn" onClick={gen} disabled={loading}>
                    {loading
                        ? <><svg style={{ animation: 'spin .8s linear infinite' }} width={17} height={17} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={10} stroke="rgba(255,255,255,.25)" strokeWidth={2} /><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth={2} strokeLinecap="round" /></svg>Gerando...</>
                        : <><svg width={17} height={17} viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>Gerar Post</>
                    }
                </button>

                {err && <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 10, padding: '11px 13px', fontSize: 12, color: '#F87171', lineHeight: 1.55 }}>{err}</div>}
            </div>

            {/* MAIN */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                {/* Empty state */}
                {!loading && !slides.length && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, textAlign: 'center' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(0,87,183,.1)', border: '1px solid rgba(0,87,183,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#4D9AFF" strokeWidth={1.5} /></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, letterSpacing: '-.02em' }}>Pronto para gerar</div>
                            <div style={{ fontSize: 13, color: '#3E4A5E', maxWidth: 290, lineHeight: 1.65 }}>Escolha o formato e o foco, depois clique em <strong style={{ color: '#4D9AFF' }}>Gerar Post</strong>.</div>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                        <div style={{ width: 42, height: 42, border: '2px solid rgba(0,87,183,.15)', borderTop: '2px solid #0057B7', borderRadius: '50%', animation: 'spin .75s linear infinite' }} />
                        <div style={{ fontSize: 13, color: '#3E4A5E', letterSpacing: '.04em' }}>Gerando conteúdo estratégico...</div>
                    </div>
                )}

                {/* Preview */}
                {!loading && slides.length > 0 && (
                    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.02em' }}>
                                    {fmt === 'post' ? 'Post Único' : fmt === 'carousel' ? 'Carrossel' : `Story · ${fw}`}
                                </div>
                                <div style={{ fontSize: 10, color: '#3E4A5E', marginTop: 2, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                                    {slides.length} slide{slides.length > 1 ? 's' : ''} · {dims.label}
                                </div>
                            </div>
                            {slides.length > 1 && (
                                <button className="dbtn" style={{ width: 'auto', padding: '10px 16px' }} onClick={dlAll}>
                                    ↓ Baixar Todos ({slides.length} PNGs)
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            {/* Main preview */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                <div key={cur} className="anim" style={{ width: pw, height: ph, overflow: 'hidden', borderRadius: 12, border: '1px solid #0D1325', boxShadow: '0 8px 48px rgba(0,0,0,.55)' }}>
                                    <div style={{ width: dims.w, height: dims.h, transform: `scale(${dims.sc})`, transformOrigin: 'top left' }}>
                                        <Slide slide={slides[cur]} w={dims.w} h={dims.h} fmt={fmt} idx={cur} total={slides.length} />
                                    </div>
                                </div>
                                {slides.length > 1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button className="nav" onClick={() => setCur(c => (c - 1 + slides.length) % slides.length)}>←</button>
                                        <div style={{ display: 'flex', gap: 5 }}>
                                            {slides.map((_, i) => <button key={i} className={`dot ${i === cur ? 'on' : ''}`} onClick={() => setCur(i)} />)}
                                        </div>
                                        <button className="nav" onClick={() => setCur(c => (c + 1) % slides.length)}>→</button>
                                    </div>
                                )}
                                <button className="dbtn" style={{ width: pw }} onClick={() => dl(cur)}>
                                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
                                    Baixar PNG — Slide {cur + 1}/{slides.length}
                                </button>
                            </div>

                            {/* Slide strip */}
                            {slides.length > 1 && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span className="lbl">Todos os slides</span>
                                    {slides.map((sl, i) => (
                                        <div key={i} onClick={() => setCur(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', background: i === cur ? 'rgba(0,87,183,.12)' : 'rgba(255,255,255,.02)', border: `1px solid ${i === cur ? 'rgba(0,87,183,.32)' : '#0D1325'}`, transition: 'all .15s' }}>
                                            <div style={{ width: 28, height: Math.round(28 * (dims.h / dims.w)), overflow: 'hidden', borderRadius: 5, border: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
                                                <div style={{ width: dims.w, height: dims.h, transform: `scale(${28 / dims.w})`, transformOrigin: 'top left' }}>
                                                    <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} />
                                                </div>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: i === cur ? '#4D9AFF' : '#7A849A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {sl.phase ? `${sl.phase} — ` : `Slide ${i + 1} — `}{(sl.headline || '').substring(0, 26)}{(sl.headline || '').length > 26 ? '…' : ''}
                                                </div>
                                                <div style={{ fontSize: 10, color: '#3E4A5E', marginTop: 1 }}>
                                                    {sl.theme === 'light' ? '○ Light' : '● Dark'} · {(DS.mod[sl.accentModule] || DS.mod.none).n}
                                                </div>
                                            </div>
                                            <button className="dbtn" style={{ width: 'auto', padding: '5px 10px', fontSize: 11, flexShrink: 0 }}
                                                onClick={e => { e.stopPropagation(); dl(i); }}>↓</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Caption */}
                        {cap && (
                            <div style={{ background: '#060714', border: '1px solid #0D1325', borderRadius: 12, padding: '16px 20px', animation: 'fadeUp .4s ease both' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span className="lbl" style={{ marginBottom: 0 }}>Caption Sugerida</span>
                                    <button className="cpbtn" onClick={copy}>{copied ? '✓ Copiado!' : 'Copiar Tudo'}</button>
                                </div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{cap}</div>
                                <div style={{ fontSize: 12, color: '#4D9AFF', fontWeight: 600, lineHeight: 1.6 }}>{ht}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* HIDDEN EXPORT CONTAINER — explicit background prevents white artifacts */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                {slides.map((sl, i) => (
                    <div key={i} id={`exp${i}`} style={{
                        width: dims.w, height: dims.h,
                        overflow: 'hidden',
                        fontFamily: "'Satoshi',sans-serif",
                        background: '#040C1A',
                        position: 'relative'
                    }}>
                        <Slide slide={sl} w={dims.w} h={dims.h} fmt={fmt} idx={i} total={slides.length} />
                    </div>
                ))}
            </div>
        </div>
    );
}
