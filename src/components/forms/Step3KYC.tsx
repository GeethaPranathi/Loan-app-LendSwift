import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import { useVerification } from '../../hooks/useVerification';
import { validatePAN, validateAadhaar } from '../../utils/validators';
import { CheckCircle, Loader2, XCircle, ShieldCheck } from 'lucide-react';

const VerificationBadge = ({ isVerifying, isVerified, error }: { isVerifying: boolean; isVerified: boolean; error: string | null }) => {
  if (isVerifying) return <div className="flex items-center gap-1.5 text-warning text-xs font-semibold"><Loader2 size={14} className="animate-spin" /> Verifying...</div>;
  if (isVerified) return <div className="flex items-center gap-1.5 text-accent text-xs font-semibold"><CheckCircle size={14} /> Verified</div>;
  if (error) return <div className="flex items-center gap-1.5 text-error text-xs font-semibold"><XCircle size={14} /> {error}</div>;
  return null;
};

const Step3KYC: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  const [panValue, setPanValue] = useState('');
  const [aadhaarValue, setAadhaarValue] = useState('');
  const panVerify = useVerification();
  const aadhaarVerify = useVerification();

  const handlePanBlur = (val: string) => {
    const upper = val.toUpperCase();
    if (upper.length === 10) {
      panVerify.verify('PAN', upper, (v) => validatePAN(v, ['P', 'C', 'F']));
    }
  };

  const handleAadhaarBlur = (val: string) => {
    if (val.length === 12) {
      aadhaarVerify.verify('Aadhaar', val, validateAadhaar);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="text-primary mt-0.5 shrink-0" size={20} />
        <div>
          <p className="text-sm font-semibold text-primary mb-1">Secure Identity Verification</p>
          <p className="text-xs text-slate-500">Your documents are encrypted and stored securely as per RBI Data Localisation guidelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PAN */}
        <div className="space-y-2">
          <Input
            label="PAN Number"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            {...register('panNumber')}
            onChange={(e) => { setPanValue(e.target.value.toUpperCase()); panVerify.reset(); }}
            value={panValue}
            error={errors.panNumber?.message as string}
            helpText="Format: 5 letters + 4 digits + 1 letter"
            className="tracking-widest uppercase"
            onBlur={() => handlePanBlur(panValue)}
          />
          <VerificationBadge {...panVerify} />
        </div>

        {/* Aadhaar */}
        <div className="space-y-2">
          <Input
            label="Aadhaar Number"
            placeholder="12-digit Aadhaar"
            maxLength={12}
            type="tel"
            {...register('aadhaarNumber')}
            onChange={(e) => { setAadhaarValue(e.target.value.replace(/\D/g, '')); aadhaarVerify.reset(); }}
            value={aadhaarValue}
            error={errors.aadhaarNumber?.message as string}
            helpText="Last 4 digits will be masked after verification"
            onBlur={() => handleAadhaarBlur(aadhaarValue)}
          />
          <VerificationBadge {...aadhaarVerify} />
        </div>
      </div>

      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
        <Checkbox
          label={
            <span>
              I voluntarily give my consent to use my Aadhaar details for the purpose of KYC verification as per <strong>UIDAI regulations</strong>.
              I understand this is not mandatory and I may use other valid documents.
            </span>
          }
          {...register('aadhaarConsent')}
          error={errors.aadhaarConsent?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Voter ID (Optional)"
          placeholder="ABC1234567"
          {...register('voterId')}
          error={errors.voterId?.message as string}
        />
        <Input
          label="Passport Number (Optional)"
          placeholder="A1234567"
          {...register('passportNumber')}
          error={errors.passportNumber?.message as string}
        />
      </div>
    </div>
  );
};

export default Step3KYC;
