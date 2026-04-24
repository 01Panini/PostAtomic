import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useUsage() {
    const [usage, setUsage] = useState({ used: 0, limit: 10, plan: 'trial' });

    useEffect(() => {
        api.usage.get().then(setUsage).catch(() => {});
    }, []);

    const refresh = () => api.usage.get().then(setUsage).catch(() => {});

    return { ...usage, refresh };
}
