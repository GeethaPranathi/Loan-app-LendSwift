/**
 * EMI Calculator using standard reducing-balance formula
 * EMI = P × r × (1 + r)^n / ((1 + r)^n – 1)
 */

const INTEREST_RATES: Record<string, number> = {
  personal: 10.5,
  home: 8.5,
  business: 14.0,
};

export const calculateEMI = (principal: number, loanType: string, tenureMonths: number): number => {
  const annualRate = INTEREST_RATES[loanType] || 10.5;
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
};

export const calculateTotalCost = (emi: number, tenure: number, principal: number): number => {
  return emi * tenure - principal;
};

export const calculateProcessingFee = (principal: number): number => {
  const fee = Math.round(principal * 0.01);
  return Math.min(Math.max(fee, 2000), 25000);
};

export const getInterestRate = (loanType: string): number => {
  return INTEREST_RATES[loanType] || 10.5;
};

/** Format number to Indian number system (e.g. 10,50,000) */
export const formatIndianCurrency = (num: number): string => {
  if (isNaN(num)) return '₹0';
  const numStr = Math.round(num).toString();
  const lastThree = numStr.slice(-3);
  const otherNumbers = numStr.slice(0, -3);
  const formatted = otherNumbers !== ''
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return `₹${formatted}`;
};
