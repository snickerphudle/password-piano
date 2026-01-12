import React from 'react';
import { PIANO_KEYS, Note } from '@/lib/constants';
import { PianoKey } from './PianoKey';

interface PianoProps {
  activeNote: Note | null;
  onPlay: (note: Note) => void;
}

export const Piano: React.FC<PianoProps> = ({ activeNote, onPlay }) => {
  return (
    <div className="flex items-start justify-center p-4 select-none overflow-x-auto max-w-full">
      {PIANO_KEYS.map((config) => (
        <PianoKey
          key={config.note}
          config={config}
          isActive={activeNote === config.note}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
};
