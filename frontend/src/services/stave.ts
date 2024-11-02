import type State from "@/services/state";
import { nextLesson } from "@/services/state";

import type { useSnapshot } from "valtio";
import { Vex } from "vexflow";

const { Factory } = Vex.Flow;

type SnapshotState = ReturnType<typeof useSnapshot<typeof State>>;

function webMidiNoteToLesson(
	name: string,
	octave: number,
	accidental = "",
): string {
	return `${name}${accidental}${octave}`;
}

export function render(el: HTMLDivElement, state: SnapshotState) {
	// Clear any existing content
	el.innerHTML = "";

	// Calculate the width based on the items in the lesson
	const width = state.lesson.length * 75;
	el.style.width = `${width + 10}px`;

	const vexFlow = new Factory({
		// @ts-expect-error: We can pass an element here
		renderer: { elementId: el, width: width, height: 140 },
	});

	const score = vexFlow.EasyScore();
	const system = vexFlow.System({
		width: width,
	});

	const notesToRender = state.lesson
		.map((lessonItem) => `${lessonItem.value}/${lessonItem.duration}`)
		.join(",");

	const notes = score.notes(notesToRender);

	// Find how many notes have been correctly played in sequence
	let correctNotes = 0;
	for (
		let i = 0;
		i < state.inputNotes.length && correctNotes < state.lesson.length;
		i++
	) {
		const inputNote = state.inputNotes[i];
		const expectedNote = state.lesson[correctNotes];

		if (
			webMidiNoteToLesson(
				inputNote.name,
				inputNote.octave,
				inputNote.accidental,
			) === expectedNote.value
		) {
			notes[correctNotes].setStyle({
				fillStyle: "#15803d",
				strokeStyle: "#15803d",
			});
			correctNotes++;
		}
	}

	if (correctNotes === state.lesson.length) {
		nextLesson();
	}

	system
		.addStave({
			voices: [score.voice(notes)],
		})
		.addClef("treble")
		.addTimeSignature("4/4");

	vexFlow.draw();
}
