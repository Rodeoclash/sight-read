import { proxy } from "valtio";
import type { Input, NoteMessageEvent } from "webmidi";

type LessonItem = {
	duration: "q";
	played: boolean;
	value: string;
};

const state = proxy<{
	lesson: Array<LessonItem>;
	selectedInputId: null | string;
}>({
	// Need a way of generating these
	lesson: [
		{
			duration: "q",
			played: false,
			value: "C#5",
		},
		{
			duration: "q",
			played: false,
			value: "B4",
		},
		{
			duration: "q",
			played: false,
			value: "A4",
		},
		{
			duration: "q",
			played: false,
			value: "G#4",
		},
	],
	selectedInputId: null,
});

export function setSelectedInput(input: Input): undefined {
	state.selectedInputId = input.id;
}

export function playNote(event: NoteMessageEvent): undefined {
	const note = event.note;

	const lessonNote = (() => {
		if (note.accidental) {
			return `${note.name}${note.octave}${note.accidental}`;
		}

		return `${note.name}${note.octave}`;
	})();

	for (const [index, lessonItem] of state.lesson.entries()) {
		if (lessonItem.value === lessonNote) {
			console.log("=== match");
		}

		state.lesson[index] = {
			...lessonItem,
			played: lessonItem.value === lessonNote || lessonItem.played,
		};
	}
}

export default state;
