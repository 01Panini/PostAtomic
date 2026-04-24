import { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { TONE_OPTIONS } from '../../../constants/toneSamples';

const PLATFORMS = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

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
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Público e Tom</h1>
                <p className="text-text-2">Quem você quer atingir e como quer soar.</p>
            </div>

            <div className="flex flex-col gap-6">
                <Input label="Público-alvo" as="textarea" rows={2}
                    placeholder="Ex: diretores de RH em empresas de 50-200 funcionários"
                    value={form.target_audience} onChange={(e) => setForm(f => ({ ...f, target_audience: e.target.value }))}
                    error={errors.target_audience} />

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">Tom de Voz</span>
                    <div className="grid grid-cols-2 gap-3">
                        {TONE_OPTIONS.map((t) => (
                            <Card key={t.value} selected={form.tone === t.value} onClick={() => setForm(f => ({ ...f, tone: t.value }))}>
                                <div className="flex flex-col gap-2">
                                    <span className="text-2xl">{t.icon}</span>
                                    <span className="text-sm font-bold text-text-1">{t.label}</span>
                                    <span className="text-xs text-text-3">{t.desc}</span>
                                    <span className="text-xs text-text-2 italic border-l-2 border-blue/30 pl-2 mt-1">{t.sample}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                    {errors.tone && <p className="text-xs text-red-400">{errors.tone}</p>}
                </div>

                <Input label="CTA padrão" placeholder="Ex: Agende uma demonstração gratuita"
                    value={form.default_cta} onChange={(e) => setForm(f => ({ ...f, default_cta: e.target.value }))}
                    error={errors.default_cta} />

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-extrabold tracking-[.12em] uppercase text-text-3">Plataformas Alvo</span>
                    <div className="flex gap-3">
                        {PLATFORMS.map((p) => (
                            <Card key={p.value} selected={form.platforms.includes(p.value)} onClick={() => togglePlatform(p.value)}
                                className="flex-1 flex items-center gap-3">
                                <span className="text-2xl">{p.icon}</span>
                                <span className="text-sm font-bold">{p.label}</span>
                            </Card>
                        ))}
                    </div>
                    {errors.platforms && <p className="text-xs text-red-400">{errors.platforms}</p>}
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={onBack} className="w-28">← Voltar</Button>
                <Button variant="primary" className="flex-1" onClick={submit} loading={saving}>Próximo →</Button>
            </div>
        </div>
    );
}
