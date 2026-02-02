
import React from 'react';

interface ControlsProps {
  onNext: () => void;
  onPrev: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onMarkChecked: () => void;
  onHome: () => void;
  canNext: boolean;
  canPrev: boolean;
  currentIndex: number;
  total: number;
}

const Controls: React.FC<ControlsProps> = ({ 
  onNext, 
  onPrev, 
  onRotateLeft,
  onRotateRight,
  onMarkChecked, 
  onHome,
  canNext, 
  canPrev 
}) => {
  return (
    <div className="bg-slate-900 border-t border-white/5 pb-safe shadow-2xl z-40">
      <div className="px-3 pt-2 pb-4 flex flex-col gap-3 max-w-lg mx-auto">
        
        {/* Riga superiore: Home, Navigazione e Rotazione compattati */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1">
            <button 
              onClick={onHome}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-400 rounded-lg active:bg-slate-700 border border-slate-700/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <div className="h-6 w-[1px] bg-slate-800 mx-0.5"></div>
            <button 
              onClick={onPrev}
              disabled={!canPrev}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                canPrev ? 'bg-slate-800 text-white active:bg-slate-700' : 'bg-slate-900 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={onNext}
              disabled={!canNext}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                canNext ? 'bg-slate-800 text-white active:bg-slate-700' : 'bg-slate-900 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={onRotateLeft}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 text-emerald-400 rounded-lg active:bg-slate-700 border border-slate-700/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l-5-5m0 0l5-5m-5 5h12a4 4 0 014 4v2" />
              </svg>
            </button>
            <button 
              onClick={onRotateRight}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 text-emerald-400 rounded-lg active:bg-slate-700 border border-slate-700/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 14l5-5m0 0l-5-5m5 5H7a4 4 0 00-4 4v2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pulsante Principale: LETTO - Leggermente più basso per risparmiare spazio */}
        <button 
          onClick={onMarkChecked}
          className="w-full py-4 bg-emerald-600 active:bg-emerald-500 text-white font-black text-xl rounded-xl shadow-lg shadow-emerald-900/20 transition-all uppercase tracking-tight flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          REGISTRA LETTO
        </button>
      </div>
    </div>
  );
};

export default Controls;
