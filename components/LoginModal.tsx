
import React, { useState } from 'react';
import { Clipboard } from '@capacitor/clipboard';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await Clipboard.write({ string: text });
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Errore durante la copia:", err);
      // Fallback per browser non-Capacitor
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      }
    }
  };

  const credentials = {
    email: 'appclalavoro@gmail.com',
    pass: 'Lp@24-22'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Credenziali di Accesso</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Copia le credenziali qui sotto per il login:
          </p>

          <div className="space-y-4 mb-6">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="flex-grow text-sm font-mono text-emerald-400 truncate select-all">{credentials.email}</span>
                <button 
                  onClick={() => handleCopy(credentials.email, 'email')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    copiedField === 'email' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {copiedField === 'email' ? 'Copiato!' : 'Copia'}
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Password</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="flex-grow text-sm font-mono text-emerald-400 truncate select-all">{credentials.pass}</span>
                <button 
                  onClick={() => handleCopy(credentials.pass, 'pass')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    copiedField === 'pass' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {copiedField === 'pass' ? 'Copiato!' : 'Copia'}
                </button>
              </div>
            </div>
          </div>

          {/* Warning Message Box - High Visibility */}
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 mb-8">
            <p className="text-amber-400 text-sm font-bold text-center leading-snug">
              ATTENZIONE: clicca su "USA UN ALTRO ACCOUNT" e incolla la mail e la password che vedi qui sopra.
            </p>
          </div>

          <button 
            onClick={onConfirm}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            APRI FOGLIO E ACCEDI
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
