import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';

const Step2PersonalInfo: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const gender = watch('gender');

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name (as per PAN)"
          placeholder="e.g. JOHN DOE"
          {...register('fullName')}
          error={errors.fullName?.message as string}
        />
        <Input
          label="Date of Birth"
          type="date"
          {...register('dob')}
          error={errors.dob?.message as string}
          helpText="Age must be 21-65 years"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="flex flex-col w-full">
          <label className="label">Gender <span className="text-error ml-1">*</span></label>
          <div className="flex gap-4">
            {genderOptions.map(opt => (
              <label key={opt.value} className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                gender === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}>
                <input type="radio" className="sr-only" {...register('gender')} value={opt.value} />
                <span className="text-sm font-semibold">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="error-text">{errors.gender.message as string}</p>}
        </div>

        <Select
          label="Marital Status"
          options={maritalStatusOptions}
          {...register('maritalStatus')}
          error={errors.maritalStatus?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Father's Name"
          placeholder="Full name"
          {...register('fatherName')}
          error={errors.fatherName?.message as string}
        />
        <Input
          label="Mother's Name"
          placeholder="Full name"
          {...register('motherName')}
          error={errors.motherName?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          error={errors.email?.message as string}
        />
        <Input
          label="Mobile Number"
          type="tel"
          placeholder="10-digit number"
          {...register('mobile')}
          error={errors.mobile?.message as string}
          helpText="Starts with 6-9"
        />
      </div>
    </div>
  );
};

export default Step2PersonalInfo;
