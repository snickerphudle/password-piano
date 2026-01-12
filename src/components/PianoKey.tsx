import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  x: number;
  y: number;
  style: React.CSSProperties;
}

// A pleasant, slightly pastel rainbow palette
const NICE_RAINBOW = [
  '#ff6b6b', // Soft Red
  '#feca57', // Warm Yellow/Orange
  '#48dbfb', // Bright Blue
  '#ff9ff3', // Pink
  '#54a0ff', // Royal Blue
  '#5f27cd', // Purple
  '#1dd1a1', // Teal/Green
];

export const PianoKey: React.FC<PianoKeyProps> = ({ config, isActive, onPlay, lastInteraction }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastProcessedId = useRef<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // We need to mount the portal container once
  // In Next.js App Router, we can just use document.body or a specific root div
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lastInteraction && lastInteraction.note === config.note && lastInteraction.id > lastProcessedId.current) {
      lastProcessedId.current = lastInteraction.id;
      
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const randomX = Math.floor(Math.random() * 80 - 40); // -40px to 40px
      const randomRot = Math.floor(Math.random() * 60 - 30); // -30deg to 30deg

      const newParticle: Particle = {
        id: lastInteraction.id,
        type: lastInteraction.status,
        color: lastInteraction.status === 'correct' 
          ? NICE_RAINBOW[Math.floor(Math.random() * NICE_RAINBOW.length)]
          : '#333',
        // Calculate exact screen position to spawn from
        x: rect.left + rect.width / 2,
        y: rect.bottom - 40, // Start slightly up from the bottom of the key
        style: {
          '--tx': `${randomX}px`,
          '--rot': `${randomRot}deg`,
        } as React.CSSProperties
      };

      setParticles(prev => [...prev, newParticle]);

      // Cleanup particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1500);
    }
  }, [lastInteraction, config.note]);

  return (
    <>
      <button
        ref={buttonRef}
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
      </button>

      {/* Render Particles via Portal to escape z-index hell */}
      {mounted && particles.length > 0 && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className={clsx(
                'absolute text-3xl font-bold drop-shadow-md flex items-center justify-center will-change-transform',
                p.type === 'correct' ? 'animate-float-up' : 'animate-shake-drop'
              )}
              style={{ 
                left: p.x,
                top: p.y,
                color: p.color,
                ...p.style 
              }}
            >
              <span style={{ fontFamily: 'Arial, sans-serif' }}>
                {p.type === 'correct' ? '♪' : '♯'}
              </span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};
