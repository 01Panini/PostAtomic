const BASE = '/api';

function token() {
    return localStorage.getItem('pm_token');
}

async function req(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
            ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
    return data;
}

export const api = {
    auth: {
        signup: (body) => req('/auth/signup', { method: 'POST', body }),
        login: (body) => req('/auth/login', { method: 'POST', body }),
        me: () => req('/auth/me'),
    },
    tenants: {
        get: (slug) => req(`/tenants/${slug}`),
        update: (slug, body) => req(`/tenants/${slug}`, { method: 'PATCH', body }),
    },
    onboarding: {
        saveStep: (body) => req('/onboarding/step', { method: 'POST', body }),
    },
    posts: {
        generate: (body) => req('/posts/generate', { method: 'POST', body }),
        save: (body) => req('/posts/save', { method: 'POST', body }),
        list: () => req('/posts'),
    },
    usage: {
        get: () => req('/usage'),
    },
    palette: {
        suggest: (body) => req('/palette/suggest', { method: 'POST', body }),
    },
};
