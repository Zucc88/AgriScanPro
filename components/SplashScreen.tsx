import React from 'react';

const COMPANY_LOGO = 'https://i.ibb.co/MD2hzTM6/logo.png';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative group">
        {/* Effetto bagliore potenziato dietro il logo */}
        <div className="absolute -inset-6 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-1000 animate-pulse"></div>
        
        {/* Contenitore Logo */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden flex items-center justify-center animate-zoom-in">
          <img 
            src={COMPANY_LOGO} 
            alt="Logica Digitale Logo" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      
      {/* Testo di accompagnamento */}
      <div className="mt-12 flex flex-col items-center animate-slide-up">
        <h2 className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-2 opacity-80">
          Powered by
        </h2>
        <h1 className="text-white text-3xl font-black tracking-tighter uppercase italic">
          LOGICA <span className="text-blue-500">DIGITALE</span>
        </h1>
        
        {/* Indicatori di caricamento */}
        <div className="mt-10 flex gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;