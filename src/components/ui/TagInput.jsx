import { useState } from 'react';

export function TagInput({ tags = [], onChange, suggestions = [], min = 3, max = 12 }) {
    const [input, setInput] = useState('');

    const add = (tag) => {
        const t = tag.trim().toLowerCase();
        if (!t || tags.includes(t) || tags.length >= max) return;
        onChange([...tags, t]);
        setInput('');
    };

    const remove = (t) => onChange(tags.filter((x) => x !== t));

    const onKey = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
        if (e.key === 'Backspace' && !input && tags.length) remove(tags[tags.length - 1]);
    };

    const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

    return (
        <div className="flex flex-col gap-3">
            <div className="min-h-[52px] flex flex-wrap gap-2 items-center bg-[#060814] border border-[#162035] rounded-xl px-3 py-2 focus-within:border-blue transition-colors">
                {tags.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 bg-blue/20 border border-blue/30 text-blue-light text-xs font-bold px-2.5 py-1 rounded-full">
                        {t}
                        <button onClick={() => remove(t)} className="text-blue-light/50 hover:text-blue-light leading-none">&times;</button>
                    </span>
                ))}
                {tags.length < max && (
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKey}
                        onBlur={() => input && add(input)}
                        placeholder={tags.length === 0 ? 'Digite uma tag e pressione Enter…' : ''}
                        className="flex-1 min-w-[140px] bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3"
                    />
                )}
            </div>
            <p className="text-[11px] text-text-3">{tags.length}/{max} tags {tags.length < min && `— mínimo ${min}`}</p>
            {unusedSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-3 w-full">Sugestões:</span>
                    {unusedSuggestions.map((s) => (
                        <button key={s} onClick={() => add(s)} className="text-xs text-text-2 border border-[#162035] rounded-full px-2.5 py-1 hover:border-blue/40 hover:text-blue-light transition-colors">
                            + {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
