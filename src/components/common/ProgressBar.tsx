import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-4 px-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isActive
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10'
                    : isCompleted
                    ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`hidden md:block absolute top-10 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
        {/* Connection Line */}
        <div className="absolute left-0 right-0 h-[2px] bg-slate-100 -translate-y-[1.4rem] -z-0 mx-8 md:mx-16" />
        <motion.div
          className="absolute left-0 h-[2px] bg-primary -translate-y-[1.4rem] -z-0 mx-8 md:mx-16 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: 'calc(100% - 4rem)' }}
          // Note: The width calculation above is a bit tricky with fixed margins. 
          // For a robust progress bar, I'll use a slightly different approach if needed.
        />
      </div>
    </div>
  );
};

export default ProgressBar;
