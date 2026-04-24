import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { buildSystemPrompt } from '../lib/buildSystemPrompt';

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
    const { tenant } = useAuth();

    const brand = useMemo(() => {
        if (!tenant) return null;

        const cfg = tenant.brand_config || {};
        const modules = cfg.modules?.length
            ? cfg.modules
            : [{ key: 'main', name: tenant.name, color: cfg.primary || '#4D9AFF' }];

        const colors = {
            primary:   cfg.primary  || '#0057B7',
            accent:    cfg.accent   || '#4D9AFF',
            bgDark:    cfg.bgDark   || '#040C1A',
            bgLight:   cfg.bgLight  || '#F4F6F9',
            font:      cfg.fontDisplay || 'Satoshi',
        };

        const modMap = {};
        modules.forEach((m) => {
            modMap[m.key] = { c: m.color, s: m.color + '22', n: m.name };
        });
        // Always provide a 'none' fallback
        modMap.none = modMap[modules[0]?.key] || { c: colors.accent, s: colors.accent + '22', n: tenant.name };

        return {
            colors,
            modules,
            modMap,
            topics: tenant.tags || [],
            handle: cfg.handle || '',
            domain: cfg.domain || '',
            tenantMeta: {
                name: tenant.name,
                segment: tenant.segment,
                description: tenant.description,
                targetAudience: tenant.target_audience,
                tone: tenant.tone,
                defaultCta: tenant.default_cta,
                platforms: tenant.platforms || [],
                logoUrl: tenant.logo_url,
                plan: tenant.plan,
            },
            systemPrompt: buildSystemPrompt(tenant),
        };
    }, [tenant]);

    return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export const useBrand = () => useContext(BrandContext);
