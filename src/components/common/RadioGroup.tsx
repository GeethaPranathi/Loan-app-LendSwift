import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string; icon?: React.ReactNode; description?: string }[];
  containerClassName?: string;
  value?: string;
}

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ label, error, options, className, containerClassName, name, value, onChange, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col w-full', containerClassName)}>
        {label && (
          <label className="label">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((opt) => {
            const isChecked = value === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  'relative flex flex-col items-center justify-center p-6 cursor-pointer border-2 rounded-2xl transition-all duration-300 group',
                  isChecked
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                )}
              >
                <input
                  type="radio"
                  ref={ref}
                  name={name}
                  value={opt.value}
                  checked={isChecked}
                  onChange={onChange}
                  className="sr-only"
                  {...props}
                />
                {opt.icon && (
                  <div className={cn(
                    'mb-3 transition-colors duration-300',
                    isChecked ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                  )}>
                    {opt.icon}
                  </div>
                )}
                <span className={cn(
                  'text-sm font-bold transition-colors duration-300 text-center',
                  isChecked ? 'text-primary' : 'text-slate-700'
                )}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[10px] text-slate-400 mt-1 text-center font-medium uppercase tracking-wider">
                    {opt.description}
                  </span>
                )}
                {isChecked && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
        {error && (
          <p className="error-text" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
