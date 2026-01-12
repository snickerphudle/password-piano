import React from 'react';
import { KeyConfig, Note } from '@/lib/constants';
import { PianoKey } from './PianoKey';
import { InteractionEvent } from '@/hooks/usePiano';

interface PianoProps {
  keys: KeyConfig[];
  activeNote: Note | null;
  onPlay: (note: Note) => void;
  lastInteraction?: InteractionEvent | null;
}

export const Piano: React.FC<PianoProps> = ({ keys, activeNote, onPlay, lastInteraction = null }) => {
  return (
    <div className="flex items-start justify-center p-4 select-none overflow-x-auto max-w-full">
      {keys.map((config) => (
        <PianoKey
          key={`${config.note}-${config.label}`}
          config={config}
          isActive={activeNote === config.note}
          onPlay={onPlay}
          lastInteraction={lastInteraction}
        />
      ))}
    </div>
  );
};
