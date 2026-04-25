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
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
            <div style={{ flex: 1 }}>
                <Input label={`Módulo ${index + 1}`} placeholder="Nome do produto/área"
                    value={mod.name} onChange={(e) => onChange({ ...mod, name: e.target.value })} />
            </div>
            <div style={{ width: 120, flexShrink: 0 }}>
                <ColorPicker label="Cor" value={mod.color} onChange={(v) => onChange({ ...mod, color: v })} />
            </div>
            <button onClick={onRemove}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616161', fontSize: 18, padding: '0 4px', lineHeight: 1, transition: 'color 0.15s', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
                onMouseLeave={e => e.currentTarget.style.color = '#616161'}>×</button>
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
        setModules(m => [...m, { key: `mod_${Date.now()}`, name: '', color: '#0CC981' }]);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Inter, sans-serif' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF', marginBottom: 8 }}>Módulos e Marca</h1>
                <p style={{ fontSize: 14, color: '#A8A8A8' }}>Produtos ou áreas da empresa que aparecerão nos posts como categorias.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {modules.map((m, i) => (
                    <ModuleRow key={m.key || i} mod={m} index={i}
                        onChange={(v) => setModules(ms => ms.map((x, j) => j === i ? v : x))}
                        onRemove={() => setModules(ms => ms.filter((_, j) => j !== i))} />
                ))}
                {modules.length < 5 && (
                    <button onClick={addModule}
                        style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 0', fontSize: 12, color: '#616161', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', width: '100%' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(12,201,129,0.35)'; e.currentTarget.style.color = '#0CC981'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#616161'; }}>
                        + Adicionar módulo
                    </button>
                )}
                {error && <p style={{ fontSize: 12, color: '#F87171' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Presença Digital</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Input label="Handle (@)" placeholder="@suaempresa" value={handle} onChange={(e) => setHandle(e.target.value)} />
                    <Input label="Domínio" placeholder="suaempresa.com.br" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" size="md" onClick={onBack} style={{ width: 100 }}>← Voltar</Button>
                <Button variant="primary" onClick={submit} loading={saving} style={{ flex: 1 }}>Próximo →</Button>
            </div>
        </div>
    );
}
