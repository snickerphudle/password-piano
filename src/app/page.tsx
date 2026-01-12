'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Piano } from '@/components/Piano';
import { usePiano } from '@/hooks/usePiano';
import { PLAY_MELODY, GAME_KEYS, HOME_KEYS, LEVELS, LevelConfig } from '@/lib/constants';
import { TextDecipher } from '@/components/TextDecipher';

export default function Home() {
  const [view, setView] = useState<'HOME' | 'LOCKED' | 'UNLOCKED'>('HOME');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(LEVELS[0]); // Start with Level 1

  const handleNextLevel = () => {
    const currentIndex = LEVELS.findIndex(l => l.id === currentLevel.id);
    const nextLevel = LEVELS[currentIndex + 1];
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setView('LOCKED');
    } else {
      // Game Over / All Levels Complete logic could go here
      // For now, just reset to home or show a victory state
      setView('HOME');
      setCurrentLevel(LEVELS[0]);
    }
  };

  const handleBackToHome = () => {
    setView('HOME');
    setCurrentLevel(LEVELS[0]);
  };

  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Home Button - Visible on all screens for easy navigation */}
      <button 
        onClick={handleBackToHome}
        className="absolute top-6 left-6 text-neutral-500 hover:text-white transition-colors z-50 flex items-center gap-2 group"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:-translate-x-1 transition-transform"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0">
          HOME
        </span>
      </button>

      {view === 'HOME' && <HomeView onPlaySuccess={() => setView('LOCKED')} />}
      {view === 'LOCKED' && (
        <LockedView 
          level={currentLevel} 
          onSuccess={() => setView('UNLOCKED')} 
        />
      )}
      {view === 'UNLOCKED' && (
        <UnlockedView 
          onNextLevel={handleNextLevel} 
          isLastLevel={currentLevel.id === LEVELS[LEVELS.length - 1].id}
        />
      )}
    </main>
  );
}

function HomeView({ onPlaySuccess }: { onPlaySuccess: () => void }) {
  const { activeNote, playNote, lastInteraction } = usePiano({
    keys: HOME_KEYS,
    targetMelody: PLAY_MELODY,
    onSuccess: onPlaySuccess,
  });

  const [showPianoText, setShowPianoText] = useState(false);

  useEffect(() => {
    // Delay the appearance of "PIANO" slightly to let "PASSWORD" decipher start
    const timer = setTimeout(() => setShowPianoText(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-12 w-full max-w-4xl px-4">
      <div className="text-center space-y-2 flex flex-col items-center">
        {/* Sneaky Decipher Effect */}
        <div className="text-6xl md:text-8xl font-black text-neutral-100 tracking-tighter uppercase leading-none select-none relative z-10">
           <TextDecipher text="PASSWORD" />
        </div>
        
        {/* Shadow Fade In Effect */}
        <div 
           className={`text-6xl md:text-8xl font-black tracking-tighter uppercase leading-tight transition-all duration-[2000ms] ease-out
             ${showPianoText ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-xl'}
             px-4 pb-4
           `}
        >
          <span className="inline-block p-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-[0_10px_10px_rgba(79,70,229,0.5)]">
            PIANO
          </span>
        </div>

        <p className={`text-neutral-500 font-mono tracking-[0.3em] text-sm mt-8 transition-opacity duration-1000 delay-[2500ms] ${showPianoText ? 'opacity-100' : 'opacity-0'}`}>
          TYPE "PLAY" TO START
        </p>
      </div>

      <div className={`relative p-8 bg-neutral-900/80 rounded-2xl border border-neutral-800/50 backdrop-blur-md shadow-2xl shadow-black transition-all duration-1000 delay-[3000ms] ${showPianoText ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <Piano 
          keys={HOME_KEYS} 
          activeNote={activeNote} 
          onPlay={playNote}
          lastInteraction={lastInteraction}
        />
      </div>
    </div>
  );
}

function LockedView({ level, onSuccess }: { level: LevelConfig; onSuccess: () => void }) {
  const { activeNote, history, playNote, reset, lastInteraction, isError } = usePiano({
    keys: level.keys,
    targetMelody: level.melody,
    onSuccess,
  });

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-8 animate-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">
          Level {level.id}
        </h2>
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">
          {level.name}
        </h1>
        <p className="text-neutral-500 text-sm italic mt-2">
          Hint: {level.hint}
        </p>
      </div>

      <div className="relative p-6 bg-neutral-800 rounded-xl shadow-2xl shadow-black/50 border border-neutral-700">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-neutral-700 rounded-full" />
        <Piano 
          keys={level.keys} 
          activeNote={activeNote} 
          onPlay={playNote}
          lastInteraction={lastInteraction}
        />
      </div>

      {/* Visual Feedback / Progress */}
      <div className="flex flex-col items-center gap-4">
        <div 
          className="flex gap-2 h-12 items-center justify-center min-w-[120px] px-4 rounded-lg bg-neutral-800/50 border border-neutral-700"
        >
          {history.map((note, i) => (
            <div
              key={`${note}-${i}`}
              className={clsx(
                "text-2xl drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-in fade-in zoom-in duration-300 transition-colors",
                isError ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-indigo-400"
              )}
            >
              ♪
            </div>
          ))}
          {history.length === 0 && (
            <span className={clsx(
              "text-xs italic transition-colors duration-300",
              isError ? "text-red-400 font-bold" : "text-neutral-700"
            )}>
              {isError ? "Incorrect Sequence" : "Waiting for input..."}
            </span>
          )}
        </div>

        <button 
          onClick={reset}
          className="text-xs text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-colors px-4 py-2 border border-neutral-800 rounded hover:border-neutral-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function UnlockedView({ onNextLevel, isLastLevel }: { onNextLevel: () => void; isLastLevel: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-700 relative">
      {/* Background Confetti / Glow Effect could go here */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl -z-10" />
      
      <div className="space-y-6 z-10">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4 tracking-tighter uppercase drop-shadow-lg">
          Access Granted
        </h1>
        <p className="text-neutral-400 mb-8 text-lg font-light tracking-wide">
          Authentication verified. Welcome to the system.
        </p>
        
        <button
          onClick={onNextLevel}
          className="group relative px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLastLevel ? "RETURN TO HOME" : "NEXT LEVEL"}
            {!isLastLevel && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
