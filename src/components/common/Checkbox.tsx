import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, containerClassName, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className={cn('flex flex-col w-full', containerClassName)}>
        <label htmlFor={checkboxId} className="group flex items-start gap-3 cursor-pointer">
          <div className="relative flex items-center">
            <input
              id={checkboxId}
              type="checkbox"
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div className={cn(
              'w-6 h-6 rounded-lg border-2 border-slate-200 transition-all duration-300 flex items-center justify-center',
              'peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-4 peer-focus:ring-primary/10',
              'group-hover:border-slate-300 peer-checked:group-hover:border-primary-dark',
              error && 'border-error'
            )}>
              <Check className="text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" size={16} strokeWidth={4} />
            </div>
          </div>
          <div className="text-sm text-slate-600 font-medium leading-6 select-none">
            {label}
          </div>
        </label>
        {error && (
          <p className="error-text" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
