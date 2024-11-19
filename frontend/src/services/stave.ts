import type State from "@/services/state";
import { webMidiNoteToLesson } from "@/services/state";

import type { useSnapshot } from "valtio";
import { Vex } from "vexflow";

const { Factory } = Vex.Flow;

type SnapshotState = ReturnType<typeof useSnapshot<typeof State>>;

export function render(el: HTMLDivElement, state: SnapshotState) {
	const currentNote = state.currentNote;

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
		.map((lessonItem, i) => {
			if (i === state.lessonCorrectNotes && currentNote) {
				const playedNote = webMidiNoteToLesson(
					currentNote.name,
					currentNote.octave,
					currentNote.accidental,
				);

				return `(${lessonItem.value} ${playedNote})/${lessonItem.duration}`;
			}

			return `${lessonItem.value}/${lessonItem.duration}`;
		})
		.join(",");

	const notes = score.notes(notesToRender);

	for (let i = 0; i < state.lessonCorrectNotes; i++) {
		notes[i].setStyle({
			fillStyle: "#15803d",
			strokeStyle: "#15803d",
		});
	}

	console.log(notes[0]);

	system
		.addStave({
			voices: [score.voice(notes)],
		})
		.addClef("treble")
		.addTimeSignature("4/4");

	vexFlow.draw();
}
