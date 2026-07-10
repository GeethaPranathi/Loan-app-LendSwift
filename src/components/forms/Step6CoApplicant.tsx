import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import { useVerification } from '../../hooks/useVerification';
import { validatePAN } from '../../utils/validators';
import { CheckCircle, Loader2, XCircle, Users } from 'lucide-react';

const relationshipOptions = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'business_partner', label: 'Business Partner' },
];

const Step6CoApplicant: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const [coPanValue, setCoPanValue] = useState('');
  const coPanVerify = useVerification();
  const loanType = watch('loanType');
  const amount = watch('amount');

  const isRequired =
    loanType === 'home' ||
    (loanType === 'personal' && amount > 500000) ||
    (loanType === 'business' && amount > 2000000);

  return (
    <div className="space-y-8">
      <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 ${isRequired ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
        <Users className={isRequired ? 'text-amber-600' : 'text-slate-400'} size={24} />
        <div>
          <p className={`font-bold ${isRequired ? 'text-amber-800' : 'text-slate-600'}`}>
            {isRequired ? 'Co-Applicant Required' : 'Co-Applicant (Optional)'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {loanType === 'home'
              ? 'Home loans require a co-applicant.'
              : amount > 500000
              ? 'Loan amount exceeds ₹5,00,000. A co-applicant is required.'
              : 'Adding a co-applicant can improve loan eligibility.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Co-Applicant Full Name"
          placeholder="Full name as per PAN"
          {...register('coApplicant.name')}
          error={(errors.coApplicant as any)?.name?.message}
        />
        <Select
          label="Relationship with Primary Applicant"
          options={relationshipOptions}
          {...register('coApplicant.relationship')}
          error={(errors.coApplicant as any)?.relationship?.message}
        />
        <div className="space-y-2">
          <Input
            label="Co-Applicant PAN Number"
            placeholder="ABCDE1234F"
            maxLength={10}
            value={coPanValue}
            onChange={(e) => { setCoPanValue(e.target.value.toUpperCase()); coPanVerify.reset(); }}
            onBlur={() => {
              if (coPanValue.length === 10) {
                coPanVerify.verify('PAN', coPanValue, (v) => validatePAN(v, ['P', 'C', 'F']));
              }
            }}
            className="tracking-widest uppercase"
            error={(errors.coApplicant as any)?.pan?.message}
          />
          {coPanVerify.isVerifying && <p className="text-xs text-warning flex items-center gap-1 font-medium"><Loader2 size={12} className="animate-spin" />Verifying...</p>}
          {coPanVerify.isVerified && <p className="text-xs text-accent flex items-center gap-1 font-medium"><CheckCircle size={12} />Verified</p>}
          {coPanVerify.error && <p className="text-xs text-error flex items-center gap-1 font-medium"><XCircle size={12} />{coPanVerify.error}</p>}
        </div>
        <Input
          label="Co-Applicant Monthly Income (₹)"
          type="number"
          placeholder="e.g. 40000"
          {...register('coApplicant.income', { valueAsNumber: true })}
          error={(errors.coApplicant as any)?.income?.message}
          helpText="Combined income improves eligibility"
        />
      </div>

      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
        <Checkbox
          label="I, the co-applicant, hereby consent to share my personal and financial information with LendSwift for the purpose of this loan application. I understand my credit history may be checked."
          {...register('coApplicant.consent')}
          error={(errors.coApplicant as any)?.consent?.message}
        />
      </div>
    </div>
  );
};

export default Step6CoApplicant;
