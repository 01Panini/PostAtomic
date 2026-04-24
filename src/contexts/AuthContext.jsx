import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('pm_token');
        if (!token) { setLoading(false); return; }
        api.auth.me()
            .then(({ user, tenant }) => { setUser(user); setTenant(tenant); })
            .catch(() => localStorage.removeItem('pm_token'))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const data = await api.auth.login({ email, password });
        localStorage.setItem('pm_token', data.token);
        setUser(data.user);
        setTenant(data.tenant);
        return data;
    };

    const signup = async (email, password, name, companyName) => {
        const data = await api.auth.signup({ email, password, name, companyName });
        localStorage.setItem('pm_token', data.token);
        setUser(data.user);
        setTenant(data.tenant);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('pm_token');
        setUser(null);
        setTenant(null);
    };

    const refreshTenant = async () => {
        const data = await api.auth.me();
        setTenant(data.tenant);
        return data.tenant;
    };

    const updateTenant = (partial) => setTenant((t) => ({ ...t, ...partial }));

    return (
        <AuthContext.Provider value={{ user, tenant, loading, login, signup, logout, refreshTenant, updateTenant }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
