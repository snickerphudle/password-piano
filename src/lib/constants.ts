export type Note = string;

export interface KeyConfig {
  note: Note;
  label: string; // Keyboard key (e.g., 'A')
  isBlack: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  hint: string;
  melody: Note[];
  keys: KeyConfig[];
}

// 2-octave keyboard → piano note mapping
// Lower octave = C4–B4
// Upper octave = C5–B5

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
  { note: 'A#5', label: '+', isBlack: true }, 
  { note: 'B5', label: '\\', isBlack: false },
];

export const HOME_KEYS: KeyConfig[] = [
  // C Arpeggio: C4, E4, G4, C5 mapped to P, L, A, Y
  // Visually 2 octaves (C4-B5) to be symmetrical/consistent with Game Mode
  
  // LOWER OCTAVE (C4)
  { note: 'C4', label: 'P', isBlack: false },
  { note: 'C#4', label: '', isBlack: true },
  { note: 'D4', label: '', isBlack: false },
  { note: 'D#4', label: '', isBlack: true },
  { note: 'E4', label: 'L', isBlack: false },
  { note: 'F4', label: '', isBlack: false },
  { note: 'F#4', label: '', isBlack: true },
  { note: 'G4', label: 'A', isBlack: false },
  { note: 'G#4', label: '', isBlack: true },
  { note: 'A4', label: '', isBlack: false },
  { note: 'A#4', label: '', isBlack: true },
  { note: 'B4', label: '', isBlack: false },

  // UPPER OCTAVE (C5)
  { note: 'C5', label: 'Y', isBlack: false },
  { note: 'C#5', label: '', isBlack: true },
  { note: 'D5', label: '', isBlack: false },
  { note: 'D#5', label: '', isBlack: true },
  { note: 'E5', label: '', isBlack: false },
  { note: 'F5', label: '', isBlack: false },
  { note: 'F#5', label: '', isBlack: true },
  { note: 'G5', label: '', isBlack: false },
  { note: 'G#5', label: '', isBlack: true },
  { note: 'A5', label: '', isBlack: false },
  { note: 'A#5', label: '', isBlack: true },
  { note: 'B5', label: '', isBlack: false },
];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Easy as ABC",
    hint: "The alphabet starts here...",
    // A, B, C mapping based on musical notation: A4, B4, C5
    // Note: In music, A-B-C usually refers to A, B, C notes.
    // A4 = 'H', B4 = 'J', C5 = 'K' in our keyboard mapping.
    melody: ['A4', 'B4', 'C5'], 
    keys: GAME_KEYS
  },
  {
    id: 2,
    name: "Darkness",
    hint: "Paint it black, from left to right...",
    // All black keys from left to right (C#4 to A#5)
    // C#4, D#4, F#4, G#4, A#4, C#5, D#5, F#5, G#5, A#5
    melody: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4', 'C#5', 'D#5', 'F#5', 'G#5', 'A#5'],
    keys: GAME_KEYS
  },
  {
    id: 3,
    name: "C Yourself on the Scale",
    hint: "Climb the ladder from C to shining C...",
    // C Major Scale: C4, D4, E4, F4, G4, A4, B4, C5
    melody: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    keys: GAME_KEYS
  }
];

export const PLAY_MELODY: Note[] = ['C4', 'E4', 'G4', 'C5'];
