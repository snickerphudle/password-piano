import React, { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';
import { KeyConfig } from '@/lib/constants';
import { InteractionEvent } from '@/hooks/usePiano';

interface PianoKeyProps {
  config: KeyConfig;
  isActive: boolean;
  onPlay: (note: string) => void;
  lastInteraction: InteractionEvent | null;
}

interface Particle {
  id: number;
  type: 'correct' | 'wrong';
  color: string;
  style: React.CSSProperties;
}

export const PianoKey: React.FC<PianoKeyProps> = ({ config, isActive, onPlay, lastInteraction }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastProcessedId = useRef<number>(0);

  useEffect(() => {
    if (lastInteraction && lastInteraction.note === config.note && lastInteraction.id > lastProcessedId.current) {
      lastProcessedId.current = lastInteraction.id;
      
      const randomX = Math.floor(Math.random() * 80 - 40); // -40px to 40px
      const randomRot = Math.floor(Math.random() * 60 - 30); // -30deg to 30deg

      const newParticle: Particle = {
        id: lastInteraction.id,
        type: lastInteraction.status,
        color: lastInteraction.status === 'correct' 
          ? `hsl(${Math.random() * 360}, 100%, 65%)` // Brighter colors
          : '#333',
        style: {
          '--tx': `${randomX}px`,
          '--rot': `${randomRot}deg`,
        } as React.CSSProperties
      };

      setParticles(prev => [...prev, newParticle]);

      // Cleanup particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1500); // Slightly longer cleanup to match animation duration
    }
  }, [lastInteraction, config.note]);

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
      )}
    >
      <span className="text-xs font-bold opacity-50">{config.label}</span>
      <span className="text-[10px] opacity-30 mt-1">{config.note}</span>

      {/* Visual Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={clsx(
            'absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-50 text-3xl font-bold drop-shadow-md flex items-center justify-center',
            p.type === 'correct' ? 'animate-float-up' : 'animate-shake-drop'
          )}
          style={{ 
            color: p.color,
            ...p.style 
          }}
        >
          {/* Explicitly using a span with a standard font to prevent box-rendering issues on some systems */}
          <span style={{ fontFamily: 'Arial, sans-serif' }}>
            {p.type === 'correct' ? '♪' : '♯'}
          </span>
        </div>
      ))}
    </button>
  );
};
