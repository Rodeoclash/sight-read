import React from "react";
import { Vex } from "vexflow";
import { WebMidi } from "webmidi";

import MidiInputs from "@/components/MidiInputs";

import "./index.css";

import styles from "./App.module.css";

const { Factory } = Vex.Flow;

// Need a way of generating these
const lessonItems = [
	{
		value: "C#5/q",
		played: true,
	},
	{
		value: "B4/q",
		played: true,
	},
	{
		value: "A4/q",
		played: false,
	},
	{
		value: "G#4/q",
		played: false,
	},
];

const width = lessonItems.length * 75;

function App() {
	const el = React.useRef<HTMLDivElement | null>(null);
	const vf = React.useRef<InstanceType<typeof Factory> | null>(null);
	const [midiEnabled, setMidiEnabled] = React.useState<boolean | null>(null);

	// Web midi
	React.useEffect(() => {
		(async () => {
			try {
				await WebMidi.enable();
				setMidiEnabled(true);
			} catch (err) {
				alert(err);
				setMidiEnabled(false);
			}
		})();
	}, []);

	// Vexflow
	React.useEffect(() => {
		if (el.current === null || vf.current !== null || !midiEnabled) {
			return;
		}

		el.current.style.width = `${width + 10}px`;

		vf.current = new Factory({
			// @ts-expect-error: We can pass an element here
			renderer: { elementId: el.current, width: width, height: 140 },
		});

		const score = vf.current.EasyScore();
		const system = vf.current.System({
			width: width, // Increased width to spread notes out more
		});

		const notesToRender = lessonItems
			.map((lessonItem) => lessonItem.value)
			.join(",");

		const notes = score.notes(notesToRender);

		for (const [index, lessonItem] of lessonItems.entries()) {
			const note = notes[index];

			note.setStyle({
				fillStyle: lessonItem.played === false ? "#000" : "#666",
				strokeStyle: lessonItem.played === false ? "#000" : "#666",
			});
		}

		system
			.addStave({
				voices: [score.voice(notes)],
			})
			.addClef("treble")
			.addTimeSignature("4/4");

		vf.current.draw();
	}, [midiEnabled]);

	if (midiEnabled === null) {
		return <p>Determine if midi enabled</p>;
	}

	if (midiEnabled === false) {
		return <p>Midi not enabled</p>;
	}

	return (
		<>
			<MidiInputs />
			<div ref={el} className={styles.card} />
		</>
	);
}

export default App;
