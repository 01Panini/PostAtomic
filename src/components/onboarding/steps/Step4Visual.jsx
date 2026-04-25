import { useState } from 'react';
import { Button } from '../../ui/Button';
import { ColorPicker } from '../../ui/ColorPicker';
import { api } from '../../../lib/api';

const DEFAULT_PALETTES = [
    { name: 'Oceano Profundo', rationale: 'Confiança e inovação', primary: '#0057B7', accent: '#4D9AFF', bgDark: '#040C1A', bgLight: '#F4F6F9' },
    { name: 'Índigo Premium', rationale: 'Sofisticação e criatividade', primary: '#6366F1', accent: '#A78BFA', bgDark: '#0A0A1A', bgLight: '#F8F7FF' },
    { name: 'Âmbar Executivo', rationale: 'Energia e resultado', primary: '#D97706', accent: '#FBBF24', bgDark: '#140C02', bgLight: '#FFFBF0' },
];

function PaletteCard({ palette, selected, onSelect }) {
    return (
        <button onClick={onSelect}
            style={{
                width: '100%', textAlign: 'left', borderRadius: 12, padding: 14, cursor: 'pointer',
                border: selected ? '1px solid rgba(12,201,129,0.35)' : '1px solid rgba(255,255,255,0.06)',
                background: selected ? 'rgba(12,201,129,0.06)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
            }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {[palette.primary, palette.accent, palette.bgDark, palette.bgLight].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: c }} title={c} />
                ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>{palette.name}</p>
            <p style={{ fontSize: 11, color: '#616161' }}>{palette.rationale}</p>
        </button>
    );
}

export default function Step4Visual({ data, onNext, onBack, saving }) {
    const [palettes, setPalettes] = useState(DEFAULT_PALETTES);
    const [selected, setSelected] = useState(null);
    const [custom, setCustom] = useState({ primary: '#0057B7', accent: '#4D9AFF', bgDark: '#040C1A', bgLight: '#F4F6F9' });
    const [showCustom, setShowCustom] = useState(false);
    const [suggesting, setSuggesting] = useState(false);
    const [logo, setLogo] = useState(data.logo_url || '');
    const [error, setError] = useState('');

    const suggestPalettes = async () => {
        setSuggesting(true);
        try {
            const r = await api.palette.suggest({ name: data.name, segment: data.segment, description: data.description, tone: data.tone });
            if (r.palettes?.length) setPalettes(r.palettes);
        } catch { /* use defaults */ }
        setSuggesting(false);
    };

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setError('Logo deve ter no máximo 2MB'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => setLogo(ev.target.result);
        reader.readAsDataURL(file);
        setError('');
    };

    const getColors = () => showCustom ? custom : (selected !== null ? palettes[selected] : null);

    const submit = () => {
        const colors = getColors();
        if (!colors) { setError('Selecione ou personalize uma paleta'); return; }
        const { name: _n, rationale: _r, ...colorFields } = colors;
        onNext({ logo_url: logo || null, brand_config: { ...colorFields } });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Inter, sans-serif' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF', marginBottom: 8 }}>Identidade Visual</h1>
                <p style={{ fontSize: 14, color: '#A8A8A8' }}>Defina as cores que vão aparecer em todos os seus posts.</p>
            </div>

            {/* Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#616161' }}>Logo (opcional)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', flexShrink: 0 }}>
                        {logo ? <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" /> : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M3 21V7l9-4 9 4v14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                                <rect x="9" y="14" width="6" height="7" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                                <rect x="5" y="11" width="3" height="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                                <rect x="16" y="11" width="3" height="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0CC981', border: '1px solid rgba(12,201,129,0.25)', borderRadius: 8, padding: '7px 12px', transition: 'all 0.15s' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
                            Enviar logo
                            <input type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleLogo} style={{ display: 'none' }} />
                        </label>
                        <p style={{ fontSize: 11, color: '#616161', marginTop: 6 }}>PNG, JPG ou SVG · máx 2MB</p>
                    </div>
                </div>
            </div>

            {/* Palettes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#616161' }}>Paleta de Cores</span>
                    <Button variant="secondary" size="sm" onClick={suggestPalettes} loading={suggesting}>Sugerir com IA</Button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {palettes.map((p, i) => (
                        <PaletteCard key={i} palette={p} selected={!showCustom && selected === i} onSelect={() => { setSelected(i); setShowCustom(false); }} />
                    ))}
                </div>

                <button onClick={() => setShowCustom(v => !v)}
                    style={{ background: 'none', border: 'none', fontSize: 12, color: '#A8A8A8', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6, padding: 0, fontFamily: 'Inter, sans-serif', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#A8A8A8'}>
                    <span>{showCustom ? '▼' : '▶'}</span> Personalizar cores manualmente
                </button>

                {showCustom && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                        <ColorPicker label="Cor primária" value={custom.primary} onChange={(v) => setCustom(c => ({ ...c, primary: v }))} />
                        <ColorPicker label="Cor de destaque" value={custom.accent} onChange={(v) => setCustom(c => ({ ...c, accent: v }))} />
                        <ColorPicker label="Fundo escuro" value={custom.bgDark} onChange={(v) => setCustom(c => ({ ...c, bgDark: v }))} />
                        <ColorPicker label="Fundo claro" value={custom.bgLight} onChange={(v) => setCustom(c => ({ ...c, bgLight: v }))} />
                    </div>
                )}
            </div>

            {error && <p style={{ fontSize: 12, color: '#F87171', fontFamily: 'Inter, sans-serif' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" size="md" onClick={onBack} style={{ width: 100 }}>← Voltar</Button>
                <Button variant="primary" onClick={submit} loading={saving} style={{ flex: 1 }}>Próximo →</Button>
            </div>
        </div>
    );
}
