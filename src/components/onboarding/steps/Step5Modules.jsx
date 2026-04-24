import { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ColorPicker } from '../../ui/ColorPicker';

const MODULE_SUGGESTIONS = {
    'Tecnologia/SaaS': [{ name: 'Produto Principal', color: '#4D9AFF' }, { name: 'Suporte', color: '#34D399' }, { name: 'Cases', color: '#FBBF24' }],
    'Saúde': [{ name: 'Clínica', color: '#0EA5E9' }, { name: 'Prevenção', color: '#34D399' }, { name: 'Diagnóstico', color: '#A78BFA' }],
    'Educação': [{ name: 'Cursos', color: '#4D9AFF' }, { name: 'Mentoria', color: '#FBBF24' }, { name: 'Comunidade', color: '#34D399' }],
    'Govtech': [{ name: 'Ouvidoria', color: '#4D9AFF' }, { name: 'Operação', color: '#FBBF24' }, { name: 'Inteligência', color: '#A78BFA' }],
    default: [{ name: 'Produto', color: '#4D9AFF' }, { name: 'Serviços', color: '#34D399' }, { name: 'Cases', color: '#FBBF24' }],
};

function ModuleRow({ mod, onChange, onRemove, index }) {
    return (
        <div className="flex items-end gap-3 bg-white/[.02] border border-[#0D1325] rounded-xl p-4">
            <div className="flex-1">
                <Input label={`Módulo ${index + 1}`} placeholder="Nome do produto/área"
                    value={mod.name} onChange={(e) => onChange({ ...mod, name: e.target.value })} />
            </div>
            <div className="w-36 flex-shrink-0">
                <ColorPicker label="Cor" value={mod.color} onChange={(v) => onChange({ ...mod, color: v })} />
            </div>
            <button onClick={onRemove} className="mb-0.5 text-text-3 hover:text-red-400 transition-colors text-lg leading-none">×</button>
        </div>
    );
}

export default function Step5Modules({ data, onNext, onBack, saving }) {
    const suggestions = MODULE_SUGGESTIONS[data.segment] || MODULE_SUGGESTIONS.default;
    const [modules, setModules] = useState(
        data.brand_config?.modules?.length ? data.brand_config.modules : suggestions.map((s, i) => ({ ...s, key: `mod_${i}` }))
    );
    const [handle, setHandle] = useState(data.brand_config?.handle || '');
    const [domain, setDomain] = useState(data.brand_config?.domain || '');
    const [error, setError] = useState('');

    const addModule = () => {
        if (modules.length >= 5) return;
        setModules(m => [...m, { key: `mod_${Date.now()}`, name: '', color: '#4D9AFF' }]);
    };

    const submit = () => {
        if (!modules.length || modules.some(m => !m.name.trim())) { setError('Preencha o nome de todos os módulos'); return; }
        setError('');
        onNext({
            brand_config: {
                ...(data.brand_config || {}),
                modules: modules.map(m => ({ key: m.key || m.name.toLowerCase().replace(/\s+/g, '_'), name: m.name, color: m.color })),
                handle: handle.replace(/^@/, ''),
                domain: domain.replace(/^https?:\/\//, ''),
            }
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Módulos e Marca</h1>
                <p className="text-text-2">Produtos ou áreas da empresa que aparecerão nos posts como categorias.</p>
            </div>

            <div className="flex flex-col gap-3">
                {modules.map((m, i) => (
                    <ModuleRow key={m.key || i} mod={m} index={i}
                        onChange={(v) => setModules(ms => ms.map((x, j) => j === i ? v : x))}
                        onRemove={() => setModules(ms => ms.filter((_, j) => j !== i))} />
                ))}
                {modules.length < 5 && (
                    <button onClick={addModule} className="w-full border border-dashed border-[#162035] rounded-xl py-3 text-sm text-text-3 hover:border-blue/40 hover:text-blue-light transition-colors">
                        + Adicionar módulo
                    </button>
                )}
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            <div className="flex flex-col gap-4 border-t border-[#0D1325] pt-6">
                <h2 className="text-sm font-bold text-text-1">Presença Digital</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Handle (@)" placeholder="@suaempresa" value={handle} onChange={(e) => setHandle(e.target.value)} />
                    <Input label="Domínio" placeholder="suaempresa.com.br" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={onBack} className="w-28">← Voltar</Button>
                <Button variant="primary" className="flex-1" onClick={submit} loading={saving}>Próximo →</Button>
            </div>
        </div>
    );
}
