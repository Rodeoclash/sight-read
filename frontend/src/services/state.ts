import { proxy } from "valtio";
import type { Input, Note, NoteMessageEvent } from "webmidi";
import { generateRandomLesson } from "./lessons";

type LessonItem = {
	duration: "q";
	value: string;
};

export type Lesson = Array<LessonItem>;
export type InputNotes = Array<Note>;

const state = proxy<{
	inputNotes: InputNotes;
	lesson: Lesson;
	midiEnabled: boolean | null;
	selectedInputId: null | string;
}>({
	inputNotes: [],
	lesson: generateRandomLesson(),
	midiEnabled: null,
	selectedInputId: null,
});

export function setSelectedInput(input: Input): void {
	state.selectedInputId = input.id;
}

export function storeNote(event: NoteMessageEvent): void {
	state.inputNotes.push(event.note);
}

export function nextLesson(): void {
	state.inputNotes = [];
	state.lesson = generateRandomLesson();
}

export function setMidiEnabled(enabled: boolean): void {
	state.midiEnabled = enabled;
}

export default state;
