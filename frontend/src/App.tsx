import { buildSampler, playNote, stopNote } from "@/services/audio";
import state, {
	storeNote,
	setSelectedMidiInputId,
	setMidiEnabled,
	setSettings,
	setNoteOn,
	setNoteOff,
} from "@/services/state";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import React from "react";
import { subscribe, useSnapshot } from "valtio";
import { WebMidi } from "webmidi";
import { render } from "./services/stave";

import "./index.css";

import type * as Tone from "tone";
import styles from "./App.module.css";
import Logo from "./components/Logo";
import Settings from "./components/Settings";

function App() {
	const el = React.useRef<HTMLDivElement | null>(null);
	const [startInteraction, setStartInteraction] =
		React.useState<boolean>(false);
	const [sampler, setSampler] = React.useState<Tone.Sampler | null>(null);
	const snap = useSnapshot(state);

	function handleShowSettings() {
		setSettings(true);
	}

	async function handleStartInteraction() {
		setStartInteraction(true);
		const sampler = await buildSampler();
		setSampler(sampler);
	}

	// Web midi detection
	React.useEffect(() => {
		(async () => {
			try {
				await WebMidi.enable();
				setMidiEnabled(true);

				if (WebMidi.inputs[0]) {
					setSelectedMidiInputId(WebMidi.inputs[0].id); // default to first midi device
				}
			} catch (err) {
				console.error(err);
				setMidiEnabled(false);
			}
		})();
	}, []);

	// Web midi listener
	React.useEffect(() => {
		if (!snap.selectedMidiInputId || sampler === null) {
			return;
		}

		const selectedInput = WebMidi.inputs.find((input) => {
			return input.id === snap.selectedMidiInputId;
		});

		if (!selectedInput) {
			return;
		}

		selectedInput.addListener(
			"noteon",
			(event) => {
				setNoteOn(event.note);
				storeNote(event);
				playNote(sampler, event);
			},
			{ channels: [snap.selectedMidiInputChannel] },
		);

		selectedInput.addListener(
			"noteoff",
			(event) => {
				setNoteOff(event.note);
				stopNote(sampler, event);
			},
			{ channels: [snap.selectedMidiInputChannel] },
		);
	}, [snap.selectedMidiInputId, snap.selectedMidiInputChannel, sampler]);

	// Vexflow boot
	React.useEffect(() => {
		if (el.current === null || startInteraction === false) {
			return;
		}

		render(el.current, snap);
	}, [snap, startInteraction]);

	// Vexflow update
	React.useEffect(
		() =>
			subscribe(state.lesson, () => {
				if (el.current === null) {
					return;
				}

				render(el.current, snap);
			}),
		[snap],
	);

	if (snap.midiEnabled === null) {
		return <main className={styles.splash}>Finding midi...</main>;
	}

	if (snap.midiEnabled === false) {
		return <main className={styles.splash}>Midi not enabled</main>;
	}

	if (startInteraction === false) {
		return (
			<main className={styles.splash}>
				<Logo />
				<input onClick={handleStartInteraction} type="button" value="Start" />
			</main>
		);
	}

	return (
		<main className={styles.main}>
			<header className={styles.header}>
				<div className={styles.settings}>
					<button type="button" onClick={handleShowSettings}>
						<Cog6ToothIcon width={24} />
					</button>
				</div>
				<Logo />
			</header>

			<div className={styles.lesson}>
				<div ref={el} className={styles.card} />
			</div>

			{snap.showingSettings === true && <Settings />}
		</main>
	);
}

export default App;
