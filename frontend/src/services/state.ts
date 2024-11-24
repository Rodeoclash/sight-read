import { proxy } from "valtio";
import type { Note, NoteMessageEvent } from "webmidi";
import { generateRandomLesson } from "./lessons";

type LessonItem = {
  duration: "q";
  value: string;
};

export type Lesson = Array<LessonItem>;
export type InputNotes = Array<Note>;

const state = proxy<{
  completedLessons: number;
  inputNotes: InputNotes;
  lesson: Lesson | null;
  middleCOctave: number;
  midiEnabled: boolean | null;
  notesOn: { [key: string]: Note | null };
  readonly lessonCorrectNotes: number;
  selectedMidiInputChannel: number;
  selectedMidiInputId: null | string;
  showingSettings: boolean;
}>({
  completedLessons: 0,
  inputNotes: [],
  lesson: null,
  middleCOctave: 4,
  midiEnabled: null,
  notesOn: {},
  selectedMidiInputChannel: 1,
  selectedMidiInputId: null,
  showingSettings: false,

  /**
   * How many notes are correct in the current lesson
   */
  get lessonCorrectNotes() {
    if (this.lesson === null) {
      return 0;
    }

    let correctNotes = 0;

    for (
      let i = 0;
      i < state.inputNotes.length && correctNotes < this.lesson.length;
      i++
    ) {
      const inputNote = this.inputNotes[i];
      const expectedNote = this.lesson[correctNotes];

      if (inputNote.identifier === expectedNote.value) {
        correctNotes++;
      }
    }

    return correctNotes;
  },
});

export function setSelectedMidiInputId(id: string): void {
  state.selectedMidiInputId = id;
}

export function setSelectedMidiInputChannel(channel: number): void {
  state.selectedMidiInputChannel = channel;
}

export function storeNote(event: NoteMessageEvent): void {
  state.inputNotes.push(event.note);

  if (state.lesson === null) {
    return;
  }

  if (state.lessonCorrectNotes === state.lesson.length) {
    nextLesson();
  }
}

export function resetLesson(): void {
  state.inputNotes = [];
  state.lesson = generateRandomLesson(state);
}

export function nextLesson(): void {
  resetLesson();
  state.completedLessons = state.completedLessons + 1;
}

export function setMidiEnabled(enabled: boolean): void {
  state.midiEnabled = enabled;
}

export function setShowingSettings(enabled: boolean): void {
  state.showingSettings = enabled;
}

export function setMiddleCOctave(octave: number): void {
  state.middleCOctave = octave;
}

export function setNoteOn(note: Note): void {
  state.notesOn[note.identifier] = note;
}

export function setNoteOff(note: Note): void {
  state.notesOn[note.identifier] = null;
}

export default state;
