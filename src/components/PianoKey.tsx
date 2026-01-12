import React from 'react';
import { clsx } from 'clsx';
import { KeyConfig } from '@/lib/constants';

interface PianoKeyProps {
  config: KeyConfig;
  isActive: boolean;
  onPlay: (note: string) => void;
}

export const PianoKey: React.FC<PianoKeyProps> = ({ config, isActive, onPlay }) => {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onPlay(config.note);
      }}
      className={clsx(
        'relative flex flex-col justify-end items-center pb-2 select-none transition-all duration-100 border border-gray-400 rounded-b-md focus:outline-none',
        config.isBlack
          ? 'w-10 h-32 bg-gray-900 text-white z-10 -mx-5 active:bg-black active:scale-[0.98]'
          : 'w-14 h-48 bg-white text-gray-900 z-0 active:bg-gray-100 active:scale-[0.99]',
        isActive && (config.isBlack ? '!bg-gray-700' : '!bg-gray-200'),
        // Positioning tweaks for black keys could be handled by parent flex/grid, 
        // but standard piano layout usually does overlapping.
        // For MVP, simple flexbox with negative margins for black keys is a common trick.
      )}
      style={{
        // If it's a black key, we might need specific z-index handling or margin tricks in the parent.
        // Let's rely on the parent mapping to structure them, but here we style them.
      }}
    >
      <span className="text-xs font-bold opacity-50">{config.label}</span>
      <span className="text-[10px] opacity-30 mt-1">{config.note}</span>
    </button>
  );
};
