import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import FileUploadZone from '../common/FileUploadZone';
import SignaturePad from '../common/SignaturePad';
import { FileCheck } from 'lucide-react';

const Step7Documents: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const loanType = watch('loanType');
  const employmentType = watch('employment.type');
  const signature = watch('signature');

  const [files, setFiles] = useState<Record<string, File[]>>({});

  const handleFilesChange = (key: string, newFiles: File[]) => {
    setFiles(prev => ({ ...prev, [key]: newFiles }));
    setValue(`documents.${key}`, newFiles);
  };

  const isSalaried = employmentType === 'salaried';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
        <FileCheck className="text-primary shrink-0" size={22} />
        <div>
          <p className="text-sm font-bold text-primary">Document Checklist</p>
          <p className="text-xs text-slate-500 mt-0.5">All documents are scanned, compressed, and encrypted. Maximum file size: 5MB per document.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Always required */}
        <FileUploadZone
          label="PAN Card Copy"
          required
          value={files.panCard}
          onChange={(f) => handleFilesChange('panCard', f)}
          description="Clear front-side copy"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadZone
            label="Aadhaar Card (Front)"
            required
            value={files.aadhaarFront}
            onChange={(f) => handleFilesChange('aadhaarFront', f)}
          />
          <FileUploadZone
            label="Aadhaar Card (Back)"
            required
            value={files.aadhaarBack}
            onChange={(f) => handleFilesChange('aadhaarBack', f)}
          />
        </div>
        <FileUploadZone
          label="Passport-size Photograph"
          required
          accept={['image/jpeg', 'image/png']}
          maxSize={2}
          value={files.photograph}
          onChange={(f) => handleFilesChange('photograph', f)}
          description="Recent passport size photo, white background"
        />
        <FileUploadZone
          label="Bank Statements (Last 6 months)"
          required
          accept={['application/pdf']}
          maxSize={10}
          value={files.bankStatements}
          onChange={(f) => handleFilesChange('bankStatements', f)}
          description="PDF format from your bank"
        />

        {/* Conditional: Salaried */}
        {isSalaried && (
          <FileUploadZone
            label="Salary Slips (Last 3 months)"
            required
            accept={['application/pdf']}
            value={files.salarySlips}
            onChange={(f) => handleFilesChange('salarySlips', f)}
            description="Latest 3 months salary slips in PDF"
          />
        )}

        {/* Conditional: Self-Employed / Business */}
        {!isSalaried && employmentType && (
          <FileUploadZone
            label="ITR – Income Tax Returns (Last 2 years)"
            required
            accept={['application/pdf']}
            value={files.itr}
            onChange={(f) => handleFilesChange('itr', f)}
            description="ITR acknowledgements in PDF"
          />
        )}

        {/* Conditional: Home Loan */}
        {loanType === 'home' && (
          <FileUploadZone
            label="Property Documents"
            required
            accept={['application/pdf']}
            maxSize={10}
            value={files.propertyDocs}
            onChange={(f) => handleFilesChange('propertyDocs', f)}
            description="Sale deed, title documents, NOC, etc."
          />
        )}

        {/* Conditional: Business Loan */}
        {loanType === 'business' && (
          <>
            <FileUploadZone
              label="Business Registration Certificate"
              required
              accept={['application/pdf']}
              value={files.businessReg}
              onChange={(f) => handleFilesChange('businessReg', f)}
            />
            <FileUploadZone
              label="GST Returns (Last 4 quarters)"
              required
              accept={['application/pdf']}
              value={files.gstReturns}
              onChange={(f) => handleFilesChange('gstReturns', f)}
            />
          </>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <SignaturePad
          value={signature}
          onChange={(val) => setValue('signature', val)}
        />
      </div>
    </div>
  );
};

export default Step7Documents;
