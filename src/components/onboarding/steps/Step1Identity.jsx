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
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Identidade da Empresa</h1>
                <p className="text-text-2">Vamos começar com o básico. Essas informações guiam toda a geração de conteúdo.</p>
            </div>

            <div className="flex flex-col gap-5">
                <Input label="Nome da empresa" placeholder="Ex: Acme Corp" value={form.name} onChange={set('name')} error={errors.name} maxLength={60} />

                <Select label="Segmento / Nicho" value={form.segment} onChange={set('segment')} error={errors.segment}>
                    <option value="">Selecione…</option>
                    {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>

                <Input label="Descrição breve" placeholder="O que sua empresa faz em uma frase" as="textarea" rows={3}
                    value={form.description} onChange={set('description')} error={errors.description} />
                <p className="text-xs text-text-3 -mt-3">{form.description.length}/200 caracteres</p>

                <Input label="URL do site (opcional)" placeholder="https://suaempresa.com.br" type="url" value={form.website} onChange={set('website')} />
            </div>

            <Button variant="primary" size="xl" onClick={submit} loading={saving}>
                Próximo →
            </Button>
        </div>
    );
}
