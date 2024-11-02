import { buildSampler, playNote } from "@/services/audio";
import state, { storeNote, setSelectedInput } from "@/services/state";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import React from "react";
import { subscribe, useSnapshot } from "valtio";
import { WebMidi } from "webmidi";
import { render } from "./services/stave";

import MidiInputs from "@/components/MidiInputs";

import "./index.css";

import type * as Tone from "tone";
import styles from "./App.module.css";

function App() {
	const el = React.useRef<HTMLDivElement | null>(null);
	const [startInteraction, setStartInteraction] =
		React.useState<boolean>(false);
	const [midiEnabled, setMidiEnabled] = React.useState<boolean | null>(null);
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
				setSelectedInput(WebMidi.inputs[0]); // default to first midi device
				setMidiEnabled(true);
			} catch (err) {
				alert(err);
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

	if (midiEnabled === null) {
		return <p>Determine if midi enabled</p>;
	}

	if (midiEnabled === false) {
		return <p>Midi not enabled</p>;
	}

	if (startInteraction === false) {
		return (
			<p>
				<input onClick={handleStartInteraction} type="button" value="Start" />
			</p>
		);
	}

	return (
		<>
			<div className={styles.settings}>
				<Cog6ToothIcon width={24} onClick={handleToggleSettings} />
				{showSettings === true && <MidiInputs />}
			</div>
			<div ref={el} className={styles.card} />
		</>
	);
}

export default App;
