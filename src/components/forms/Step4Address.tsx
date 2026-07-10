import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import { usePinCodeLookup } from '../../hooks/usePinCodeLookup';
import { MapPin, Loader2 } from 'lucide-react';

const residenceOptions = [
  { value: 'owned', label: 'Owned' },
  { value: 'rented', label: 'Rented' },
  { value: 'company', label: 'Company Provided' },
  { value: 'family', label: 'Family Owned' },
];

const AddressFields: React.FC<{ prefix: string; title: string }> = ({ prefix, title }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const { lookup, data, isLoading, error: pinError } = usePinCodeLookup();
  const pin = watch(`${prefix}.pin`);
  const residenceType = watch(`${prefix}.residenceType`);

  useEffect(() => {
    if (pin?.length === 6) {
      lookup(pin).then((result) => {
        if (result) {
          setValue(`${prefix}.city`, result.city);
          setValue(`${prefix}.state`, result.state);
        }
      });
    }
  }, [pin]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">{title}</h3>
      
      <Input
        label="Address Line 1"
        placeholder="House/Flat No., Street Name"
        {...register(`${prefix}.line1`)}
        error={(errors[prefix] as any)?.line1?.message}
      />
      <Input
        label="Address Line 2 (Optional)"
        placeholder="Landmark, Area"
        {...register(`${prefix}.line2`)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Input
              label="PIN Code"
              type="tel"
              maxLength={6}
              placeholder="6-digit PIN"
              {...register(`${prefix}.pin`)}
              error={(errors[prefix] as any)?.pin?.message}
            />
          </div>
          {isLoading && <div className="flex items-center gap-1.5 text-xs text-primary font-medium"><Loader2 size={12} className="animate-spin" /> Looking up...</div>}
          {pinError && <div className="text-xs text-warning font-medium">{pinError}</div>}
          {data && <div className="flex items-center gap-1 text-xs text-accent font-medium"><MapPin size={12} /> Found!</div>}
        </div>
        <Input
          label="City"
          placeholder="Auto-filled"
          {...register(`${prefix}.city`)}
          error={(errors[prefix] as any)?.city?.message}
        />
        <Input
          label="State"
          placeholder="Auto-filled"
          {...register(`${prefix}.state`)}
          error={(errors[prefix] as any)?.state?.message}
        />
      </div>

      {prefix === 'currentAddress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Residence Type"
            options={residenceOptions}
            {...register(`${prefix}.residenceType`)}
            error={(errors[prefix] as any)?.residenceType?.message}
          />
          {residenceType === 'rented' && (
            <Input
              label="Monthly Rent (₹)"
              type="number"
              placeholder="e.g. 15000"
              {...register(`${prefix}.rentAmount`, { valueAsNumber: true })}
              error={(errors[prefix] as any)?.rentAmount?.message}
            />
          )}
          <Input
            label="Years at Current Address"
            type="number"
            min={0}
            max={50}
            placeholder="0"
            {...register(`${prefix}.yearsAtAddress`, { valueAsNumber: true })}
            error={(errors[prefix] as any)?.yearsAtAddress?.message}
          />
        </div>
      )}
    </div>
  );
};

const Step4Address: React.FC = () => {
  const { register, watch } = useFormContext();
  const sameAsCurrent = watch('sameAsPermanent');

  return (
    <div className="space-y-10">
      <AddressFields prefix="currentAddress" title="Current Residential Address" />

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <Checkbox
          label="Permanent address is same as current address"
          {...register('sameAsPermanent')}
        />
      </div>

      {!sameAsCurrent && (
        <AddressFields prefix="permanentAddress" title="Permanent Address" />
      )}
    </div>
  );
};

export default Step4Address;
