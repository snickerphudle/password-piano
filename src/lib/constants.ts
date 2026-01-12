export type Note = string;

export interface KeyConfig {
  note: Note;
  label: string; // Keyboard key (e.g., 'A')
  isBlack: boolean;
}

// 2-octave keyboard → piano note mapping
// Lower octave = C4–B4
// Upper octave = C5–B5

// We use this object to easily lookup note -> label for UI rendering
// And label -> note for event handling (though we can search the array too)
export const GAME_KEYS: KeyConfig[] = [
  // LOWER OCTAVE (C4)
  { note: 'C4', label: 'A', isBlack: false },
  { note: 'C#4', label: 'W', isBlack: true },
  { note: 'D4', label: 'S', isBlack: false },
  { note: 'D#4', label: 'E', isBlack: true },
  { note: 'E4', label: 'D', isBlack: false },
  { note: 'F4', label: 'F', isBlack: false },
  { note: 'F#4', label: 'T', isBlack: true },
  { note: 'G4', label: 'SPACE', isBlack: false }, 
  { note: 'G#4', label: 'Y', isBlack: true },
  { note: 'A4', label: 'H', isBlack: false },
  { note: 'A#4', label: 'U', isBlack: true },
  { note: 'B4', label: 'J', isBlack: false },

  // UPPER OCTAVE (C5)
  { note: 'C5', label: 'K', isBlack: false },
  { note: 'C#5', label: 'I', isBlack: true },
  { note: 'D5', label: 'L', isBlack: false },
  { note: 'D#5', label: 'O', isBlack: true },
  { note: 'E5', label: ';', isBlack: false },
  { note: 'F5', label: "'", isBlack: false },
  { note: 'F#5', label: 'P', isBlack: true },
  { note: 'G5', label: '[', isBlack: false },
  { note: 'G#5', label: ']', isBlack: true },
  { note: 'A5', label: 'Enter', isBlack: false },
  { note: 'A#5', label: '', isBlack: true }, 
  { note: 'B5', label: '\\', isBlack: false },
];

export const HOME_KEYS: KeyConfig[] = [
  // C Arpeggio: C4, E4, G4, C5
  // Mapped to P, L, A, Y
  { note: 'C4', label: 'P', isBlack: false },
  { note: 'E4', label: 'L', isBlack: false },
  { note: 'G4', label: 'A', isBlack: false },
  { note: 'C5', label: 'Y', isBlack: false },
];

// Default to GAME_KEYS for backward compatibility if needed, but we'll dynamic switch
export const PIANO_KEYS = GAME_KEYS;

export const PASSWORD_MELODY: Note[] = ['C4', 'D4', 'E4', 'C4'];
export const PLAY_MELODY: Note[] = ['C4', 'E4', 'G4', 'C5'];
