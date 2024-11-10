import { buildSampler, playNote } from "@/services/audio";
import state, {
	storeNote,
	setSelectedInput,
	setMidiEnabled,
} from "@/services/state";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import React from "react";
import { subscribe, useSnapshot } from "valtio";
import { WebMidi } from "webmidi";
import { render } from "./services/stave";

import MidiInputs from "@/components/MidiInputs";

import "./index.css";

import type * as Tone from "tone";
import styles from "./App.module.css";
import Logo from "./components/Logo";

function App() {
	const el = React.useRef<HTMLDivElement | null>(null);
	const [startInteraction, setStartInteraction] =
		React.useState<boolean>(false);
	const [showSettings, setShowSettings] = React.useState<boolean>(false);
	const [sampler, setSampler] = React.useState<Tone.Sampler | null>(null);
	const snap = useSnapshot(state);

	function handleToggleSettings() {
		setShowSettings(!showSettings);
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
					setSelectedInput(WebMidi.inputs[0]); // default to first midi device
				}
			} catch (err) {
				console.error(err);
				setMidiEnabled(false);
			}
		})();
	}, []);

	// Web midi listener
	React.useEffect(() => {
		if (!snap.selectedInputId || sampler === null) {
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
				storeNote(event);
				playNote(sampler, event);
			},
			{ channels: [1] },
		);
	}, [snap.selectedInputId, sampler]);

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
		return <main className={styles.splash}>Determine if midi enabled</main>;
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
					<button type="button" onClick={handleToggleSettings}>
						<Cog6ToothIcon width={24} />
					</button>
					{showSettings === true && <MidiInputs />}
				</div>
				<Logo />
			</header>

			<div className={styles.lesson}>
				<div ref={el} className={styles.card} />
			</div>
		</main>
	);
}

export default App;
