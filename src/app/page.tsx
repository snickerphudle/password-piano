'use client';

import React from 'react';
import { Piano } from '@/components/Piano';
import { usePiano } from '@/hooks/usePiano';
import { PASSWORD_MELODY } from '@/lib/constants';

export default function Home() {
  const { activeNote, history, isUnlocked, playNote, reset } = usePiano();

  if (isUnlocked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 text-center animate-in fade-in duration-700">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Access Granted</h1>
        <p className="text-green-600 mb-8">Welcome to the secret area.</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          Lock Gate
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-8">
      <div className="max-w-xl w-full flex flex-col items-center space-y-8">
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
          <Piano activeNote={activeNote} onPlay={playNote} />
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
        
        {/* Debug / Hint (can remove later) */}
        <div className="text-neutral-800 text-xs mt-10 select-none">
           Hint: {PASSWORD_MELODY.join(' ')}
        </div>
      </div>
    </main>
  );
}
