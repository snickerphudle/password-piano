import React from 'react';
import { KeyConfig, Note } from '@/lib/constants';
import { PianoKey } from './PianoKey';

interface PianoProps {
  keys: KeyConfig[];
  activeNote: Note | null;
  onPlay: (note: Note) => void;
}

export const Piano: React.FC<PianoProps> = ({ keys, activeNote, onPlay }) => {
  return (
    <div className="flex items-start justify-center p-4 select-none overflow-x-auto max-w-full">
      {keys.map((config) => (
        <PianoKey
          key={`${config.note}-${config.label}`}
          config={config}
          isActive={activeNote === config.note}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
};
