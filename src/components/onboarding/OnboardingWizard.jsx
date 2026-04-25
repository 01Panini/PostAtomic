import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { useMobile } from '../../hooks/useMobile';
import Step1Identity from './steps/Step1Identity';
import Step2Audience from './steps/Step2Audience';
import Step3Tags from './steps/Step3Tags';
import Step4Visual from './steps/Step4Visual';
import Step5Modules from './steps/Step5Modules';
import Step6Preview from './steps/Step6Preview';

const STEPS = ['Identidade', 'Público', 'Conteúdo', 'Visual', 'Módulos', 'Preview'];

function AtomMark({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#0CC981" strokeWidth="1.5" />
            <ellipse cx="14" cy="14" rx="9" ry="3.5" stroke="white" strokeWidth="1.2" fill="none" />
            <ellipse cx="14" cy="14" rx="9" ry="3.5" stroke="white" strokeWidth="1.2" fill="none" transform="rotate(60 14 14)" />
            <ellipse cx="14" cy="14" rx="9" ry="3.5" stroke="white" strokeWidth="1.2" fill="none" transform="rotate(120 14 14)" />
            <circle cx="14" cy="14" r="2" fill="#0CC981" />
        </svg>
    );
}

export default function OnboardingWizard() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({});
    const [saving, setSaving] = useState(false);
    const { tenant, refreshTenant } = useAuth();
    const navigate = useNavigate();

    const save = async (stepData) => {
        setSaving(true);
        const merged = { ...data, ...stepData };
        setData(merged);
        try { await api.onboarding.saveStep(stepData); }
        catch { /* non-blocking */ }
        setSaving(false);
        return merged;
    };

    const next = async (stepData) => {
        const merged = await save(stepData);
        if (step < STEPS.length - 1) setStep(step + 1);
        return merged;
    };

    const finish = async () => {
        await refreshTenant();
        navigate('/workspace', { replace: true });
    };

    const isMobile = useMobile();
    const progress = (step / (STEPS.length - 1)) * 100;
    const stepProps = { data, onNext: next, onBack: () => setStep(s => s - 1), saving };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

            {/* Progress bar + nav */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
                {/* Thin progress bar */}
                <div style={{ height: 2, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#0CC981', transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)', borderRadius: 99 }} />
                </div>

                {/* Nav bar */}
                <div style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AtomMark size={22} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>PostAtomic</span>
                    </div>

                    {/* Step indicators */}
                    {isMobile ? (
                        /* Mobile: compact dots */
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {STEPS.map((_, i) => (
                                <div key={i} style={{
                                    borderRadius: 99, transition: 'all 0.3s',
                                    width: i === step ? 18 : 6, height: 6,
                                    background: i < step ? '#0CC981' : i === step ? '#0CC981' : 'rgba(255,255,255,0.15)',
                                }} />
                            ))}
                        </div>
                    ) : (
                        /* Desktop: labeled steps */
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {STEPS.map((label, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 700,
                                        background: i < step ? '#0CC981' : i === step ? 'rgba(12,201,129,0.12)' : 'rgba(255,255,255,0.04)',
                                        color: i < step ? '#050505' : i === step ? '#0CC981' : '#616161',
                                        border: i === step ? '1px solid rgba(12,201,129,0.4)' : '1px solid transparent',
                                        transition: 'all 0.3s',
                                    }}>
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 500, color: i === step ? '#FFFFFF' : '#616161' }}>{label}</span>
                                    {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.08)' }} />}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ fontSize: 11, color: '#616161', fontWeight: 600 }}>{step + 1} / {STEPS.length}</div>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: isMobile ? 80 : 100, paddingBottom: isMobile ? 40 : 48, paddingLeft: 16, paddingRight: 16 }}>
                <div style={{ width: '100%', maxWidth: 600, animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
                    {step === 0 && <Step1Identity {...stepProps} />}
                    {step === 1 && <Step2Audience {...stepProps} />}
                    {step === 2 && <Step3Tags {...stepProps} />}
                    {step === 3 && <Step4Visual {...stepProps} />}
                    {step === 4 && <Step5Modules {...stepProps} />}
                    {step === 5 && <Step6Preview {...stepProps} onFinish={finish} />}
                </div>
            </div>
        </div>
    );
}
