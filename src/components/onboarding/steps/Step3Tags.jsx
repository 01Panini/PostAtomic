import { useState } from 'react';
import { Button } from '../../ui/Button';
import { TagInput } from '../../ui/TagInput';
import { getSuggestedTags } from '../../../constants/tagSuggestions';

export default function Step3Tags({ data, onNext, onBack, saving }) {
    const [tags, setTags] = useState(data.tags || []);
    const [error, setError] = useState('');

    const suggestions = getSuggestedTags(data.segment);

    const submit = () => {
        if (tags.length < 3) { setError('Adicione pelo menos 3 tags'); return; }
        setError('');
        onNext({ tags });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Inter, sans-serif' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF', marginBottom: 8 }}>Tags de Conteúdo</h1>
                <p style={{ fontSize: 14, color: '#A8A8A8' }}>Quais temas e palavras-chave definem o conteúdo da sua marca?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <TagInput tags={tags} onChange={setTags} suggestions={suggestions} min={3} max={12} />
                {error && <p style={{ fontSize: 12, color: '#F87171', fontFamily: 'Inter, sans-serif' }}>{error}</p>}
                <p style={{ fontSize: 12, color: '#616161', fontFamily: 'Inter, sans-serif' }}>
                    Essas tags orientam a IA ao gerar posts. Quanto mais específicas, melhor o resultado.
                </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" size="md" onClick={onBack} style={{ width: 100 }}>← Voltar</Button>
                <Button variant="primary" onClick={submit} loading={saving} style={{ flex: 1 }}>Próximo →</Button>
            </div>
        </div>
    );
}
