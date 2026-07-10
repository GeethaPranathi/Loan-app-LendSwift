import React from 'react';
import { useFormContext } from 'react-hook-form';
import RadioGroup from '../common/RadioGroup';
import Input from '../common/Input';
import Select from '../common/Select';
import { User, Home, Briefcase } from 'lucide-react';

const Step1LoanType: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const loanType = watch('loanType');

  const loanTypeOptions = [
    { value: 'personal', label: 'Personal Loan', icon: <User size={32} />, description: 'Up to ₹10 Lakh' },
    { value: 'home', label: 'Home Loan', icon: <Home size={32} />, description: 'Up to ₹1 Crore' },
    { value: 'business', label: 'Business Loan', icon: <Briefcase size={32} />, description: 'Up to ₹50 Lakh' },
  ];

  const purposeOptions = {
    personal: [
      { value: 'medical', label: 'Medical Expenses' },
      { value: 'education', label: 'Education' },
      { value: 'wedding', label: 'Wedding' },
      { value: 'travel', label: 'Travel' },
      { value: 'other', label: 'Other' },
    ],
    home: [
      { value: 'purchase', label: 'Property Purchase' },
      { value: 'renovation', label: 'Home Renovation' },
      { value: 'construction', label: 'Construction' },
    ],
    business: [
      { value: 'working_capital', label: 'Working Capital' },
      { value: 'expansion', label: 'Business Expansion' },
      { value: 'equipment', label: 'Equipment Purchase' },
    ],
  };

  const getTenureOptions = () => {
    if (loanType === 'home') {
      return Array.from({ length: 26 }, (_, i) => ({ value: String((i + 5) * 12), label: `${i + 5} Years` }));
    }
    return Array.from({ length: 5 }, (_, i) => ({ value: String((i + 1) * 12), label: `${i + 1} Year${i > 0 ? 's' : ''}` }));
  };

  return (
    <div className="space-y-8">
      <RadioGroup
        label="Select Loan Type"
        name="loanType"
        options={loanTypeOptions}
        value={loanType}
        onChange={(e) => setValue('loanType', e.target.value)}
        error={errors.loanType?.message as string}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Loan Amount (₹)"
          type="number"
          placeholder="Enter amount"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message as string}
        />
        
        <Select
          label="Loan Tenure"
          options={getTenureOptions()}
          {...register('tenure', { valueAsNumber: true })}
          error={errors.tenure?.message as string}
        />

        <Select
          label="Loan Purpose"
          options={purposeOptions[loanType as keyof typeof purposeOptions] || []}
          {...register('loanPurpose')}
          error={errors.loanPurpose?.message as string}
        />

        <Input
          label="Referral Code (Optional)"
          placeholder="Enter code if any"
          {...register('referralCode')}
          error={errors.referralCode?.message as string}
        />
      </div>
    </div>
  );
};

export default Step1LoanType;
