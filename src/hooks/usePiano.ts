import { useEffect, useState, useCallback, useRef } from 'react';
import { PIANO_KEYS, Note, PASSWORD_MELODY } from '@/lib/constants';
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
      
      // Special case for SPACE because key.toUpperCase() is just " " 
      // but our PIANO_KEYS config uses "SPACE" as the label.
      if (e.key === ' ') {
        const spaceConfig = PIANO_KEYS.find(k => k.label === 'SPACE');
        if (spaceConfig) {
          e.preventDefault(); // Prevent scrolling
          handlePlay(spaceConfig.note);
          return;
        }
      }

      // Normal keys
      const keyConfig = PIANO_KEYS.find((k) => k.label === key);
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
