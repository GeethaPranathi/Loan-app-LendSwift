import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Clock, AlertCircle } from 'lucide-react';

import Button from './common/Button';
import Step1LoanType from './forms/Step1LoanType';
import Step2PersonalInfo from './forms/Step2PersonalInfo';
import Step3KYC from './forms/Step3KYC';
import Step4Address from './forms/Step4Address';
import Step5Employment from './forms/Step5Employment';
import Step6CoApplicant from './forms/Step6CoApplicant';
import Step7Documents from './forms/Step7Documents';
import Step8Review from './forms/Step8Review';
import { getStepSchema } from '../schemas/formSchemas';
import { useAutoSave, loadDraft } from '../hooks/useAutoSave';

const ALL_STEPS = [
  { label: 'Loan Type', key: 'step1' },
  { label: 'Personal', key: 'step2' },
  { label: 'KYC', key: 'step3' },
  { label: 'Address', key: 'step4' },
  { label: 'Employment', key: 'step5' },
  { label: 'Co-Applicant', key: 'step6' },
  { label: 'Documents', key: 'step7' },
  { label: 'Review', key: 'step8' },
];

interface ResumeModalProps {
  loanType: string;
  onResume: () => void;
  onFresh: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ loanType, onResume, onFresh }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Clock className="text-primary" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Resume Application?</h2>
      <p className="text-slate-500 text-center text-sm mb-8">
        We found a saved <strong>{loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan</strong> application. Would you like to continue where you left off?
      </p>
      <div className="space-y-3">
        <Button onClick={onResume} className="w-full" variant="primary">Resume My Application</Button>
        <Button onClick={onFresh} className="w-full" variant="outline">Start Fresh</Button>
      </div>
    </motion.div>
  </div>
);

const AutoSaveToast: React.FC<{ show: boolean; time: Date | null }> = ({ show, time }) => (
  <AnimatePresence>
    {show && time && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-40 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg"
      >
        <Save size={14} className="text-accent" />
        Draft saved at {time.toLocaleTimeString()}
      </motion.div>
    )}
  </AnimatePresence>
);

const Wizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [resumeModal, setResumeModal] = useState<{ show: boolean; data: any; step: number; loanType: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const methods = useForm({
    mode: 'onBlur',
    resolver: (async (data: any, context: any, options: any) => {
      const actualIndex = getActualStepIndex(currentStep);
      const schema = getStepSchema(actualIndex);
      // @ts-ignore - Bypassing type mismatch in cutting-edge versions
      return zodResolver(schema)(data, context, options);
    }) as any,
    defaultValues: {
      loanType: 'personal',
      amount: 100000,
      tenure: 24,
      loanPurpose: '',
      referralCode: '',
      fullName: '',
      dob: '',
      gender: '',
      maritalStatus: '',
      fatherName: '',
      motherName: '',
      email: '',
      mobile: '',
      panNumber: '',
      aadhaarNumber: '',
      aadhaarConsent: false,
      sameAsPermanent: true,
      currentAddress: { line1: '', line2: '', pin: '', city: '', state: '', residenceType: '', yearsAtAddress: 0 },
      permanentAddress: { line1: '', line2: '', pin: '', city: '', state: '' },
      employment: { type: '', companyName: '', designation: '', monthlyIncome: 0, yearsOfExperience: 0, businessName: '', businessType: '', annualTurnover: 0, yearsInBusiness: 0, gstNumber: '' },
      coApplicant: { name: '', relationship: '', pan: '', income: 0, consent: false },
      documents: {},
      signature: null,
      consents: { accuracy: false, creditCheck: false, terms: false, communications: false },
    },
  });

  const { handleSubmit, trigger, watch, reset } = methods;
  const formValues = watch();
  const loanType = watch('loanType');
  const amount = watch('amount');

  // Check for saved draft on load
  useEffect(() => {
    loadDraft().then((draft) => {
      if (draft) {
        setResumeModal({ show: true, data: draft.data, step: draft.step, loanType: draft.loanType });
      }
    });
  }, []);

  const { lastSaved, showToast, saveDraft, clearDraft } = useAutoSave(formValues, currentStep);

  // Determine active steps (Step 6 is conditional)
  const isCoApplicantRequired = loanType === 'home' || (loanType === 'personal' && amount > 500000) || (loanType === 'business' && amount > 2000000);
  const activeSteps = ALL_STEPS.filter((_s, i) => i !== 5 || isCoApplicantRequired);

  // Map visible step index to actual step index
  const getActualStepIndex = (visibleIndex: number) => {
    return activeSteps[visibleIndex] ? ALL_STEPS.findIndex((s) => s.key === activeSteps[visibleIndex].key) : visibleIndex;
  };
  const actualStepIndex = getActualStepIndex(currentStep);

  const goToStep = useCallback((stepIndex: number) => {
    setDirection(stepIndex > currentStep ? 1 : -1);
    setCurrentStep(stepIndex);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }, [currentStep]);

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      saveDraft(formValues, currentStep + 1);
      goToStep(Math.min(currentStep + 1, activeSteps.length - 1));
    }
  };

  const prevStep = () => goToStep(Math.max(currentStep - 1, 0));

  const onSubmit = (_data: any) => {
    clearDraft();
    setIsSubmitted(true);
  };

  const handleResume = () => {
    if (resumeModal) {
      reset(resumeModal.data);
      setCurrentStep(Math.min(resumeModal.step, activeSteps.length - 1));
      setResumeModal(null);
    }
  };

  const handleFresh = () => {
    clearDraft();
    setResumeModal(null);
  };

  const renderStep = () => {
    switch (actualStepIndex) {
      case 0: return <Step1LoanType />;
      case 1: return <Step2PersonalInfo />;
      case 2: return <Step3KYC />;
      case 3: return <Step4Address />;
      case 4: return <Step5Employment />;
      case 5: return <Step6CoApplicant />;
      case 6: return <Step7Documents />;
      case 7: return <Step8Review onGoToStep={goToStep} />;
      default: return <Step1LoanType />;
    }
  };

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    0: { title: 'Choose Your Loan', subtitle: 'Select the type of loan and basic details.' },
    1: { title: 'Personal Information', subtitle: 'Tell us about yourself.' },
    2: { title: 'Identity Verification (KYC)', subtitle: 'Verify your identity securely.' },
    3: { title: 'Address Details', subtitle: 'Provide your current and permanent address.' },
    4: { title: 'Employment & Income', subtitle: 'Share your professional details for eligibility.' },
    5: { title: 'Co-Applicant Details', subtitle: 'Add a co-applicant to improve eligibility.' },
    6: { title: 'Document Upload', subtitle: 'Upload required documents and sign digitally.' },
    7: { title: 'Review & Submit', subtitle: 'Review your application before final submission.' },
  };

  const info = stepTitles[actualStepIndex] || { title: 'Application', subtitle: '' };

  return (
    <>
      {resumeModal?.show && (
        <ResumeModal loanType={resumeModal.loanType} onResume={handleResume} onFresh={handleFresh} />
      )}
      <AutoSaveToast show={showToast} time={lastSaved} />

      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-sm font-semibold text-slate-500">Step {currentStep + 1} of {activeSteps.length}</span>
            <span className="text-sm font-bold text-primary">{Math.round(((currentStep + 1) / activeSteps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          {/* Step bubbles - scrollable on mobile */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {activeSteps.map((step, i) => (
              <div key={step.key} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => i < currentStep && goToStep(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    i === currentStep
                      ? 'bg-primary text-white shadow-md'
                      : i < currentStep
                      ? 'bg-accent/10 text-accent cursor-pointer hover:bg-accent/20'
                      : 'bg-slate-100 text-slate-400 cursor-default'
                  }`}
                >
                  {i < currentStep ? '✓' : i + 1} {step.label}
                </button>
                {i < activeSteps.length - 1 && <div className={`w-4 h-[2px] mx-1 ${i < currentStep ? 'bg-accent/40' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="glass-card p-6 md:p-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1.5">{info.title}</h2>
                    <p className="text-slate-400 text-sm md:text-base">{info.subtitle}</p>
                  </div>

                  {isSubmitted && actualStepIndex === 7 ? (
                    <SuccessScreen />
                  ) : (
                    renderStep()
                  )}
                </motion.div>
              </AnimatePresence>

              {!isSubmitted && (
                <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {currentStep > 0 && (
                      <Button type="button" variant="outline" onClick={prevStep} leftIcon={<ChevronLeft size={18} />} className="flex-1 md:flex-none">
                        Previous
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => saveDraft(formValues, currentStep)}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary font-semibold transition-colors px-3 py-2"
                    >
                      <Save size={15} /> Save Draft
                    </button>
                  </div>

                  {currentStep < activeSteps.length - 1 ? (
                    <Button type="button" onClick={nextStep} rightIcon={<ChevronRight size={18} />} className="w-full md:w-auto md:min-w-[200px]">
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" variant="accent" className="w-full md:w-auto md:min-w-[200px]" leftIcon={<AlertCircle size={18} />}>
                      Submit Application
                    </Button>
                  )}
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

const SuccessScreen: React.FC = () => {
  const [refNo] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase());
  return (
    <div className="text-center py-10 space-y-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl">🎉</span>
        </div>
      </motion.div>
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
        <p className="text-slate-500">Your application is being processed. We'll contact you within 2-3 business days.</p>
      </div>
      <div className="inline-block bg-primary/5 border border-primary/20 rounded-2xl px-8 py-5">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Application Reference</p>
        <p className="text-3xl font-bold text-primary tracking-widest">LS{refNo}</p>
      </div>
    </div>
  );
};

export default Wizard;
