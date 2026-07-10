import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, containerClassName, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={cn('flex flex-col w-full', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'input-field',
            error && 'border-error focus:border-error focus:ring-error/10',
            className
          )}
          {...props}
        />
        {helpText && !error && (
          <p className="text-xs text-slate-500 mt-1.5 ml-1">{helpText}</p>
        )}
        {error && (
          <p className="error-text" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
