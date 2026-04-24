import { useBrand } from '../../contexts/BrandContext';

/* ── Helpers ── */
function rgb(h) {
    if (!h || !h.startsWith('#')) return '77,154,255';
    return `${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)}`;
}

const LIGHT = {
    t1: '#14171C', t2: '#5A6070', t3: '#9CA3AF',
    bord: '#E2E6EC',
};

const PHASE_COLORS = {
    'Atenção': '#F87171', 'Attention': '#F87171', 'Problema': '#F87171',
    'Interesse': '#4D9AFF', 'Interest': '#4D9AFF', 'Agitação': '#FBBF24',
    'Desejo': '#34D399', 'Desire': '#34D399', 'Impacto': '#FBBF24',
    'Solução': '#34D399', 'Solution': '#34D399',
    'Ação': '#4D9AFF', 'Action': '#4D9AFF', 'CTA': '#4D9AFF',
};

function Grid({ w, h, op = 0.055, color = '#4D9AFF' }) {
    const L = [], s = 108;
    for (let x = s; x < w; x += s) L.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} stroke={`rgba(${rgb(color)},${op})`} strokeWidth={1} />);
    for (let y = s; y < h; y += s) L.push(<line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} stroke={`rgba(${rgb(color)},${op})`} strokeWidth={1} />);
    return <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>{L}</svg>;
}

function Orb({ x, y, r, color, o = 0.2 }) {
    return (
        <div style={{
            position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2,
            borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
            background: `radial-gradient(circle,rgba(${rgb(color)},${o}) 0%,transparent 70%)`,
        }} />
    );
}

function getBadgeStyle(modColor) {
    return {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 22px', borderRadius: 9999,
        background: modColor + '22', border: `1px solid ${modColor}28`,
        fontSize: 20, fontWeight: 800, letterSpacing: '.08em',
        color: modColor, textTransform: 'uppercase',
    };
}

function GovBadge({ chip, modColor, fs = 20 }) {
    const text = chip || 'GESTÃO MUNICIPAL';
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: `${Math.round(fs * .38)}px ${Math.round(fs * .88)}px`, borderRadius: 9999,
            background: modColor + '22', border: `1px solid ${modColor}28`,
            fontSize: fs, fontWeight: 800, letterSpacing: '.08em',
            color: modColor, textTransform: 'uppercase',
        }}>
            <div style={{
                width: Math.round(fs * .38), height: Math.round(fs * .38), borderRadius: '50%',
                background: modColor, boxShadow: `0 0 9px ${modColor}90`,
            }} />
            {text}
        </div>
    );
}

function Sig({ dark = true, fs = 19, name = 'PostAtomic' }) {
    return (
        <span style={{
            fontSize: fs, fontWeight: 800, letterSpacing: '.06em',
            color: dark ? 'rgba(255,255,255,.28)' : 'rgba(0,40,100,.32)',
            textTransform: 'uppercase',
        }}>{name}</span>
    );
}

/* ── TEMPLATE: HERO DARK ── */
function TplHD({ d, w, h, brand }) {
    const colors = brand?.colors || {};
    const modMap = brand?.modMap || {};
    const primary = colors.primary || '#0057B7';
    const bgDark = colors.bgDark || '#040C1A';
    const accent = colors.accent || '#4D9AFF';
    const mod = modMap[d.accentModule] || modMap.none || { c: accent };
    const modColor = mod.c;
    const sigName = brand?.tenantMeta?.name || 'PostAtomic';
    const p = Math.round(w * .059);
    const hfs = h > 1400 ? Math.round(w * .094) : Math.round(w * .082);
    const sfs = Math.round(w * .037);
    const stFs = Math.round(w * .163);

    return (
        <div style={{
            width: w, height: h, position: 'relative', overflow: 'hidden',
            fontFamily: "'Satoshi',sans-serif",
            background: `radial-gradient(ellipse 100% 52% at 50% -8%,rgba(${rgb(primary)},.3) 0%,${bgDark} 55%)`,
        }}>
            <Grid w={w} h={h} color={accent} />
            <Orb x={w * .5} y={0} r={w * .78} color={modColor} o={.09} />
            {[.48, .62].map((r, i) => (
                <div key={i} style={{ position: 'absolute', top: h * .04, right: -w * r * .32, width: w * r, height: w * r, borderRadius: '50%', border: `1px solid rgba(255,255,255,${.04 - i * .015})`, pointerEvents: 'none' }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: p, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GovBadge chip={d.chip} modColor={modColor} fs={20} />
                <div>
                    {d.stat && <div style={{ fontSize: stFs, fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', marginBottom: Math.round(h * .017), color: '#FFFFFF' }}>{d.stat}</div>}
                    {d.statLabel && <div style={{ fontSize: Math.round(sfs * .82), color: 'rgba(255,255,255,.42)', fontWeight: 500, marginBottom: Math.round(h * .022), lineHeight: 1.4 }}>{d.statLabel}</div>}
                    <div style={{ fontSize: hfs, fontWeight: 900, color: '#FFF', lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: Math.round(h * .02) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: sfs, color: 'rgba(255,255,255,.48)', lineHeight: 1.45, fontWeight: 500, maxWidth: w * .83 }}>{d.subheadline}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 100, padding: `${Math.round(p * .24)}px ${Math.round(p * .5)}px` }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: modColor, boxShadow: `0 0 10px ${modColor}` }} />
                        <Sig dark fs={19} name={sigName} />
                    </div>
                    {d.cta && <div style={{ background: primary, color: '#fff', whiteSpace: 'nowrap', padding: `${Math.round(p * .24)}px ${Math.round(p * .52)}px`, borderRadius: 100, fontSize: 22, fontWeight: 800, boxShadow: `0 4px 22px rgba(${rgb(primary)},.48)` }}>{d.cta} →</div>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: HERO LIGHT ── */
function TplHL({ d, w, h, brand }) {
    const colors = brand?.colors || {};
    const modMap = brand?.modMap || {};
    const primary = colors.primary || '#0057B7';
    const accent = colors.accent || '#4D9AFF';
    const bgLight = colors.bgLight || '#F4F6F9';
    const mod = modMap[d.accentModule] || modMap.none || { c: accent };
    const modColor = mod.c;
    const sigName = brand?.tenantMeta?.name || 'PostAtomic';
    const p = Math.round(w * .059);
    const hfs = h > 1400 ? Math.round(w * .094) : Math.round(w * .082);
    const sfs = Math.round(w * .037);

    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#FFFFFF', borderLeft: `8px solid ${modColor}` }}>
            <div style={{ position: 'absolute', top: -w * .28, right: -w * .28, width: w * .64, height: w * .64, borderRadius: '50%', background: `radial-gradient(circle,${modColor}22 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -w * .12, left: p, width: w * .38, height: w * .38, borderRadius: '50%', background: `radial-gradient(circle,${modColor}22 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, paddingTop: p, paddingBottom: p, paddingRight: p, paddingLeft: p + 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GovBadge chip={d.chip} modColor={modColor} fs={20} />
                <div>
                    {d.stat && <div style={{ fontSize: Math.round(w * .15), fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', color: modColor, marginBottom: Math.round(h * .012) }}>{d.stat}</div>}
                    {d.statLabel && <div style={{ fontSize: Math.round(sfs * .8), color: LIGHT.t2, marginBottom: Math.round(h * .02), fontWeight: 500 }}>{d.statLabel}</div>}
                    <div style={{ fontSize: hfs, fontWeight: 900, color: LIGHT.t1, lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: Math.round(h * .02) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: sfs, color: LIGHT.t2, lineHeight: 1.45, fontWeight: 500 }}>{d.subheadline}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Sig dark={false} fs={19} name={sigName} />
                    {d.cta && <div style={{ background: modColor, color: '#fff', padding: `${Math.round(p * .24)}px ${Math.round(p * .52)}px`, borderRadius: 100, fontSize: 22, fontWeight: 800 }}>{d.cta} →</div>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: FEATURE DARK ── */
function TplFD({ d, w, h, brand }) {
    const colors = brand?.colors || {};
    const modMap = brand?.modMap || {};
    const accent = colors.accent || '#4D9AFF';
    const mod = modMap[d.accentModule] || modMap.none || { c: accent };
    const modColor = mod.c;
    const sigName = brand?.tenantMeta?.name || 'PostAtomic';
    const p = Math.round(w * .059);
    const hfs = Math.round(w * .062), ifs = Math.round(w * .034);

    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: 'linear-gradient(155deg,#040C1A 0%,#060D1B 100%)' }}>
            <Grid w={w} h={h} color={accent} op={.04} />
            <Orb x={w} y={0} r={w * .65} color={modColor} o={.07} />
            <div style={{ position: 'absolute', top: 0, left: p, right: p, height: 3, background: `linear-gradient(90deg,${modColor} 0%,transparent 85%)` }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: p, paddingTop: p + 14, display: 'flex', flexDirection: 'column', gap: Math.round(h * .03) }}>
                <div>
                    <GovBadge chip={d.chip} modColor={modColor} fs={20} />
                    <div style={{ fontSize: hfs, fontWeight: 900, color: '#FFF', lineHeight: 1.15, letterSpacing: '-.025em', marginTop: Math.round(h * .024) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: Math.round(w * .031), color: 'rgba(255,255,255,.42)', marginTop: Math.round(h * .012), lineHeight: 1.4, fontWeight: 500 }}>{d.subheadline}</div>}
                </div>
                {d.items?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(h * .016), flex: 1 }}>
                        {d.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: `${Math.round(h * .02)}px ${Math.round(w * .035)}px`, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.055)', borderRadius: 16, borderLeft: `3px solid ${modColor}` }}>
                                <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: modColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: modColor }}>{String(i + 1).padStart(2, '0')}</div>
                                <span style={{ fontSize: ifs, color: 'rgba(255,255,255,.75)', fontWeight: 500, lineHeight: 1.35 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: Math.round(h * .014), borderTop: '1px solid rgba(255,255,255,.07)' }}>
                    <Sig fs={19} name={sigName} />
                    {d.cta && <span style={{ fontSize: 22, color: modColor, fontWeight: 800 }}>{d.cta} →</span>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: FEATURE LIGHT ── */
function TplFL({ d, w, h, brand }) {
    const colors = brand?.colors || {};
    const modMap = brand?.modMap || {};
    const accent = colors.accent || '#4D9AFF';
    const mod = modMap[d.accentModule] || modMap.none || { c: accent };
    const modColor = mod.c;
    const sigName = brand?.tenantMeta?.name || 'PostAtomic';
    const p = Math.round(w * .059);
    const hfs = Math.round(w * .062), ifs = Math.round(w * .034);

    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: '#F4F6F9', borderLeft: `8px solid ${modColor}` }}>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: w * .48, height: w * .48, background: `radial-gradient(circle at bottom right,${modColor}22 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, paddingTop: p, paddingBottom: p, paddingRight: p, paddingLeft: p + 8, display: 'flex', flexDirection: 'column', gap: Math.round(h * .026) }}>
                <div>
                    <GovBadge chip={d.chip} modColor={modColor} fs={20} />
                    <div style={{ fontSize: hfs, fontWeight: 900, color: LIGHT.t1, lineHeight: 1.15, letterSpacing: '-.025em', marginTop: Math.round(h * .024) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: Math.round(w * .031), color: LIGHT.t2, marginTop: Math.round(h * .012), lineHeight: 1.4, fontWeight: 500 }}>{d.subheadline}</div>}
                </div>
                {d.items?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(h * .014), flex: 1 }}>
                        {d.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: `${Math.round(h * .019)}px ${Math.round(w * .03)}px`, background: 'rgba(255,255,255,.9)', border: `1px solid ${LIGHT.bord}`, borderRadius: 14, borderLeft: `3px solid ${modColor}`, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: modColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: modColor }}>{i + 1}</div>
                                <span style={{ fontSize: ifs, color: LIGHT.t1, fontWeight: 500, lineHeight: 1.35 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: Math.round(h * .012), borderTop: `1px solid ${LIGHT.bord}` }}>
                    <Sig dark={false} fs={19} name={sigName} />
                    {d.cta && <div style={{ background: modColor, color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 20, fontWeight: 800 }}>{d.cta} →</div>}
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: CTA DARK ── */
function TplCTA({ d, w, h, brand }) {
    const colors = brand?.colors || {};
    const modMap = brand?.modMap || {};
    const primary = colors.primary || '#0057B7';
    const accent = colors.accent || '#4D9AFF';
    const mod = modMap[d.accentModule] || modMap.none || { c: accent };
    const modColor = mod.c;
    const sigName = brand?.tenantMeta?.name || 'PostAtomic';
    const p = Math.round(w * .065);
    const hfs = h > 1400 ? Math.round(w * .098) : Math.round(w * .085);
    const sfs = Math.round(w * .038);

    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: `radial-gradient(ellipse 115% 70% at 50% 108%,rgba(${rgb(primary)},.42) 0%,#040C1A 55%)` }}>
            <Grid w={w} h={h} color={accent} />
            <Orb x={w * .5} y={h} r={w * .85} color={primary} o={.18} />
            {[.38, .52, .67].map((r, i) => (
                <div key={i} style={{ position: 'absolute', bottom: -w * r * .48, left: '50%', transform: 'translateX(-50%)', width: w * r, height: w * r, borderRadius: '50%', border: `1px solid rgba(255,255,255,${.06 - i * .018})`, pointerEvents: 'none' }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: p, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <GovBadge chip={d.chip} modColor={modColor} fs={20} />
                </div>
                <div>
                    {d.stat && <div style={{ fontSize: Math.round(w * .138), fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', marginBottom: Math.round(h * .018), color: '#FFFFFF' }}>{d.stat}</div>}
                    <div style={{ fontSize: hfs, fontWeight: 900, color: '#FFF', lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: Math.round(h * .024) }}>{d.headline}</div>
                    {d.subheadline && <div style={{ fontSize: sfs, color: 'rgba(255,255,255,.46)', lineHeight: 1.5, fontWeight: 500, maxWidth: w * .8, margin: '0 auto' }}>{d.subheadline}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                    {d.cta && <div style={{ background: `linear-gradient(135deg,${primary} 0%,${colors.primaryDark || '#003A82'} 100%)`, color: '#fff', padding: `${Math.round(p * .36)}px ${Math.round(p * .82)}px`, borderRadius: 100, fontSize: 26, fontWeight: 800, boxShadow: `0 0 44px rgba(${rgb(primary)},.58)`, letterSpacing: '-.01em' }}>{d.cta} →</div>}
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                        <Sig fs={19} name={sigName} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── TEMPLATE: STORY ── */
function TplStory({ d, w, h, brand }) {
    const colors = brand?.colors || {};
    const modMap = brand?.modMap || {};
    const accent = colors.accent || '#4D9AFF';
    const primary = colors.primary || '#0057B7';
    const mod = modMap[d.accentModule] || modMap.none || { c: accent };
    const modColor = mod.c;
    const sigName = brand?.tenantMeta?.name || 'PostAtomic';
    const pc = PHASE_COLORS[d.phase] || modColor;
    const isCTAPhase = ['Ação', 'CTA', 'Solução'].includes(d.phase);
    const p = Math.round(w * .074), hfs = Math.round(w * .11), sfs = Math.round(w * .05);
    const bg = `radial-gradient(ellipse 110% 65% at 50% ${isCTAPhase ? '105%' : '0%'},rgba(${rgb(pc)},.22) 0%,#040C1A 58%)`;

    return (
        <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: "'Satoshi',sans-serif", background: bg }}>
            <Grid w={w} h={h} color={accent} op={.04} />
            <Orb x={w * .5} y={isCTAPhase ? h : 0} r={w * .9} color={pc} o={.1} />
            <div style={{ position: 'absolute', top: p, left: p, right: p, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 24px', borderRadius: 100, background: 'rgba(255,255,255,.06)', border: `1px solid ${pc}30`, fontSize: 20, fontWeight: 800, color: pc, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc, boxShadow: `0 0 9px ${pc}` }} />
                    {d.phase || d.chip || 'GESTÃO MUNICIPAL'}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,.35)', letterSpacing: '.06em' }}>
                    {sigName}
                </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, paddingTop: p * 2.8, paddingBottom: p * 2.2, paddingLeft: p, paddingRight: p, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(h * .027) }}>
                {d.stat && <div style={{ fontSize: Math.round(w * .19), fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', color: '#FFFFFF' }}>{d.stat}</div>}
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
                {d.cta && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: `linear-gradient(135deg,${primary} 0%,${colors.primaryDark || '#003A82'} 100%)`, color: '#fff', padding: `${Math.round(p * .3)}px ${Math.round(p * .78)}px`, borderRadius: 100, fontSize: 28, fontWeight: 800, boxShadow: `0 4px 28px rgba(${rgb(primary)},.5)`, marginTop: Math.round(h * .01) }}>{d.cta} →</div>}
            </div>
        </div>
    );
}

function pickTpl(fmt, idx, total, sl) {
    if (fmt === 'story') return 'story';
    const isLight = sl.theme === 'light';
    if (fmt === 'post') return isLight ? 'hero-light' : 'hero-dark';
    if (idx === 0) return 'hero-dark';
    if (idx === total - 1) return 'cta-dark';
    return isLight ? 'feature-light' : 'feature-dark';
}

export function Slide({ slide, w, h, fmt, idx, total }) {
    const brand = useBrand();
    const t = pickTpl(fmt, idx, total, slide);
    const props = { d: slide, w, h, brand };
    const map = {
        'hero-dark': TplHD,
        'hero-light': TplHL,
        'feature-dark': TplFD,
        'feature-light': TplFL,
        'cta-dark': TplCTA,
        'story': TplStory,
    };
    const T = map[t] || TplHD;
    return <T {...props} />;
}
