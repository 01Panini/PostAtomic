export const TAG_SUGGESTIONS = {
    'Tecnologia/SaaS': ['produtividade', 'automação', 'integração', 'SaaS', 'API', 'dados', 'escalabilidade', 'onboarding', 'churn', 'MRR'],
    'Saúde':           ['prevenção', 'diagnóstico', 'paciente', 'telemedicina', 'prontuário', 'gestão hospitalar', 'regulatório', 'ANVISA'],
    'Educação':        ['aprendizado', 'currículo', 'EAD', 'engajamento', 'evasão', 'LMS', 'certificação', 'tutor'],
    'Consultoria':     ['estratégia', 'diagnóstico', 'ROI', 'transformação', 'eficiência', 'processos', 'liderança', 'mudança'],
    'Varejo':          ['conversão', 'ticket médio', 'fidelização', 'estoque', 'omnichannel', 'CX', 'NPS', 'promoção'],
    'Agência/Marketing':['branding', 'performance', 'leads', 'funil', 'criativo', 'mídia paga', 'SEO', 'conteúdo'],
    'Govtech':         ['gestão pública', 'transparência', 'ouvidoria', 'operação', 'dados', 'cidadão', 'secretaria', 'prefeitura'],
    'Financeiro':      ['compliance', 'risco', 'rentabilidade', 'inadimplência', 'investimento', 'Open Finance', 'crédito'],
    'Outro':           ['crescimento', 'resultados', 'clientes', 'inovação', 'equipe', 'processo', 'mercado'],
};

export function getSuggestedTags(segment) {
    return TAG_SUGGESTIONS[segment] || TAG_SUGGESTIONS['Outro'];
}
