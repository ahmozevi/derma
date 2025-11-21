import React from 'react';
import { Phone, HeartPulse, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NurseOnCall: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="bg-rose-500 p-6 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Nurse On Call</h2>
          <p className="text-rose-100 text-center mt-2">24/7 Professional Medical Support</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm text-center">
            Connect immediately with a registered nurse for triage and health advice.
          </p>
          
          <a href="tel:1300000000" className="flex items-center justify-center gap-3 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-transform active:scale-95">
            <Phone className="w-5 h-5" />
            <span>Call 1300 000 000</span>
          </a>

          <div className="pt-4 border-t border-gray-100">
             <h3 className="font-semibold text-gray-800 mb-2">When to call?</h3>
             <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
               <li>Unsure if you need to go to ER</li>
               <li>Concerns about a skin reaction</li>
               <li>General medical advice</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};