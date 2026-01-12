'use client';

import React, { useState, useEffect } from 'react';
import { Piano } from '@/components/Piano';
import { usePiano } from '@/hooks/usePiano';
import { PASSWORD_MELODY, PLAY_MELODY, GAME_KEYS, HOME_KEYS } from '@/lib/constants';
import { TextDecipher } from '@/components/TextDecipher';

export default function Home() {
  const [view, setView] = useState<'HOME' | 'LOCKED' | 'UNLOCKED'>('HOME');

  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Home Button - Visible on all screens for easy navigation */}
      <button 
        onClick={() => setView('HOME')}
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
      {view === 'LOCKED' && <LockedView onSuccess={() => setView('UNLOCKED')} />}
      {view === 'UNLOCKED' && <UnlockedView onLock={() => setView('HOME')} />}
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

function LockedView({ onSuccess }: { onSuccess: () => void }) {
  const { activeNote, history, playNote, reset, lastInteraction } = usePiano({
    keys: GAME_KEYS,
    targetMelody: PASSWORD_MELODY,
    onSuccess,
  });

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-8 animate-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">
          Enter Password
        </h1>
        <p className="text-neutral-500 text-sm">
          Play the melody to unlock
        </p>
      </div>

      <div className="relative p-6 bg-neutral-800 rounded-xl shadow-2xl shadow-black/50 border border-neutral-700">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-neutral-700 rounded-full" />
        <Piano 
          keys={GAME_KEYS} 
          activeNote={activeNote} 
          onPlay={playNote}
          lastInteraction={lastInteraction}
        />
      </div>

      {/* Visual Feedback / Progress */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2 h-8 items-center justify-center min-w-[100px]">
          {history.map((note, i) => (
            <div
              key={`${note}-${i}`}
              className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-in fade-in zoom-in duration-300"
            />
          ))}
          {history.length === 0 && (
            <span className="text-neutral-700 text-xs italic">Waiting for input...</span>
          )}
        </div>

        <button 
          onClick={reset}
          className="text-xs text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-colors px-4 py-2"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function UnlockedView({ onLock }: { onLock: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
      <h1 className="text-5xl font-bold text-green-500 mb-4 tracking-tight">Access Granted</h1>
      <p className="text-neutral-400 mb-12 text-lg">You have successfully unlocked the piano.</p>
      <button
        onClick={onLock}
        className="px-8 py-3 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-all border border-neutral-700 hover:border-neutral-500"
      >
        Back to Home
      </button>
    </div>
  );
}
