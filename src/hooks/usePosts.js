import { useState, useCallback } from 'react';
import { api } from '../lib/api';

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try { setPosts(await api.posts.list()); }
        catch { /* silent */ }
        finally { setLoading(false); }
    }, []);

    const save = useCallback(async (data) => {
        try { await api.posts.save(data); }
        catch { /* silent — don't block UX */ }
    }, []);

    return { posts, loading, load, save };
}
