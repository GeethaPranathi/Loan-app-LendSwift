import React from 'react';
import { useFormContext } from 'react-hook-form';
import Checkbox from '../common/Checkbox';
import { calculateEMI, calculateTotalCost, calculateProcessingFee, formatIndianCurrency, getInterestRate } from '../../utils/emiCalculator';
import { Edit2, TrendingUp, CreditCard, Calendar, IndianRupee } from 'lucide-react';

interface SectionCardProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, onEdit, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
      <button type="button" onClick={onEdit} className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
        <Edit2 size={12} /> Edit
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
      {children}
    </div>
  </div>
);

const DataRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <div>
    <span className="text-xs text-slate-400 font-medium block">{label}</span>
    <span className="text-slate-800 font-semibold">{value || '—'}</span>
  </div>
);

interface Step8ReviewProps {
  onGoToStep?: (step: number) => void;
}

const Step8Review: React.FC<Step8ReviewProps> = ({ onGoToStep }) => {
  const { watch, register, formState: { errors } } = useFormContext();

  const allValues = watch();
  const { loanType = 'personal', amount = 0, tenure = 12, loanPurpose, fullName, email, mobile, panNumber, employment, currentAddress, coApplicant, signature } = allValues;

  const emi = calculateEMI(amount, loanType, tenure);
  const totalCost = calculateTotalCost(emi, tenure, amount);
  const processingFee = calculateProcessingFee(amount);
  const rate = getInterestRate(loanType);
  const monthlyIncome = employment?.monthlyIncome || 0;
  const coIncome = coApplicant?.income || 0;
  const totalIncome = monthlyIncome + coIncome;
  const emiRatio = totalIncome > 0 ? (emi / totalIncome) * 100 : 0;

  const loanTypeLabels: Record<string, string> = { personal: 'Personal Loan', home: 'Home Loan', business: 'Business Loan' };
  const loanTypeLabel = loanTypeLabels[loanType] || loanType;

  return (
    <div className="space-y-6">
      {/* Pre-Approval Summary */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Pre-Approval Summary</p>
            <h3 className="text-2xl font-bold">{loanTypeLabel}</h3>
          </div>
          <TrendingUp size={36} className="text-white/30" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/60 text-xs mb-1 flex items-center gap-1"><IndianRupee size={10} /> Loan Amount</p>
            <p className="text-lg font-bold">{formatIndianCurrency(amount)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/60 text-xs mb-1 flex items-center gap-1"><Calendar size={10} /> Monthly EMI</p>
            <p className="text-lg font-bold">{formatIndianCurrency(emi)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/60 text-xs mb-1">Interest Rate</p>
            <p className="text-lg font-bold">{rate}% p.a.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/60 text-xs mb-1"><CreditCard size={10} className="inline" /> Processing Fee</p>
            <p className="text-lg font-bold">{formatIndianCurrency(processingFee)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <p className="text-white/60 text-xs">Tenure</p>
            <p className="font-semibold">{tenure} months ({Math.round(tenure / 12 * 10) / 10} yrs)</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Total Cost of Borrowing</p>
            <p className="font-semibold">{formatIndianCurrency(totalCost)}</p>
          </div>
        </div>

        {emiRatio > 50 && (
          <div className="bg-warning/20 border border-warning/30 rounded-xl p-3 text-sm font-medium text-yellow-100">
            ⚠️ Your EMI ({emiRatio.toFixed(0)}% of income) exceeds the recommended 50% threshold. You may still apply, but approval is subject to credit assessment.
          </div>
        )}
      </div>

      {/* Application Details */}
      <SectionCard title="Loan Details" onEdit={() => onGoToStep?.(0)}>
        <DataRow label="Loan Type" value={loanTypeLabel} />
        <DataRow label="Amount" value={formatIndianCurrency(amount)} />
        <DataRow label="Purpose" value={loanPurpose} />
        <DataRow label="Tenure" value={`${tenure} months`} />
      </SectionCard>

      <SectionCard title="Personal Information" onEdit={() => onGoToStep?.(1)}>
        <DataRow label="Full Name" value={fullName} />
        <DataRow label="Email" value={email} />
        <DataRow label="Mobile" value={mobile} />
      </SectionCard>

      <SectionCard title="KYC Details" onEdit={() => onGoToStep?.(2)}>
        <DataRow label="PAN" value={panNumber ? `${panNumber.slice(0, 6)}****` : '—'} />
        <DataRow label="Aadhaar" value="****-****-****" />
      </SectionCard>

      <SectionCard title="Address" onEdit={() => onGoToStep?.(3)}>
        <DataRow label="Current Address" value={`${currentAddress?.line1 || ''}, ${currentAddress?.city || ''}`} />
        <DataRow label="PIN Code" value={currentAddress?.pin} />
      </SectionCard>

      <SectionCard title="Employment" onEdit={() => onGoToStep?.(4)}>
        <DataRow label="Type" value={employment?.type?.replace('_', ' ').toUpperCase()} />
        <DataRow label="Monthly Income" value={formatIndianCurrency(monthlyIncome)} />
        {employment?.companyName && <DataRow label="Company" value={employment.companyName} />}
        {employment?.businessName && <DataRow label="Business" value={employment.businessName} />}
      </SectionCard>

      {/* E-Signature Preview */}
      {signature && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">E-Signature</h3>
          <img src={signature} alt="E-signature" className="max-h-24 border border-slate-200 rounded-xl bg-white p-2" />
        </div>
      )}

      {/* Consents */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="font-bold text-slate-800">Declarations & Consents</h3>
        <div className="space-y-4">
          <Checkbox label="I confirm that all information provided in this application is true and correct to the best of my knowledge." {...register('consents.accuracy')} error={(errors.consents as any)?.accuracy?.message} />
          <Checkbox label="I authorise LendSwift to check my credit score and credit history with CIBIL, Equifax, or any other credit bureau." {...register('consents.creditCheck')} error={(errors.consents as any)?.creditCheck?.message} />
          <Checkbox label={<span>I have read and agree to the <a href="#" className="text-primary underline font-semibold">Terms & Conditions</a> and the <a href="#" className="text-primary underline font-semibold">Privacy Policy</a> of LendSwift.</span>} {...register('consents.terms')} error={(errors.consents as any)?.terms?.message} />
          <Checkbox label="I consent to receive communications (SMS, email, calls) regarding this application and related LendSwift products." {...register('consents.communications')} error={(errors.consents as any)?.communications?.message} />
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
        <strong>Cooling-Off Period:</strong> As per RBI guidelines, you have the right to cancel this loan within the cooling-off period after disbursement without any prepayment penalty. Refer to your sanction letter for specific terms.
      </div>
    </div>
  );
};

export default Step8Review;
