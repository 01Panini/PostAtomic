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
            className={`w-full text-left rounded-2xl border p-4 transition-all duration-200
                ${selected ? 'border-blue/50 bg-blue/[.08] shadow-[0_0_0_1px_rgba(0,87,183,.3)]' : 'border-[#0D1325] bg-white/[.02] hover:border-[#162035]'}`}>
            <div className="flex gap-2 mb-3">
                {[palette.primary, palette.accent, palette.bgDark, palette.bgLight].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border border-white/10" style={{ background: c }} title={c} />
                ))}
            </div>
            <p className="text-sm font-bold text-text-1 mb-0.5">{palette.name}</p>
            <p className="text-xs text-text-3">{palette.rationale}</p>
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
        onNext({
            logo_url: logo || null,
            brand_config: { ...colorFields },
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Identidade Visual</h1>
                <p className="text-text-2">Defina as cores que vão aparecer em todos os seus posts.</p>
            </div>

            {/* Logo */}
            <div className="flex flex-col gap-3">
                <span className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">Logo (opcional)</span>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#162035] flex items-center justify-center bg-white/[.02] overflow-hidden flex-shrink-0">
                        {logo ? <img src={logo} className="w-full h-full object-cover" alt="logo" /> : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 21V7l9-4 9 4v14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                                <rect x="9" y="14" width="6" height="7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                                <rect x="5" y="11" width="3" height="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                                <rect x="16" y="11" width="3" height="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-light border border-blue/30 rounded-lg px-3 py-2 hover:bg-blue/10 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
                            Enviar logo
                            <input type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleLogo} className="hidden" />
                        </label>
                        <p className="text-xs text-text-3 mt-1.5">PNG, JPG ou SVG · máx 2MB</p>
                    </div>
                </div>
            </div>

            {/* Palettes */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">Paleta de Cores</span>
                    <Button variant="secondary" size="sm" onClick={suggestPalettes} loading={suggesting}>
                        Sugerir com IA
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {palettes.map((p, i) => (
                        <PaletteCard key={i} palette={p} selected={!showCustom && selected === i} onSelect={() => { setSelected(i); setShowCustom(false); }} />
                    ))}
                </div>

                <button onClick={() => setShowCustom(v => !v)}
                    className="text-sm text-text-2 hover:text-text-1 transition-colors text-left flex items-center gap-2">
                    <span>{showCustom ? '▼' : '▶'}</span> Personalizar cores manualmente
                </button>

                {showCustom && (
                    <div className="grid grid-cols-2 gap-4 bg-white/[.02] border border-[#0D1325] rounded-2xl p-4 animate-fade-up">
                        <ColorPicker label="Cor primária" value={custom.primary} onChange={(v) => setCustom(c => ({ ...c, primary: v }))} />
                        <ColorPicker label="Cor de destaque" value={custom.accent} onChange={(v) => setCustom(c => ({ ...c, accent: v }))} />
                        <ColorPicker label="Fundo escuro" value={custom.bgDark} onChange={(v) => setCustom(c => ({ ...c, bgDark: v }))} />
                        <ColorPicker label="Fundo claro" value={custom.bgLight} onChange={(v) => setCustom(c => ({ ...c, bgLight: v }))} />
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={onBack} className="w-28">← Voltar</Button>
                <Button variant="primary" className="flex-1" onClick={submit} loading={saving}>Próximo →</Button>
            </div>
        </div>
    );
}
