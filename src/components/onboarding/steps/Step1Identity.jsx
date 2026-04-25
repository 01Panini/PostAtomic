import { useState } from 'react';
import { Input, Select } from '../../ui/Input';
import { Button } from '../../ui/Button';

const SEGMENTS = ['Tecnologia/SaaS','Saúde','Educação','Consultoria','Varejo','Agência/Marketing','Govtech','Financeiro','Outro'];

export default function Step1Identity({ data, onNext, saving }) {
    const [form, setForm] = useState({
        name: data.name || '',
        segment: data.segment || '',
        description: data.description || '',
        website: data.website || '',
    });
    const [errors, setErrors] = useState({});

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nome obrigatório';
        else if (form.name.length > 60) e.name = 'Máximo 60 caracteres';
        if (!form.segment) e.segment = 'Selecione um segmento';
        if (!form.description.trim()) e.description = 'Descrição obrigatória';
        else if (form.description.length < 20) e.description = 'Mínimo 20 caracteres';
        else if (form.description.length > 200) e.description = 'Máximo 200 caracteres';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const submit = () => { if (validate()) onNext(form); };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Inter, sans-serif' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF', marginBottom: 8 }}>Identidade da Empresa</h1>
                <p style={{ fontSize: 14, color: '#A8A8A8' }}>Vamos começar com o básico. Essas informações guiam toda a geração de conteúdo.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input label="Nome da empresa" placeholder="Ex: Acme Corp" value={form.name} onChange={set('name')} error={errors.name} maxLength={60} />

                <Select label="Segmento / Nicho" value={form.segment} onChange={set('segment')} error={errors.segment}>
                    <option value="">Selecione…</option>
                    {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>

                <div>
                    <Input label="Descrição breve" placeholder="O que sua empresa faz em uma frase" as="textarea" rows={3}
                        value={form.description} onChange={set('description')} error={errors.description} />
                    <p style={{ fontSize: 11, color: '#616161', marginTop: 6, fontFamily: 'Inter, sans-serif' }}>{form.description.length}/200 caracteres</p>
                </div>

                <Input label="URL do site (opcional)" placeholder="https://suaempresa.com.br" type="url" value={form.website} onChange={set('website')} />
            </div>

            <Button variant="primary" size="xl" onClick={submit} loading={saving}>
                Próximo →
            </Button>
        </div>
    );
}
