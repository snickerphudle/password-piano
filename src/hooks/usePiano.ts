import { useEffect, useState, useCallback, useRef } from 'react';
import { KeyConfig, Note } from '@/lib/constants';
import { playNote } from '@/lib/synth';

const RESET_DELAY_MS = 2000; // Relaxed a bit since we have strict matching now

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
  const lastNoteTime = useRef<number>(0);

  const handlePlay = useCallback((note: Note) => {
    playNote(note);
    setActiveNote(note);
    
    setTimeout(() => setActiveNote(null), 200);

    const now = Date.now();
    const timeSinceLast = now - lastNoteTime.current;
    lastNoteTime.current = now;

    setHistory((prev) => {
      // Logic: Strict Prefix Matching
      // 1. If we timed out, we must reset. But wait, if we reset, is this new note the start?
      //    Yes. If time > delay, we treat this as the *first* note of a new attempt.
      
      let potentialHistory = (timeSinceLast > RESET_DELAY_MS) ? [] : [...prev];
      
      // 2. Check if this new note matches the NEXT expected note in the target melody
      const expectedNoteIndex = potentialHistory.length;
      const expectedNote = targetMelody[expectedNoteIndex];

      if (note === expectedNote) {
        // CORRECT
        const newHistory = [...potentialHistory, note];
        
        setLastInteraction({
          note,
          status: 'correct',
          id: now,
        });

        // Check for full success
        if (newHistory.length === targetMelody.length) {
           if (onSuccess) onSuccess();
           // Optional: Reset history after success? Usually yes.
           return []; 
        }

        return newHistory;
      } else {
        // WRONG
        // Strict Mode: Any wrong note resets the progress immediately.
        setLastInteraction({
          note,
          status: 'wrong',
          id: now,
        });
        
        return [];
      }
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
    setLastInteraction(null);
  };

  return {
    activeNote,
    history,
    lastInteraction,
    playNote: handlePlay,
    reset,
  };
};
