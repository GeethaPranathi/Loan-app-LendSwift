import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';

const businessTypeOptions = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership Firm' },
  { value: 'pvt_ltd', label: 'Private Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'public_ltd', label: 'Public Limited' },
];

const SalariedFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Company Name" placeholder="Your employer" {...register('employment.companyName')} error={(errors.employment as any)?.companyName?.message} />
      <Input label="Designation" placeholder="Your job title" {...register('employment.designation')} error={(errors.employment as any)?.designation?.message} />
      <Input label="Monthly Net Salary (₹)" type="number" placeholder="e.g. 50000" {...register('employment.monthlyIncome', { valueAsNumber: true })} error={(errors.employment as any)?.monthlyIncome?.message} helpText="Minimum ₹15,000" />
      <Input label="Years of Experience" type="number" min={0} max={50} placeholder="e.g. 5" {...register('employment.yearsOfExperience', { valueAsNumber: true })} error={(errors.employment as any)?.yearsOfExperience?.message} />
    </div>
  );
};

const SelfEmployedFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Business / Practice Name" placeholder="e.g. ABC Consultants" {...register('employment.businessName')} error={(errors.employment as any)?.businessName?.message} />
      <Select label="Business Type" options={businessTypeOptions} {...register('employment.businessType')} error={(errors.employment as any)?.businessType?.message} />
      <Input label="Annual Turnover (₹)" type="number" placeholder="e.g. 500000" {...register('employment.annualTurnover', { valueAsNumber: true })} error={(errors.employment as any)?.annualTurnover?.message} helpText="Minimum ₹3,00,000" />
      <Input label="Years in Business" type="number" min={0} max={50} placeholder="e.g. 3" {...register('employment.yearsInBusiness', { valueAsNumber: true })} error={(errors.employment as any)?.yearsInBusiness?.message} helpText="Minimum 2 years" />
      <Input label="Monthly Income (₹)" type="number" placeholder="Average monthly" {...register('employment.monthlyIncome', { valueAsNumber: true })} error={(errors.employment as any)?.monthlyIncome?.message} />
    </div>
  );
};

const BusinessOwnerFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Business Name" placeholder="Registered business name" {...register('employment.businessName')} error={(errors.employment as any)?.businessName?.message} />
      <Select label="Business Type" options={businessTypeOptions} {...register('employment.businessType')} error={(errors.employment as any)?.businessType?.message} />
      <Input label="GST Number" placeholder="22AAAAA0000A1Z5" maxLength={15} className="uppercase tracking-widest" {...register('employment.gstNumber')} error={(errors.employment as any)?.gstNumber?.message} helpText="15-character GST number" />
      <Input label="Annual Turnover (₹)" type="number" placeholder="e.g. 2000000" {...register('employment.annualTurnover', { valueAsNumber: true })} error={(errors.employment as any)?.annualTurnover?.message} />
      <Input label="Years in Business" type="number" min={0} placeholder="e.g. 5" {...register('employment.yearsInBusiness', { valueAsNumber: true })} error={(errors.employment as any)?.yearsInBusiness?.message} />
      <Input label="Monthly Net Income (₹)" type="number" placeholder="After all expenses" {...register('employment.monthlyIncome', { valueAsNumber: true })} error={(errors.employment as any)?.monthlyIncome?.message} />
    </div>
  );
};

const Step5Employment: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  const employmentType = watch('employment.type');
  const loanType = watch('loanType');

  const employmentTypes = [
    { value: 'salaried', label: 'Salaried', disabled: loanType === 'business' },
    { value: 'self_employed', label: 'Self-Employed', disabled: false },
    { value: 'business_owner', label: 'Business Owner', disabled: false },
  ];

  return (
    <div className="space-y-8">
      {loanType === 'business' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800 font-medium">
          ⚠️ Business Loans require Self-Employed or Business Owner employment type.
        </div>
      )}

      <div>
        <label className="label">Employment Type <span className="text-error ml-1">*</span></label>
        <div className="flex flex-wrap gap-4">
          {employmentTypes.map((type) => (
            <label key={type.value} className={`flex items-center gap-2.5 px-5 py-3.5 border-2 rounded-xl cursor-pointer transition-all font-semibold text-sm ${
              type.disabled ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              employmentType === type.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-slate-100 text-slate-600 hover:border-slate-200'
            }`}>
              <input
                type="radio"
                className="sr-only"
                value={type.value}
                {...register('employment.type')}
                disabled={type.disabled}
                onChange={() => {
                  setValue('employment.type', type.value);
                  // Clear previous employment fields on switch
                  setValue('employment.companyName', '');
                  setValue('employment.businessName', '');
                  setValue('employment.monthlyIncome', 0);
                }}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {employmentType === 'salaried' && <SalariedFields />}
      {employmentType === 'self_employed' && <SelfEmployedFields />}
      {employmentType === 'business_owner' && <BusinessOwnerFields />}

      {!employmentType && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-medium">Please select your employment type above</p>
          <p className="text-sm mt-1">Additional fields will appear based on your selection</p>
        </div>
      )}
    </div>
  );
};

export default Step5Employment;
