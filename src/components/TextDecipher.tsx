import React, { useEffect, useState, useRef } from 'react';

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

interface TextDecipherProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

export const TextDecipher: React.FC<TextDecipherProps> = ({ text, className, trigger = true }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trigger) return;
    
    let iteration = 0;
    
    // Previous settings: 
    // interval: 30ms
    // increment: 1/3 (0.33)
    // total time for 8 chars approx: (8 / 0.33) * 30ms = ~720ms
    
    // New settings to slow it down:
    // interval: 50ms
    // increment: 1/5 (0.2)
    // total time approx: (8 / 0.2) * 50ms = ~2000ms

    clearInterval(intervalRef.current!);

    intervalRef.current = setInterval(() => {
      setDisplayText((_prev) =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        setIsDone(true);
        clearInterval(intervalRef.current!);
      }

      iteration += 1 / 5; // Much slower reveal speed
    }, 50);

    return () => clearInterval(intervalRef.current!);
  }, [text, trigger]);

  return <span className={className}>{displayText}</span>;
};
