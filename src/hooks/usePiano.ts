import { useEffect, useState, useCallback, useRef } from 'react';
import { OCTAVE, Note, PASSWORD_MELODY } from '@/lib/constants';
import { playNote } from '@/lib/synth';

const RESET_DELAY_MS = 900;

export const usePiano = () => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [history, setHistory] = useState<Note[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const lastNoteTime = useRef<number>(0);

  const handlePlay = useCallback((note: Note) => {
    playNote(note);
    setActiveNote(note);
    
    setTimeout(() => setActiveNote(null), 200);

    const now = Date.now();
    const timeSinceLast = now - lastNoteTime.current;
    lastNoteTime.current = now;

    setHistory((prev) => {
      // If too much time passed, start fresh with just this note
      let newHistory = (timeSinceLast > RESET_DELAY_MS) 
        ? [note] 
        : [...prev, note];
      
      // Keep only enough notes to match the password length
      // Actually, for a strict password reset, usually you want exact match.
      // But keeping a rolling window is also fine if we reset on timeout.
      // Let's stick to rolling window for now, but the timeout enforces "grouping".
      newHistory = newHistory.slice(-PASSWORD_MELODY.length);
      
      if (newHistory.join(',') === PASSWORD_MELODY.join(',')) {
        setIsUnlocked(true);
      }
      
      return newHistory;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      const keyConfig = OCTAVE.find((k) => k.label === key);
      if (keyConfig) {
        handlePlay(keyConfig.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlay]);

  const reset = () => {
    setIsUnlocked(false);
    setHistory([]);
    lastNoteTime.current = 0;
  };

  return {
    activeNote,
    history,
    isUnlocked,
    playNote: handlePlay,
    reset,
  };
};
