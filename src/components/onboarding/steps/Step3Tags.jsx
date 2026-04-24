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
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Tags de Conteúdo</h1>
                <p className="text-text-2">Quais temas e palavras-chave definem o conteúdo da sua marca?</p>
            </div>

            <div className="flex flex-col gap-3">
                <TagInput tags={tags} onChange={setTags} suggestions={suggestions} min={3} max={12} />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <p className="text-xs text-text-3">Essas tags orientam a IA ao gerar posts. Quanto mais específicas, melhor o resultado.</p>
            </div>

            <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={onBack} className="w-28">← Voltar</Button>
                <Button variant="primary" className="flex-1" onClick={submit} loading={saving}>Próximo →</Button>
            </div>
        </div>
    );
}
