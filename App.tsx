
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RowData } from './types';
import { fetchAllData, markRowAsChecked, cleanupOldData } from './services/api';
import Viewer from './components/Viewer';
import Controls from './components/Controls';
import Loader from './components/Loader';
import LoginModal from './components/LoginModal';
import SplashScreen from './components/SplashScreen';
import { Browser } from '@capacitor/browser';

const LOGO_URL = 'https://i.postimg.cc/bJ7gg5vG/Screenshot-2026-01-22-163046.png';
const COMPANY_LOGO = 'https://i.ibb.co/MD2hzTM6/logo.png';

const App: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [viewMode, setViewMode] = useState<'todo' | 'history'>('todo');

  const loadData = useCallback(async (mode: 'todo' | 'history' = 'todo') => {
    setLoading(true);
    setError(null);
    setIsFinished(false);
    setViewMode(mode);
    
    try {
      await cleanupOldData();
      const rawData = await fetchAllData();
      
      const codeCounts: Record<string, number> = {};
      rawData.forEach((item) => {
        if (item.codice) {
          codeCounts[item.codice] = (codeCounts[item.codice] || 0) + 1;
        }
      });

      let processedData: RowData[] = rawData.map((item, index) => {
        const nomeOperatore = (item.nomeOperatore || item.operatore || item.Operatore || item.nome_operatore || '').toString().trim();
        const dataValRaw = (item.data || item.Data || '').toString().trim();
        const oraVal = (item.ora || item.Ora || item.ORA || '').toString().trim();

        let dataVal = dataValRaw;
        if (dataValRaw.includes('T') && dataValRaw.includes('-')) {
          try {
            const d = new Date(dataValRaw);
            if (!isNaN(d.getTime())) {
              const day = String(d.getUTCDate()).padStart(2, '0');
              const month = String(d.getUTCMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              dataVal = `${day}-${month}-${year}`;
            }
          } catch (e) {
            console.warn("Data non formattabile:", dataValRaw);
          }
        }

        return {
          ...item,
          nomeOperatore,
          data: dataVal,
          ora: oraVal,
          rowIndex: item.rowIndex ?? index + 2,
          isDuplicate: item.codice && codeCounts[item.codice] > 1,
        };
      });

      if (mode === 'todo') {
        processedData = processedData.filter(item => 
          !item.stato || item.stato.trim() === '' || item.stato.toUpperCase() !== 'CONTROLLATO'
        );
      }

      processedData.sort((a, b) => {
        const opA = (a.nomeOperatore || 'ZZZ').toUpperCase();
        const opB = (b.nomeOperatore || 'ZZZ').toUpperCase();
        if (opA < opB) return -1;
        if (opA > opB) return 1;
        return (a.rowIndex || 0) - (b.rowIndex || 0);
      });

      setData(processedData);

      if (processedData.length === 0) {
        setIsFinished(true);
      } else {
        setCurrentIndex(0);
      }
    } catch (err) {
      setError("Errore nel caricamento dei dati.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Gestione Splash Screen 5 secondi
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    loadData('todo');

    return () => clearTimeout(splashTimer);
  }, [loadData]);

  useEffect(() => {
    setRotation(0);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRotateLeft = () => setRotation(prev => prev - 90);
  const handleRotateRight = () => setRotation(prev => prev + 90);

  const handleMarkChecked = () => {
    const currentRow = data[currentIndex];
    const rowIndexToMark = currentRow.rowIndex;

    const newData = [...data];
    newData[currentIndex] = { ...currentRow, stato: 'CONTROLLATO' };
    setData(newData);

    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setTimeout(() => setIsFinished(true), 500);
    }

    markRowAsChecked(rowIndexToMark);
  };

  const handleReviewAlreadyChecked = () => {
    loadData('history');
  };

  const handleContinueReading = () => {
    loadData('todo');
  };

  const handleGoHome = () => {
    setIsFinished(true);
  };

  const openGoogleSheetDirectly = async () => {
    const sheetUrl = 'https://accounts.google.com/AccountChooser?continue=https://docs.google.com/spreadsheets/d/1uZ8iKIk7FbDYc3yZkAR6wS3AetPrCuEu36Bytbf4Tw8/edit#gid=0';
    try {
      await Browser.open({ url: sheetUrl });
    } catch (err) {
      window.open(sheetUrl, '_blank');
    }
    setShowLoginModal(false);
  };

  const AppHeader = () => (
    <header className="sticky top-0 z-[60] bg-slate-900/60 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top,0.5rem)] px-3 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div 
          onClick={() => loadData('todo')}
          className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          <img 
            src={LOGO_URL} 
            alt="App Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
          />
        </div>

        <div className="flex flex-col min-w-0">
          <h1 className="text-white text-xl font-black tracking-tighter leading-none uppercase truncate">
            AGRISCAN-PRO
          </h1>
          <span className="text-emerald-400 text-[6.5px] font-bold tracking-[0.05em] leading-tight uppercase mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
            AZIENDA AGRICOLA ANDREA FRERETTI
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 ml-1">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
          {viewMode === 'todo' ? 'CODA' : 'STORICO'}
        </span>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[7px] font-bold text-emerald-500/80 uppercase">Online</span>
        </div>
      </div>
    </header>
  );

  const AppFooterSignature = () => (
    <div className="flex items-center justify-end gap-1.5 py-1.5 px-3 bg-slate-950/80 backdrop-blur-sm">
      <span className="text-blue-500 text-[6.5px] font-bold tracking-[0.05em] uppercase">
        LOGICA DIGITALE
      </span>
      <div className="w-4 h-4 rounded-full shadow-sm overflow-hidden flex items-center justify-center">
        <img src={COMPANY_LOGO} alt="Logica Digitale" className="w-full h-full object-cover" />
      </div>
    </div>
  );

  // Mostra lo Splash Screen prioritariamente per 5 secondi
  if (showSplash) return <SplashScreen />;

  if (loading) return <Loader message="Sincronizzazione Database..." />;

  if (isFinished || data.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden relative">
        <AppHeader />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center overflow-y-auto pb-10">
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
            onConfirm={openGoogleSheetDirectly} 
          />
          <div className={`mb-8 p-6 rounded-3xl border-2 transition-all duration-700 ${viewMode === 'todo' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 ${viewMode === 'todo' ? 'text-emerald-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {data.length === 0 && viewMode === 'todo' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              )}
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-3 leading-tight tracking-tighter uppercase max-w-xs">
            {data.length === 0 && viewMode === 'todo' ? "Nessuna foto da registrare" : "Menu Gestione"}
          </h2>
          <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
            <button 
              onClick={handleContinueReading} 
              className="group w-full flex items-center justify-center gap-3 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/30 transition-all active:scale-95"
            >
              CODA LAVORO (NUOVI)
            </button>
            <button 
              onClick={handleReviewAlreadyChecked} 
              className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              RIVEDI STORICO (TUTTI)
            </button>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 border border-slate-800 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
            >
              APRI FOGLIO GOOGLE
            </button>
          </div>
        </div>
        <AppFooterSignature />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      <AppHeader />
      <div className="flex-grow relative overflow-hidden flex flex-col">
        <Viewer 
          item={data[currentIndex]} 
          nextItem={currentIndex < data.length - 1 ? data[currentIndex + 1] : null}
          index={currentIndex} 
          total={data.length} 
          rotation={rotation}
        />
      </div>
      <div className="flex flex-col">
        <Controls 
          onNext={handleNext}
          onPrev={handlePrev}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onMarkChecked={handleMarkChecked}
          onHome={handleGoHome}
          canNext={currentIndex < data.length - 1}
          canPrev={currentIndex > 0}
          currentIndex={currentIndex}
          total={data.length}
        />
        <AppFooterSignature />
      </div>
    </div>
  );
};

export default App;
