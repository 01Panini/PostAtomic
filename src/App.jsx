import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { BrandProvider } from './contexts/BrandContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkspacePage from './pages/WorkspacePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import PostMachine from './components/post-machine/PostMachine';
import OnboardingWizard from './components/onboarding/OnboardingWizard';

function Spinner() {
    return (
        <div className="min-h-screen bg-base flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue/20 border-t-blue rounded-full animate-spin" />
        </div>
    );
}

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/auth" replace />;
    return children;
}

function RequireOnboarding({ children }) {
    const { tenant, loading } = useAuth();
    if (loading) return <Spinner />;
    // If tenant exists but has no modules configured → send to onboarding
    if (tenant && !tenant.brand_config?.modules?.length) {
        return <Navigate to="/onboarding" replace />;
    }
    return children;
}

function RedirectIfAuth({ children }) {
    const { user, loading, tenant } = useAuth();
    if (loading) return <Spinner />;
    if (user) {
        if (!tenant?.brand_config?.modules?.length) return <Navigate to="/onboarding" replace />;
        return <Navigate to="/workspace" replace />;
    }
    return children;
}

export default function App() {
    return (
        <BrandProvider>
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={
                    <RedirectIfAuth>
                        <AuthPage />
                    </RedirectIfAuth>
                } />

                {/* Onboarding — requires auth, but doesn't require brand config */}
                <Route path="/onboarding" element={
                    <RequireAuth>
                        <OnboardingWizard />
                    </RequireAuth>
                } />

                {/* Workspace — requires auth + completed onboarding */}
                <Route path="/workspace" element={
                    <RequireAuth>
                        <RequireOnboarding>
                            <WorkspacePage />
                        </RequireOnboarding>
                    </RequireAuth>
                }>
                    <Route index element={<PostMachine />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrandProvider>
    );
}
