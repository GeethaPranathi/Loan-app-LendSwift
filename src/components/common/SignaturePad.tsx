import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Pen, Trash2 } from 'lucide-react';

interface SignaturePadProps {
  onChange?: (dataUrl: string | null) => void;
  value?: string | null;
  error?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onChange, value, error }) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      onChange?.(sigRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    sigRef.current?.clear();
    onChange?.(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label mb-0 flex items-center gap-2">
          <Pen size={16} className="text-primary" />
          E-Signature <span className="text-error ml-1">*</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-error border border-slate-200 hover:border-error/30 rounded-lg transition-all"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>
      </div>

      <div ref={containerRef} className={`border-2 rounded-2xl overflow-hidden bg-white relative ${error ? 'border-error' : 'border-slate-200 hover:border-primary/50'}`}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-slate-100 text-4xl font-light select-none">Sign here</span>
        </div>
        <SignatureCanvas
          ref={sigRef}
          penColor="#1F4E79"
          canvasProps={{
            width: 600,
            height: 200,
            className: 'w-full touch-none',
            style: { touchAction: 'none' },
          }}
          onEnd={handleEnd}
        />
      </div>

      {value && (
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-2 text-accent text-sm font-semibold">
          ✓ Signature captured
        </div>
      )}

      {error && (
        <p className="error-text" role="alert" aria-live="polite">{error}</p>
      )}

      <p className="text-xs text-slate-400">
        By signing above, you agree this constitutes a legally valid electronic signature as per the IT Act, 2000 (Section 3A).
      </p>
    </div>
  );
};

export default SignaturePad;
