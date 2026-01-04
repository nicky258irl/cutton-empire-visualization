import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock, BookOpen, User } from 'lucide-react';
import Map from './components/Map';
import { HISTORICAL_EVENTS, PHASE_COLORS } from './constants';
import { CapitalismPhase } from './types';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEvent = HISTORICAL_EVENTS[currentIndex];

  const nextEvent = () => {
    if (currentIndex < HISTORICAL_EVENTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevEvent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextEvent();
      if (e.key === 'ArrowLeft') prevEvent();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const progress = ((currentIndex + 1) / HISTORICAL_EVENTS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-20 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-serif">
              Empire of Cotton <span className="text-indigo-400">棉花帝国</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">A Global History of Capitalism / 斯文·贝克特 (Sven Beckert)</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Current Era</div>
            <div 
              className="text-sm font-bold px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: `${PHASE_COLORS[currentEvent.phase]}20`, color: PHASE_COLORS[currentEvent.phase] }}
            >
              {currentEvent.phase}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-6 h-[calc(100vh-88px)] overflow-hidden">
        
        {/* Left Panel: Info Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-10 -mt-10"
                style={{ backgroundColor: PHASE_COLORS[currentEvent.phase] }}
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-serif font-bold text-white">{currentEvent.displayYear}</span>
                <div className="h-px flex-1 bg-slate-700"></div>
              </div>

              <h2 className="text-2xl font-bold text-indigo-100 mb-2 leading-tight">
                {currentEvent.title}
              </h2>

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                <MapPin size={14} />
                <span>{currentEvent.locationName}</span>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
                <p>{currentEvent.description}</p>
                
                {currentEvent.keyFigure && (
                  <div className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border-l-2 border-indigo-500">
                    <User className="text-indigo-400 shrink-0 mt-1" size={18} />
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-slate-500 mb-0.5">Key Figure</span>
                      <span className="font-medium text-indigo-200">{currentEvent.keyFigure}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border-l-2 border-emerald-500">
                  <BookOpen className="text-emerald-400 shrink-0 mt-1" size={18} />
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 mb-0.5">Historical Impact</span>
                    <span className="text-emerald-100 italic">"{currentEvent.impact}"</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm text-slate-400">
              <span>Timeline Progress</span>
              <span>{currentIndex + 1} / {HISTORICAL_EVENTS.length}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex justify-between gap-4 mt-2">
              <button
                onClick={prevEvent}
                disabled={currentIndex === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium group"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Previous
              </button>
              <button
                onClick={nextEvent}
                disabled={currentIndex === HISTORICAL_EVENTS.length - 1}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium group"
              >
                Next
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="flex-1 min-h-[300px] lg:h-full">
          <Map 
            currentEvent={currentEvent} 
            events={HISTORICAL_EVENTS} 
            onMarkerClick={(id) => setCurrentIndex(HISTORICAL_EVENTS.findIndex(e => e.id === id))}
          />
        </div>

      </main>
    </div>
  );
}

export default App;
