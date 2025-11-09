import React, { useState } from 'react';
import { TopCustomer } from '../types';

interface OfferModalProps {
  customers: TopCustomer[];
  onClose: () => void;
  onSend: (message: string, platform: 'sms' | 'whatsapp', mobileNumber?: string) => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ customers, onClose, onSend }) => {
  const defaultMessage = `Hello valued customer, here's a special 20% discount on your next purchase!`;
  const [message, setMessage] = useState(defaultMessage);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSend = (platform: 'sms' | 'whatsapp') => {
    if (message.trim()) {
      onSend(message, platform, customers.length === 1 ? mobileNumber : undefined);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto text-slate-200 animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 40px var(--glow-color)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            {customers.length > 1 ? 'Send Bulk Offer' : `Send Offer to ${customers[0]?.name}`}
        </h2>
        <p className="text-slate-400 mb-6">To: <span className="font-semibold text-slate-300">{customers.length} selected customer(s)</span></p>

        {customers.length === 1 && (
            <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-400 mb-2">Mobile Number</label>
                <input 
                    type="tel"
                    id="mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={`Enter ${customers[0].name}'s mobile number`}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
            </div>
        )}

        <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">Customize Message</label>
            <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
        </div>

        <div className="flex items-center justify-end gap-4">
            <button
                onClick={() => handleSend('whatsapp')}
                className="font-bold py-2 px-5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            >
                Send via WhatsApp
            </button>
            <button
                onClick={() => handleSend('sms')}
                className="font-bold py-2 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
                Send via SMS
            </button>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;