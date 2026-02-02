
import React, { useState, useEffect, useRef } from 'react';
import { RowData } from '../types';
import { Browser } from '@capacitor/browser';

interface ViewerProps {
  item: RowData;
  nextItem?: RowData | null;
  index: number;
  total: number;
  rotation: number;
}

const Viewer: React.FC<ViewerProps> = ({ item, nextItem, index, total, rotation }) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<number | null>(null);
  const globalTimeoutRef = useRef<number | null>(null);

  const getDirectImageUrl = (url: string, attempt: number = 0) => {
    if (!url || typeof url !== 'string') return '';
    
    let driveId = '';
    const dPattern = /\/d\/([a-zA-Z0-9_-]{25,})/;
    const dMatch = url.match(dPattern);
    const idPattern = /[?&]id=([a-zA-Z0-9_-]{25,})/;
    const idMatch = url.match(idPattern);

    if (dMatch && dMatch[1]) {
      driveId = dMatch[1];
    } else if (idMatch && idMatch[1]) {
      driveId = idMatch[1];
    }

    if (!driveId) return url;

    // Utilizziamo sz=w1000 invece di w1600 per un caricamento molto più veloce su mobile
    if (attempt <= 1) {
      return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
    } else if (attempt === 2) {
      return `https://lh3.googleusercontent.com/d/${driveId}=s1000`;
    } else {
      const source = `drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
      return `https://images.weserv.nl/?url=${encodeURIComponent(source)}&n=-1`;
    }
  };

  const displayUrl = getDirectImageUrl(item.linkFoto, retryCount);
  const nextDisplayUrl = nextItem ? getDirectImageUrl(nextItem.linkFoto, 0) : '';

  useEffect(() => {
    setImgStatus('loading');
    setRetryCount(0);
    if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
    if (globalTimeoutRef.current) window.clearTimeout(globalTimeoutRef.current);

    globalTimeoutRef.current = window.setTimeout(() => {
      if (imgStatus !== 'loaded') {
        setImgStatus('error');
      }
    }, 12000); // Ridotto timeout per fallire più velocemente e provare il proxy

    return () => {
      if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
      if (globalTimeoutRef.current) window.clearTimeout(globalTimeoutRef.current);
    };
  }, [item.linkFoto]);

  const handleImageError = () => {
    if (retryCount < 4) {
      retryTimeoutRef.current = window.setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 800);
    } else {
      setImgStatus('error');
    }
  };

  const openExternalLink = async () => {
    if (item.linkFoto) {
      try {
        await Browser.open({ url: item.linkFoto });
      } catch (err) {
        window.open(item.linkFoto, '_blank');
      }
    }
  };

  const finalUrl = displayUrl ? `${displayUrl}${displayUrl.includes('?') ? '&' : '?'}cb=${retryCount}` : '';

  return (
    <div className="relative flex-grow w-full flex flex-col overflow-hidden">
      {/* Header Info - Layout Verticale per evitare troncamenti */}
      <div className="flex flex-col px-3 py-2 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Codice Identificativo
            </span>
            <span className="text-2xl font-black text-emerald-400 leading-none tracking-tighter">
              {item.codice || '---'}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 shrink-0">
             <div className="bg-slate-800 px-2 py-0.5 rounded border border-white/10">
              <span className="font-mono text-[10px] font-black text-slate-300">
                {index + 1} <span className="text-slate-500">/</span> {total}
              </span>
            </div>
            {item.isDuplicate && (
              <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm animate-pulse">
                DUPLICATO
              </span>
            )}
          </div>
        </div>

        {/* Nome Operatore - Riga dedicata per evitare troncamenti */}
        {item.nomeOperatore && (
          <div className="mt-2">
            <span className="text-lg font-black text-yellow-400 leading-tight uppercase block break-words">
              {item.nomeOperatore}
            </span>
          </div>
        )}

        {/* Data, Ora e Badge Registrato */}
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            <span>{item.data}</span>
            <span className="mx-2 opacity-30">|</span>
            <span>{item.ora}</span>
          </div>
          
          {item.stato === 'CONTROLLATO' && (
            <span className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[8px] font-black rounded uppercase">
              REGISTRATO
            </span>
          )}
        </div>
      </div>

      {/* Area Immagine */}
      <div className="relative flex-grow w-full bg-black flex items-center justify-center overflow-hidden">
        
        {imgStatus === 'loading' && finalUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
             <div className="w-8 h-8 border-3 border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
               Ottimizzazione...
             </p>
          </div>
        )}

        {finalUrl && imgStatus !== 'error' ? (
          <img 
            key={`${item.linkFoto}-${retryCount}`} 
            src={finalUrl} 
            alt="AgriScan"
            crossOrigin="anonymous"
            loading="eager"
            onLoad={() => {
              setImgStatus('loaded');
              if (globalTimeoutRef.current) window.clearTimeout(globalTimeoutRef.current);
            }}
            onError={handleImageError}
            style={{ transform: `rotate(${rotation}deg)` }}
            className={`max-w-full max-h-full object-contain transition-all duration-300 ${imgStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${item.isDuplicate ? 'brightness-75' : ''}`}
          />
        ) : null}

        {(imgStatus === 'error' || !finalUrl) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 z-20">
            <h3 className="text-white font-black text-xs uppercase mb-4">Errore di rete Google</h3>
            <button 
              onClick={openExternalLink} 
              className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase active:scale-95 transition-transform"
            >
              Apri Foto Esterna
            </button>
          </div>
        )}
      </div>

      {nextDisplayUrl && <link rel="prefetch" href={nextDisplayUrl} />}
    </div>
  );
};

export default Viewer;
