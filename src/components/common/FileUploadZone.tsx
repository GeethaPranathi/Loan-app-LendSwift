import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string[];
  maxSize?: number; // in MB
  value?: File[];
  onChange?: (files: File[]) => void;
  required?: boolean;
  description?: string;
}

const compressImage = async (file: File, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_W = 1200;
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          if (blob.size > 2 * 1024 * 1024 && quality > 0.3) {
            // Recursively compress more
            const newFile = new File([blob], file.name, { type: 'image/jpeg' });
            compressImage(newFile, quality - 0.1).then(resolve);
          } else {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.src = url;
  });
};

const FileUploadZone: React.FC<FileUploadProps> = ({
  label, accept = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSize = 5, value = [], onChange, required, description
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const processed: File[] = [];
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        processed.push(compressed);
      } else {
        processed.push(file);
      }
    }
    onChange?.([...value, ...processed]);
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label mb-0">
          {label} {required && <span className="text-error ml-1">*</span>}
        </label>
        <span className="text-xs text-slate-400 font-medium">Max {maxSize}MB · {accept.map(a => a.split('/')[1]).join(', ').toUpperCase()}</span>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : value.length > 0
            ? 'border-accent/40 bg-accent/5'
            : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`mx-auto mb-2 ${isDragActive ? 'text-primary' : 'text-slate-300'}`} size={32} />
        <p className="text-sm font-semibold text-slate-500">
          {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
        </p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>

      {fileRejections.length > 0 && (
        <p className="error-text">File too large or invalid type. Max {maxSize}MB.</p>
      )}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2.5">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary" size={18} />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">{file.name}</p>
                  <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent" />
                <button type="button" onClick={() => removeFile(i)} className="p-1 hover:bg-red-50 rounded-lg transition-colors">
                  <X size={16} className="text-slate-400 hover:text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
