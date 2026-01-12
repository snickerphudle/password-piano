import { useEffect, useState, useCallback, useRef } from 'react';
import { KeyConfig, Note } from '@/lib/constants';
import { playNote } from '@/lib/synth';

const RESET_DELAY_MS = 2000;

interface UsePianoProps {
  keys: KeyConfig[];
  targetMelody: Note[];
  onSuccess?: () => void;
}

export type InteractionStatus = 'correct' | 'wrong';

export interface InteractionEvent {
  note: Note;
  status: InteractionStatus;
  id: number;
}

export const usePiano = ({ keys, targetMelody, onSuccess }: UsePianoProps) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [history, setHistory] = useState<Note[]>([]);
  const [lastInteraction, setLastInteraction] = useState<InteractionEvent | null>(null);
  const [isError, setIsError] = useState(false);
  const lastNoteTime = useRef<number>(0);

  const handlePlay = useCallback((note: Note) => {
    playNote(note);
    setActiveNote(note);
    
    setTimeout(() => setActiveNote(null), 200);

    const now = Date.now();
    const timeSinceLast = now - lastNoteTime.current;
    lastNoteTime.current = now;

    setHistory((prev) => {
      if (isError) {
        setIsError(false);
        return [note];
      }

      let potentialHistory = (timeSinceLast > RESET_DELAY_MS) ? [] : [...prev];
      
      const expectedNoteIndex = potentialHistory.length;
      const expectedNote = targetMelody[expectedNoteIndex];

      if (note === expectedNote) {
        // CORRECT
        const newHistory = [...potentialHistory, note];
        setIsError(false); 
        
        setLastInteraction({
          note,
          status: 'correct',
          id: now,
        });

        if (newHistory.length === targetMelody.length) {
           // Wrap onSuccess in setTimeout to avoid "state update during render" error
           // if this callback triggers a parent state change (like setView)
           if (onSuccess) {
             setTimeout(() => {
               onSuccess();
             }, 0);
           }
           return []; 
        }

        return newHistory;
      } else {
        // WRONG
        setIsError(true);
        
        setLastInteraction({
          note,
          status: 'wrong',
          id: now,
        });

        const errorHistory = [...potentialHistory, note];
        
        setTimeout(() => {
          setIsError(false);
          setHistory([]);
        }, 500);
        
        return errorHistory;
      }
    });
  }, [targetMelody, onSuccess, isError]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      
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
    setLastInteraction(null);
    setIsError(false);
  };

  return {
    activeNote,
    history,
    lastInteraction,
    isError,
    playNote: handlePlay,
    reset,
  };
};
