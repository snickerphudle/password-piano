export type Note = string;

export interface KeyConfig {
  note: Note;
  label: string; // Keyboard key (e.g., 'A')
  isBlack: boolean;
}

export const OCTAVE: KeyConfig[] = [
  { note: 'C4', label: 'A', isBlack: false },
  { note: 'C#4', label: 'W', isBlack: true },
  { note: 'D4', label: 'S', isBlack: false },
  { note: 'D#4', label: 'E', isBlack: true },
  { note: 'E4', label: 'D', isBlack: false },
  { note: 'F4', label: 'F', isBlack: false },
  { note: 'F#4', label: 'T', isBlack: true },
  { note: 'G4', label: 'G', isBlack: false },
  { note: 'G#4', label: 'Y', isBlack: true },
  { note: 'A4', label: 'H', isBlack: false },
  { note: 'A#4', label: 'U', isBlack: true },
  { note: 'B4', label: 'J', isBlack: false },
];

export const PASSWORD_MELODY: Note[] = ['C4', 'D4', 'E4', 'C4'];
