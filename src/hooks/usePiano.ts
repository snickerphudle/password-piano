import { useEffect, useState, useCallback, useRef } from 'react';
import { KeyConfig, Note } from '@/lib/constants';
import { playNote } from '@/lib/synth';

const RESET_DELAY_MS = 900;

interface UsePianoProps {
  keys: KeyConfig[];
  targetMelody: Note[];
  onSuccess?: () => void;
}

export const usePiano = ({ keys, targetMelody, onSuccess }: UsePianoProps) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [history, setHistory] = useState<Note[]>([]);
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
      
      // Keep only enough notes to match the target melody length
      newHistory = newHistory.slice(-targetMelody.length);
      
      if (newHistory.join(',') === targetMelody.join(',')) {
        if (onSuccess) onSuccess();
      }
      
      return newHistory;
    });
  }, [targetMelody, onSuccess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      
      // Special case for SPACE
      if (e.key === ' ') {
        const spaceConfig = keys.find(k => k.label === 'SPACE');
        if (spaceConfig) {
          e.preventDefault(); 
          handlePlay(spaceConfig.note);
          return;
        }
      }

      const keyConfig = keys.find((k) => k.label === key);
      if (keyConfig) {
        handlePlay(keyConfig.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlay, keys]);

  const reset = () => {
    setHistory([]);
    lastNoteTime.current = 0;
  };

  return {
    activeNote,
    history,
    playNote: handlePlay,
    reset,
  };
};
