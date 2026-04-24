import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const db = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const PLANS = { trial: 10, starter: 20, pro: 100, agency: 500 };

/* ─── helpers ─────────────────────────────────────────────────────── */
function slugify(name) {
    return name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
}

function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Não autenticado' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

async function getMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function anthropic(body) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
    });
    return r.json();
}

/* ─── AUTH ─────────────────────────────────────────────────────────── */
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name, companyName } = req.body;
    if (!email || !password || !companyName) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    const existing = await db`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length) return res.status(409).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(password, 10);

    // Generate unique slug
    let baseSlug = slugify(companyName);
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
        const taken = await db`SELECT id FROM tenants WHERE slug = ${slug}`;
        if (!taken.length) break;
        slug = `${baseSlug}-${suffix++}`;
    }

    const tenantId = randomUUID();
    const userId = randomUUID();

    await db`INSERT INTO tenants (id, slug, name) VALUES (${tenantId}, ${slug}, ${companyName})`;
    await db`INSERT INTO users (id, tenant_id, email, password_hash, name, role) VALUES (${userId}, ${tenantId}, ${email}, ${hash}, ${name || email.split('@')[0]}, 'owner')`;

    const token = jwt.sign({ userId, tenantId, tenantSlug: slug, role: 'owner', email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: userId, email, name, role: 'owner' }, tenant: { id: tenantId, slug, name: companyName } });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

    const rows = await db`SELECT u.*, t.slug as tenant_slug, t.name as tenant_name, t.brand_config FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE u.email = ${email}`;
    if (!rows.length) return res.status(401).json({ error: 'Email ou senha inválidos' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Email ou senha inválidos' });

    const token = jwt.sign({ userId: user.id, tenantId: user.tenant_id, tenantSlug: user.tenant_slug, role: user.role, email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        tenant: { id: user.tenant_id, slug: user.tenant_slug, name: user.tenant_name, brand_config: user.brand_config },
    });
});

app.get('/api/auth/me', auth, async (req, res) => {
    const rows = await db`SELECT u.id, u.email, u.name, u.role,
        t.id as tid, t.slug, t.name as tname, t.description, t.segment, t.target_audience,
        t.tone, t.default_cta, t.platforms, t.tags, t.brand_config, t.logo_url,
        t.plan, t.trial_ends_at
        FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE u.id = ${req.user.userId}`;
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });
    const r = rows[0];
    res.json({
        user: { id: r.id, email: r.email, name: r.name, role: r.role },
        tenant: {
            id: r.tid, slug: r.slug, name: r.tname,
            description: r.description, segment: r.segment,
            target_audience: r.target_audience, tone: r.tone,
            default_cta: r.default_cta, platforms: r.platforms,
            tags: r.tags, brand_config: r.brand_config, logo_url: r.logo_url,
            plan: r.plan, trial_ends_at: r.trial_ends_at,
        },
    });
});

/* ─── TENANTS ──────────────────────────────────────────────────────── */
app.get('/api/tenants/:slug', auth, async (req, res) => {
    const rows = await db`SELECT * FROM tenants WHERE slug = ${req.params.slug}`;
    if (!rows.length) return res.status(404).json({ error: 'Workspace não encontrado' });
    const t = rows[0];
    if (t.id !== req.user.tenantId) return res.status(403).json({ error: 'Acesso negado' });
    res.json(t);
});

app.patch('/api/tenants/:slug', auth, async (req, res) => {
    if (req.user.role !== 'owner') return res.status(403).json({ error: 'Apenas o owner pode editar as configurações' });
    const rows = await db`SELECT id FROM tenants WHERE slug = ${req.params.slug}`;
    if (!rows.length || rows[0].id !== req.user.tenantId) return res.status(403).json({ error: 'Acesso negado' });

    const allowed = ['name', 'description', 'segment', 'target_audience', 'tone', 'default_cta', 'platforms', 'tags', 'brand_config', 'logo_url'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nenhum campo para atualizar' });

    const { name, description, segment, target_audience, tone, default_cta, platforms, tags, brand_config, logo_url } = updates;

    await db`UPDATE tenants SET
        name = COALESCE(${name ?? null}, name),
        description = COALESCE(${description ?? null}, description),
        segment = COALESCE(${segment ?? null}, segment),
        target_audience = COALESCE(${target_audience ?? null}, target_audience),
        tone = COALESCE(${tone ?? null}, tone),
        default_cta = COALESCE(${default_cta ?? null}, default_cta),
        platforms = COALESCE(${platforms ? JSON.stringify(platforms) : null}::text[], platforms),
        tags = COALESCE(${tags ? JSON.stringify(tags) : null}::text[], tags),
        brand_config = COALESCE(${brand_config ? JSON.stringify(brand_config) : null}::jsonb, brand_config),
        logo_url = COALESCE(${logo_url ?? null}, logo_url)
    WHERE id = ${req.user.tenantId}`;

    const updated = await db`SELECT * FROM tenants WHERE id = ${req.user.tenantId}`;
    res.json(updated[0]);
});

/* ─── ONBOARDING — save step ───────────────────────────────────────── */
app.post('/api/onboarding/step', auth, async (req, res) => {
    if (req.user.role !== 'owner') return res.status(403).json({ error: 'Apenas o owner pode configurar o workspace' });
    const { name, description, segment, target_audience, tone, default_cta, platforms, tags, brand_config, logo_url } = req.body;

    await db`UPDATE tenants SET
        name = COALESCE(${name ?? null}, name),
        description = COALESCE(${description ?? null}, description),
        segment = COALESCE(${segment ?? null}, segment),
        target_audience = COALESCE(${target_audience ?? null}, target_audience),
        tone = COALESCE(${tone ?? null}, tone),
        default_cta = COALESCE(${default_cta ?? null}, default_cta),
        platforms = COALESCE(${platforms ? JSON.stringify(platforms) : null}::text[], platforms),
        tags = COALESCE(${tags ? JSON.stringify(tags) : null}::text[], tags),
        brand_config = CASE WHEN ${brand_config ? JSON.stringify(brand_config) : null}::jsonb IS NOT NULL
            THEN brand_config || ${brand_config ? JSON.stringify(brand_config) : '{}'}::jsonb
            ELSE brand_config END,
        logo_url = COALESCE(${logo_url ?? null}, logo_url)
    WHERE id = ${req.user.tenantId}`;

    res.json({ ok: true });
});

/* ─── POSTS ────────────────────────────────────────────────────────── */
app.post('/api/posts/generate', auth, async (req, res) => {
    // Check usage limit
    const month = await getMonth();
    const usageRows = await db`SELECT posts_generated FROM usage WHERE tenant_id = ${req.user.tenantId} AND month = ${month}`;
    const used = usageRows[0]?.posts_generated ?? 0;

    const tenantRows = await db`SELECT plan FROM tenants WHERE id = ${req.user.tenantId}`;
    const plan = tenantRows[0]?.plan ?? 'trial';
    const limit = PLANS[plan] ?? 10;

    if (used >= limit) {
        return res.status(429).json({ error: `Limite do plano ${plan} atingido (${limit} gerações/mês). Faça upgrade para continuar.` });
    }

    const { messages, model, max_tokens, temperature, systemPrompt } = req.body;
    const result = await anthropic({ model: model || 'claude-sonnet-4-20250514', max_tokens: max_tokens || 2500, temperature: temperature || 1, system: systemPrompt, messages });

    if (result.error) return res.status(500).json({ error: result.error.message || 'Erro na API da IA' });

    // Increment usage
    await db`INSERT INTO usage (tenant_id, month, posts_generated) VALUES (${req.user.tenantId}, ${month}, 1)
        ON CONFLICT (tenant_id, month) DO UPDATE SET posts_generated = usage.posts_generated + 1`;

    res.json(result);
});

app.post('/api/posts/save', auth, async (req, res) => {
    const { format, framework, topic, slides, caption, hashtags } = req.body;
    const id = randomUUID();
    await db`INSERT INTO posts (id, tenant_id, user_id, format, framework, topic, slides, caption, hashtags)
        VALUES (${id}, ${req.user.tenantId}, ${req.user.userId}, ${format}, ${framework ?? null}, ${topic ?? null},
        ${JSON.stringify(slides)}::jsonb, ${caption ?? null}, ${hashtags ?? null})`;
    res.json({ id });
});

app.get('/api/posts', auth, async (req, res) => {
    const rows = await db`SELECT id, format, framework, topic, caption, hashtags, slides, created_at FROM posts
        WHERE tenant_id = ${req.user.tenantId} ORDER BY created_at DESC LIMIT 20`;
    res.json(rows);
});

/* ─── USAGE ────────────────────────────────────────────────────────── */
app.get('/api/usage', auth, async (req, res) => {
    const month = await getMonth();
    const rows = await db`SELECT posts_generated FROM usage WHERE tenant_id = ${req.user.tenantId} AND month = ${month}`;
    const tenantRows = await db`SELECT plan FROM tenants WHERE id = ${req.user.tenantId}`;
    const plan = tenantRows[0]?.plan ?? 'trial';
    res.json({ used: rows[0]?.posts_generated ?? 0, limit: PLANS[plan] ?? 10, plan });
});

/* ─── PALETTE SUGGESTION ───────────────────────────────────────────── */
app.post('/api/palette/suggest', auth, async (req, res) => {
    const { name, segment, description, tone } = req.body;

    const result = await anthropic({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        temperature: 1,
        messages: [{
            role: 'user',
            content: `Você é um designer de marca especialista. Sugira 3 paletas de cores premium para esta empresa:

Nome: ${name}
Segmento: ${segment}
Descrição: ${description}
Tom: ${tone}

Responda APENAS JSON válido sem markdown:
{"palettes":[{"name":"Nome Criativo","rationale":"Frase curta explicando a escolha","primary":"#hex","accent":"#hex","bgDark":"#hex","bgLight":"#hex"}]}

Regras:
- bgDark deve ser muito escuro (luminosidade < 15%)
- bgLight deve ser claro/branco (luminosidade > 90%)
- primary é a cor principal da marca
- accent é uma cor de destaque complementar
- As 3 paletas devem ser distintas entre si
- Adapte ao segmento e tom`
        }]
    });

    if (result.error) {
        // Fallback palettes by segment
        const fallback = getFallbackPalettes(segment);
        return res.json({ palettes: fallback });
    }

    const txt = result.content?.find(c => c.type === 'text')?.text || '{}';
    try {
        const parsed = JSON.parse(txt.replace(/```json\n?|\n?```/g, '').trim());
        res.json(parsed);
    } catch {
        res.json({ palettes: getFallbackPalettes(segment) });
    }
});

function getFallbackPalettes(segment) {
    const map = {
        'Tecnologia/SaaS': [
            { name: 'Oceano Profundo', rationale: 'Transmite confiança e inovação', primary: '#0057B7', accent: '#4D9AFF', bgDark: '#040C1A', bgLight: '#F4F6F9' },
            { name: 'Índigo Tech', rationale: 'Moderno e sofisticado', primary: '#6366F1', accent: '#A78BFA', bgDark: '#0A0A1A', bgLight: '#F8F7FF' },
            { name: 'Verde Digital', rationale: 'Crescimento e progresso', primary: '#059669', accent: '#34D399', bgDark: '#041A10', bgLight: '#F0FDF4' },
        ],
        'Saúde': [
            { name: 'Azul Clínico', rationale: 'Transmite saúde e confiança', primary: '#0EA5E9', accent: '#38BDF8', bgDark: '#040F1A', bgLight: '#F0F9FF' },
            { name: 'Verde Vitalidade', rationale: 'Frescor e bem-estar', primary: '#16A34A', accent: '#4ADE80', bgDark: '#041A08', bgLight: '#F0FFF4' },
            { name: 'Violeta Moderno', rationale: 'Inovação na medicina', primary: '#7C3AED', accent: '#A78BFA', bgDark: '#0A041A', bgLight: '#FAF5FF' },
        ],
        default: [
            { name: 'Azul Clássico', rationale: 'Confiança e profissionalismo', primary: '#0057B7', accent: '#4D9AFF', bgDark: '#040C1A', bgLight: '#F4F6F9' },
            { name: 'Âmbar Executivo', rationale: 'Energia e resultado', primary: '#D97706', accent: '#FBBF24', bgDark: '#140C02', bgLight: '#FFFBF0' },
            { name: 'Violeta Premium', rationale: 'Sofisticação e criatividade', primary: '#7C3AED', accent: '#A78BFA', bgDark: '#0A041A', bgLight: '#FAF5FF' },
        ],
    };
    return map[segment] || map.default;
}

/* ─── START ────────────────────────────────────────────────────────── */
if (!process.env.VERCEL) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`🔥 API rodando em http://localhost:${port}`));
}

export default app;
