
import React from 'react';

const LOGO_URL = 'https://i.postimg.cc/bJ7gg5vG/Screenshot-2026-01-22-163046.png';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-6">
      <div className="mb-8 animate-in fade-in zoom-in duration-500">
        <img src={LOGO_URL} alt="AgriScan Logo" className="h-20 object-contain mx-auto opacity-80" />
      </div>
      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-sm font-bold text-slate-300 text-center tracking-tight uppercase">{message}</h2>
      <p className="mt-2 text-slate-600 font-mono text-[9px] uppercase tracking-[0.2em]">AgriScan Pro System</p>
    </div>
  );
};

export default Loader;
