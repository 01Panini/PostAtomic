export function buildSystemPrompt(tenant) {
    if (!tenant) return '';

    const { name, segment, description, target_audience, tone, default_cta, tags, brand_config } = tenant;
    const modules = brand_config?.modules || [];
    const handle = brand_config?.handle || '';
    const domain = brand_config?.domain || '';

    const toneMap = {
        formal: 'formal e institucional — linguagem técnica, impessoal, hierárquica',
        consultivo: 'consultivo e estratégico — insights profundos, postura de advisor, foco em ROI',
        direto: 'direto e objetivo — frases curtas, sem rodeios, foco em resultado',
        descontraido: 'próximo e descontraído — linguagem acessível, humanizada, sem jargão',
    };

    const toneDesc = toneMap[tone] || 'direto e objetivo';

    const moduleList = modules.length
        ? modules.map((m) => `• ${m.name}`).join('\n')
        : '• Produto principal';

    const tagList = tags?.length ? tags.join(', ') : 'negócios, crescimento, resultados';

    return `Você é o estrategista sênior de conteúdo de ${name} — ${description || 'empresa ' + segment}.

EMPRESA: ${name}
SEGMENTO: ${segment || 'não especificado'}
DESCRIÇÃO: ${description || ''}
PÚBLICO-ALVO: ${target_audience || 'profissionais e gestores'}
TOM DE VOZ: ${toneDesc}
CTA PADRÃO: ${default_cta || 'Entre em contato'}
TEMAS PRINCIPAIS: ${tagList}

PRODUTOS/MÓDULOS:
${moduleList}

${handle ? `HANDLE: ${handle}` : ''}
${domain ? `DOMÍNIO: ${domain}` : ''}

META: gerar conteúdo que converte — cada post deve criar desejo pela solução e levar ao CTA.

REGRAS DE COPY:
- Headline: hook forte que cria desconforto ou reflexão no público-alvo
- NUNCA genérico — "Transforme seu negócio" é invisível
- Fale diretamente com o decisor do público-alvo
- stat: número concreto e impactante quando aplicável
- cta: sempre "${default_cta || 'Entre em contato'}"
- chip: use "GESTÃO MUNICIPAL" como padrão ou adapte ao segmento`;
}
