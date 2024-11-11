import { proxy } from "valtio";
import type { Note, NoteMessageEvent } from "webmidi";
import { generateRandomLesson } from "./lessons";

type LessonItem = {
	duration: "q";
	value: string;
};

export type Lesson = Array<LessonItem>;
export type InputNotes = Array<Note>;

function webMidiNoteToLesson(
	name: string,
	octave: number,
	accidental = "",
): string {
	return `${name}${accidental}${octave}`;
}

const state = proxy<{
	currentNote: Note | null;
	inputNotes: InputNotes;
	lesson: Lesson;
	midiEnabled: boolean | null;
	selectedMidiInputId: null | string;
	selectedMidiInputChannel: number;
	showingSettings: boolean;

	readonly lessonCorrectNotes: number;
}>({
	currentNote: null,
	inputNotes: [],
	lesson: generateRandomLesson(),
	midiEnabled: null,
	selectedMidiInputId: null,
	selectedMidiInputChannel: 1,
	showingSettings: false,

	/**
	 * How many notes are correct in the current lesson
	 */
	get lessonCorrectNotes() {
		let correctNotes = 0;

		for (
			let i = 0;
			i < state.inputNotes.length && correctNotes < state.lesson.length;
			i++
		) {
			const inputNote = this.inputNotes[i];
			const expectedNote = this.lesson[correctNotes];

			if (
				webMidiNoteToLesson(
					inputNote.name,
					inputNote.octave,
					inputNote.accidental,
				) === expectedNote.value
			) {
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

	if (state.lessonCorrectNotes === state.lesson.length) {
		nextLesson();
	}
}

export function nextLesson(): void {
	state.inputNotes = [];
	state.lesson = generateRandomLesson();
}

export function setMidiEnabled(enabled: boolean): void {
	state.midiEnabled = enabled;
}

export function setSettings(enabled: boolean): void {
	state.showingSettings = enabled;
}

export function setCurrentNote(note: Note | null): void {
	state.currentNote = note;
}

export default state;
