import { z } from 'zod';

// ─── Step 1 ─────────────────────────────────────────────────────────────────
export const step1Schema = z.object({
  loanType: z.enum(['personal', 'home', 'business']),
  amount: z.number().min(50000, 'Minimum amount is ₹50,000'),
  tenure: z.number().min(1, 'Select a tenure'),
  loanPurpose: z.string().min(1, 'Please select a purpose'),
  referralCode: z.string().optional(),
});

// ─── Step 2 ─────────────────────────────────────────────────────────────────
export const step2Schema = z.object({
  fullName: z.string().min(2, 'Full name is required').regex(/^[a-zA-Z. ]+$/, 'Only letters, spaces, and periods allowed'),
  dob: z.string().refine((val) => {
    if (!val) return false;
    const age = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 21 && age <= 65;
  }, 'Age must be between 21 and 65 years'),
  gender: z.string().min(1, 'Please select gender'),
  maritalStatus: z.string().min(1, 'Please select marital status'),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number (10 digits, starting with 6-9)'),
});

// ─── Step 3 ─────────────────────────────────────────────────────────────────
export const step3Schema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN must be in format AAAAA9999A'),
  aadhaarNumber: z.string().length(12, 'Aadhaar must be exactly 12 digits').regex(/^\d{12}$/, 'Aadhaar must contain only digits'),
  aadhaarConsent: z.boolean().refine((v) => v === true, 'Aadhaar consent is required to proceed'),
});

// ─── Step 4 ─────────────────────────────────────────────────────────────────
export const step4Schema = z.object({
  currentAddress: z.object({
    line1: z.string().min(5, 'Address line 1 is required (min 5 chars)'),
    pin: z.string().length(6, 'PIN code must be 6 digits'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    residenceType: z.string().min(1, 'Residence type is required'),
    yearsAtAddress: z.number().min(0, 'Required').max(50, 'Too high'),
  }),
});

// ─── Step 5 ─────────────────────────────────────────────────────────────────
export const step5Schema = z.object({
  employment: z.object({
    type: z.string().min(1, 'Please select employment type'),
  }),
});

// ─── Step 6 (optional/conditional) ──────────────────────────────────────────
export const step6Schema = z.object({
  coApplicant: z.object({
    name: z.string().min(2, 'Name is required'),
    relationship: z.string().min(1, 'Required'),
    income: z.number().min(0),
    consent: z.boolean().refine((v) => v === true, 'Co-applicant consent is required'),
  }).optional(),
});

// ─── Step 7 ─────────────────────────────────────────────────────────────────
export const step7Schema = z.object({
  signature: z.string().nullable().refine((v) => !!v, 'Please draw your signature'),
});

// ─── Step 8 ─────────────────────────────────────────────────────────────────
export const step8Schema = z.object({
  consents: z.object({
    accuracy: z.boolean().refine((v) => v === true, 'Please confirm all information is accurate'),
    creditCheck: z.boolean().refine((v) => v === true, 'Credit check consent is required'),
    terms: z.boolean().refine((v) => v === true, 'You must agree to Terms & Conditions'),
    communications: z.boolean().optional(),
  }),
});

// ─── Schema Factory ──────────────────────────────────────────────────────────
export const getStepSchema = (step: number) => {
  const schemas: Record<number, z.ZodSchema> = {
    0: step1Schema,
    1: step2Schema,
    2: step3Schema,
    3: step4Schema,
    4: step5Schema,
    5: step6Schema,
    6: step7Schema,
    7: step8Schema,
  };
  return schemas[step] ?? z.object({});
};
