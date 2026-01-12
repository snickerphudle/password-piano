import * as Tone from 'tone';

let synth: Tone.PolySynth | null = null;

export const getSynth = () => {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle', // Softer sound than default square/sawtooth
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).toDestination();
  }
  return synth;
};

export const playNote = async (note: string) => {
  // Tone.start() must be called from a user gesture handler first
  // We'll assume the app handles the initial start on first click/keypress
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
  const s = getSynth();
  s.triggerAttackRelease(note, '8n');
};
