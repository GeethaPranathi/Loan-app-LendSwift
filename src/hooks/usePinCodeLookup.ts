import { useState, useCallback } from 'react';
import pinCodeData from '../data/pinCodeData';

interface PinCodeResult {
  city: string;
  state: string;
  postOffice: string;
}

interface PinCodeState {
  data: PinCodeResult | null;
  isLoading: boolean;
  error: string | null;
}

export const usePinCodeLookup = () => {
  const [state, setState] = useState<PinCodeState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const lookup = useCallback(async (pin: string) => {
    if (pin.length !== 6) return;
    setState({ data: null, isLoading: true, error: null });

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const result = pinCodeData[pin];
    if (result) {
      setState({ data: result, isLoading: false, error: null });
      return result;
    } else {
      setState({ data: null, isLoading: false, error: 'PIN code not found. Please enter manually.' });
      return null;
    }
  }, []);

  const reset = () => setState({ data: null, isLoading: false, error: null });

  return { ...state, lookup, reset };
};
