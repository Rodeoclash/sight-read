export function webMidiNoteToName(
  name: string,
  octave: number,
  accidental = "",
): string {
  return `${name}${accidental}${octave}`;
}
