import React from "react";
import { Vex } from "vexflow";

import "./index.css";

import styles from "./App.module.css";

console.log(styles);

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

	React.useEffect(() => {
		if (el.current === null || vf.current !== null) {
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
				fillStyle:
					lessonItem.played === false
						? "rgba(0, 0, 0, 1)"
						: "rgba(0, 0, 0, 0.5)",
				strokeStyle:
					lessonItem.played === false
						? "rgba(0, 0, 0, 1)"
						: "rgba(0, 0, 0, 0.5)",
			});
		}

		system
			.addStave({
				voices: [score.voice(notes)],
			})
			.addClef("treble")
			.addTimeSignature("4/4");

		vf.current.draw();
	}, []);

	return (
		<>
			<div ref={el} className={styles.card} />
		</>
	);
}

export default App;
