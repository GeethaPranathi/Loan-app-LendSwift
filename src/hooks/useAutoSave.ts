import { useEffect, useRef, useState } from 'react';
import { encryptData, decryptData } from '../utils/encryption';

const STORAGE_KEY = 'lendswift_draft';
const TTL_HOURS = 72;

interface DraftMetadata {
  version: string;
  timestamp: string;
  step: number;
  loanType: string;
}

export const useAutoSave = (formData: any, currentStep: number, interval = 30000) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showToast, setShowToast] = useState(false);

  const saveDraft = async (data: any, step: number) => {
    try {
      const serialized = JSON.stringify(data);
      const encrypted = await encryptData(serialized);
      const metadata: DraftMetadata = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        step,
        loanType: data.loanType || 'personal',
      };
      localStorage.setItem(STORAGE_KEY, encrypted);
      localStorage.setItem(`${STORAGE_KEY}_meta`, JSON.stringify(metadata));
      setLastSaved(new Date());
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.warn('Auto-save failed:', err);
    }
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveDraft(formData, currentStep);
    }, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [formData, currentStep, interval]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_meta`);
  };

  return { lastSaved, showToast, saveDraft, clearDraft };
};

export const loadDraft = async (): Promise<{ data: any; step: number; loanType: string } | null> => {
  try {
    const metaStr = localStorage.getItem(`${STORAGE_KEY}_meta`);
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!metaStr || !encrypted) return null;

    const meta: DraftMetadata = JSON.parse(metaStr);
    const ageHours = (Date.now() - new Date(meta.timestamp).getTime()) / 3600000;
    if (ageHours > TTL_HOURS) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_meta`);
      return null;
    }

    const decrypted = await decryptData(encrypted);
    if (!decrypted) return null;
    const data = JSON.parse(decrypted);
    return { data, step: meta.step, loanType: meta.loanType };
  } catch {
    return null;
  }
};
