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
	inputNotes: InputNotes;
	lesson: Lesson;
	midiEnabled: boolean | null;
	selectedMidiInputId: null | string;
	selectedMidiInputChannel: string;
	showingSettings: boolean;
}>({
	inputNotes: [],
	lesson: generateRandomLesson(),
	midiEnabled: null,
	selectedMidiInputId: null,
	selectedMidiInputChannel: "0",
	showingSettings: false,
});

export function setSelectedMidiInputId(id: string): void {
	state.selectedMidiInputId = id;
}

export function setSelectedMidiInputChannel(channel: string): void {
	state.selectedMidiInputChannel = channel;
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

export function setSettings(enabled: boolean): void {
	state.showingSettings = enabled;
}

export default state;
