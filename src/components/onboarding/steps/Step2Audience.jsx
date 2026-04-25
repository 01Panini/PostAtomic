import { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { TONE_OPTIONS } from '../../../constants/toneSamples';

const IGIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
);
const LIIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 10v7M7 7v.5M12 17v-4a2 2 0 014 0v4M12 10v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const PLATFORMS = [
    { value: 'instagram', label: 'Instagram', icon: <IGIcon /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <LIIcon /> },
];

const S = {
    sectionLabel: {
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: '#616161', fontFamily: 'Inter, sans-serif',
    },
    errorText: { fontSize: 12, color: '#F87171', fontFamily: 'Inter, sans-serif' },
    italic: { fontSize: 12, color: '#A8A8A8', fontStyle: 'italic', borderLeft: '2px solid rgba(12,201,129,0.25)', paddingLeft: 10, marginTop: 6, fontFamily: 'Inter, sans-serif' },
};

export default function Step2Audience({ data, onNext, onBack, saving }) {
    const [form, setForm] = useState({
        target_audience: data.target_audience || '',
        tone: data.tone || '',
        default_cta: data.default_cta || '',
        platforms: data.platforms || [],
    });
    const [errors, setErrors] = useState({});

    const togglePlatform = (v) =>
        setForm((f) => ({
            ...f,
            platforms: f.platforms.includes(v) ? f.platforms.filter((x) => x !== v) : [...f.platforms, v],
        }));

    const validate = () => {
        const e = {};
        if (!form.target_audience.trim()) e.target_audience = 'Descreva seu público-alvo';
        if (!form.tone) e.tone = 'Escolha um tom de voz';
        if (!form.default_cta.trim()) e.default_cta = 'Defina um CTA padrão';
        if (!form.platforms.length) e.platforms = 'Selecione ao menos uma plataforma';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const submit = () => { if (validate()) onNext(form); };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Inter, sans-serif' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF', marginBottom: 8 }}>Público e Tom</h1>
                <p style={{ fontSize: 14, color: '#A8A8A8' }}>Quem você quer atingir e como quer soar.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Input label="Público-alvo" as="textarea" rows={2}
                    placeholder="Ex: diretores de RH em empresas de 50-200 funcionários"
                    value={form.target_audience} onChange={(e) => setForm(f => ({ ...f, target_audience: e.target.value }))}
                    error={errors.target_audience} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={S.sectionLabel}>Tom de Voz</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {TONE_OPTIONS.map((t) => (
                            <Card key={t.value} selected={form.tone === t.value} onClick={() => setForm(f => ({ ...f, tone: t.value }))}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{t.label}</span>
                                    <span style={{ fontSize: 11, color: '#616161' }}>{t.desc}</span>
                                    <span style={S.italic}>{t.sample}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                    {errors.tone && <p style={S.errorText}>{errors.tone}</p>}
                </div>

                <Input label="CTA padrão" placeholder="Ex: Agende uma demonstração gratuita"
                    value={form.default_cta} onChange={(e) => setForm(f => ({ ...f, default_cta: e.target.value }))}
                    error={errors.default_cta} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={S.sectionLabel}>Plataformas Alvo</span>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {PLATFORMS.map((p) => (
                            <Card key={p.value} selected={form.platforms.includes(p.value)}
                                onClick={() => togglePlatform(p.value)}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: '#A8A8A8' }}>{p.icon}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{p.label}</span>
                            </Card>
                        ))}
                    </div>
                    {errors.platforms && <p style={S.errorText}>{errors.platforms}</p>}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" size="md" onClick={onBack} style={{ width: 100 }}>← Voltar</Button>
                <Button variant="primary" onClick={submit} loading={saving} style={{ flex: 1 }}>Próximo →</Button>
            </div>
        </div>
    );
}
