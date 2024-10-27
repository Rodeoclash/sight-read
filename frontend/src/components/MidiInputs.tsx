import MidiInput from "@/components/MidiInput";
import state, { setSelectedInput } from "@/services/state";
import React from "react";
import { useSnapshot } from "valtio";
import { WebMidi } from "webmidi";

function MidiInputs() {
	const snap = useSnapshot(state);

	const inputs = WebMidi.inputs.map((input) => {
		return <MidiInput key={input.name} input={input} />;
	});

	const selectedInput = WebMidi.inputs.find((input) => {
		return input.id === snap.selectedInputId;
	});

	// Set first midi input as default
	React.useEffect(() => {
		if (!selectedInput && WebMidi.inputs.length > 0) {
			setSelectedInput(WebMidi.inputs[0]);
		}
	}, [selectedInput]);

	return (
		<div>
			<h1>Available midi inputs</h1>
			{inputs}
			{selectedInput && (
				<>
					<h1>Selected midi input</h1>
					<p>{selectedInput.name}</p>
				</>
			)}
		</div>
	);
}

export default MidiInputs;
