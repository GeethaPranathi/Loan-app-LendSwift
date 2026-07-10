import { useState } from 'react';

interface VerificationState {
  isVerifying: boolean;
  isVerified: boolean;
  error: string | null;
}

export const useVerification = () => {
  const [state, setState] = useState<VerificationState>({
    isVerifying: false,
    isVerified: false,
    error: null,
  });

  const verify = async (type: 'PAN' | 'Aadhaar', value: string, validator: (v: string) => boolean) => {
    if (!value) return;

    setState({ isVerifying: true, isVerified: false, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (validator(value)) {
      setState({ isVerifying: false, isVerified: true, error: null });
      return true;
    } else {
      setState({ isVerifying: false, isVerified: false, error: `Invalid ${type} format or checksum` });
      return false;
    }
  };

  const reset = () => {
    setState({ isVerifying: false, isVerified: false, error: null });
  };

  return { ...state, verify, reset };
};
