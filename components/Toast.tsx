import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div 
      className="fixed bottom-5 right-5 bg-slate-800 border border-slate-700 text-slate-200 px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center animate-fade-in"
      style={{ boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
    >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" style={{boxShadow: '0 0 10px var(--glow-color)'}}></div>
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-slate-500 hover:text-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
  );
};

export default Toast;
