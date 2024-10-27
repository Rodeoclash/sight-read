import state, { playNote } from "@/services/state";
import React from "react";
import { subscribe, useSnapshot } from "valtio";
import { Vex } from "vexflow";
import { WebMidi } from "webmidi";

import MidiInputs from "@/components/MidiInputs";

import "./index.css";

import styles from "./App.module.css";

const { Factory } = Vex.Flow;

function App() {
	const el = React.useRef<HTMLDivElement | null>(null);
	const vf = React.useRef<InstanceType<typeof Factory> | null>(null);
	const [midiEnabled, setMidiEnabled] = React.useState<boolean | null>(null);
	const snap = useSnapshot(state);
	const width = snap.lesson.length * 75;

	// Web midi detection
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

	// Web midi listener
	React.useEffect(() => {
		if (!snap.selectedInputId) {
			return;
		}

		const selectedInput = WebMidi.inputs.find((input) => {
			return input.id === snap.selectedInputId;
		});

		if (!selectedInput) {
			return;
		}

		selectedInput.addListener(
			"noteon",
			(event) => {
				playNote(event);
			},
			{ channels: [1] },
		);
	}, [snap.selectedInputId]);

	// Vexflow render
	React.useEffect(
		() =>
			subscribe(state.lesson, () => {
				console.log("lesson changed", state.lesson);

				if (el.current === null || vf.current === null || !midiEnabled) {
					return;
				}

				el.current.innerHTML = "";

				vf.current = new Factory({
					// @ts-expect-error: We can pass an element here
					renderer: { elementId: el.current, width: width, height: 140 },
				});

				const score = vf.current.EasyScore();
				const system = vf.current.System({
					width: width, // Increased width to spread notes out more
				});

				const notesToRender = snap.lesson
					.map((lessonItem) => `${lessonItem.value}/${lessonItem.duration}`)
					.join(",");

				const notes = score.notes(notesToRender);

				for (const [index, lessonItem] of snap.lesson.entries()) {
					const note = notes[index];

					console.log(lessonItem);

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
			}),
		[width, snap.lesson, midiEnabled],
	);

	// Vexflow boot
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

		const notesToRender = snap.lesson
			.map((lessonItem) => `${lessonItem.value}/${lessonItem.duration}`)
			.join(",");

		const notes = score.notes(notesToRender);

		for (const [index, lessonItem] of snap.lesson.entries()) {
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
	}, [midiEnabled, snap.lesson, width]);

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
