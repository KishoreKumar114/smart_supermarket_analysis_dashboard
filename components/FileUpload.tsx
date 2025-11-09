import React, { useState, useCallback, useEffect } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  onLogout: () => void;
}

const ACCEPTED_MIME_TYPES = ['text/csv', 'application/json', 'text/plain'];

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, onLogout }) => {
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    document.body.className = 'bg-dark-animate text-slate-200';
    return () => {
      document.body.className = 'text-slate-200';
    };
  }, []);
  
  const validateFile = (file: File | null): boolean => {
    if (!file) return false;
    return ACCEPTED_MIME_TYPES.some(type => file.type.startsWith(type));
  };
  
  const handleFileProcessing = (file: File) => {
    setFileError('');
    if (validateFile(file)) {
      onFileUpload(file);
    } else {
      setFileError('Unsupported file type. Please upload a CSV, JSON, or TXT file.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcessing(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcessing(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="w-full max-w-lg glass-card p-8 md:p-12 text-center animate-fade-in relative">
        <button onClick={onLogout} className="absolute top-4 right-4 text-xs text-slate-400 hover:text-white transition-colors">
            Logout
        </button>
        <h1 className="text-3xl font-bold text-white mb-4">Upload CSV Data</h1>
        <p className="text-slate-300 mb-8">
          Drop your sales data file or click the button below to start the analysis.
        </p>

        {isLoading ? (
          <div className="space-y-4">
            <p className="text-slate-200 font-medium">Analyzing your data...</p>
            <div className="progress-bar">
              <div className="progress-bar-inner"></div>
            </div>
             <p className="text-sm text-slate-400">This may take a moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <label htmlFor="file-upload" className="w-full inline-block btn-gradient btn-gradient-upload cursor-pointer">
              Upload CSV
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={handleChange} accept={ACCEPTED_MIME_TYPES.join(',')} />
            {fileError && <p className="text-sm text-red-400">{fileError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;