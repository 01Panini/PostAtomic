import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import Step1Identity from './steps/Step1Identity';
import Step2Audience from './steps/Step2Audience';
import Step3Tags from './steps/Step3Tags';
import Step4Visual from './steps/Step4Visual';
import Step5Modules from './steps/Step5Modules';
import Step6Preview from './steps/Step6Preview';

const STEPS = ['Identidade', 'Público', 'Conteúdo', 'Visual', 'Módulos', 'Preview'];

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

    const progress = ((step) / (STEPS.length - 1)) * 100;

    const stepProps = { data, onNext: next, onBack: () => setStep(s => s - 1), saving };

    return (
        <div className="min-h-screen bg-base text-text-1 font-sans flex flex-col">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="h-0.5 bg-[#0D1325]">
                    <div className="h-full bg-gradient-to-r from-blue to-blue-light transition-all duration-500"
                        style={{ width: `${progress}%` }} />
                </div>
                <div className="bg-surface/90 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center shadow-[0_0_16px_rgba(0,87,183,.5)]">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth={2} />
                                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth={2} />
                            </svg>
                        </div>
                        <span className="text-sm font-bold">Post Machine</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {STEPS.map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all
                                    ${i < step ? 'bg-blue text-white' : i === step ? 'bg-blue/20 border border-blue text-blue-light' : 'bg-white/[.04] text-text-3 border border-[#162035]'}`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs font-semibold hidden md:block ${i === step ? 'text-text-1' : 'text-text-3'}`}>{label}</span>
                                {i < STEPS.length - 1 && <div className="w-6 h-px bg-[#162035] hidden md:block" />}
                            </div>
                        ))}
                    </div>
                    <div className="text-xs text-text-3 font-bold">{step + 1} / {STEPS.length}</div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-start justify-center pt-28 pb-12 px-4">
                <div className="w-full max-w-2xl animate-fade-up">
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
