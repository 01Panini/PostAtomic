import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useUsage() {
    const [usage, setUsage] = useState({
        used: 0,
        limit: 100,
        plan: 'trial',
        dailyUsed: 0,
        dailyLimit: 3,
    });

    const load = () => api.usage.get().then(setUsage).catch(() => {});

    useEffect(() => { load(); }, []);

    return { ...usage, refresh: load };
}
