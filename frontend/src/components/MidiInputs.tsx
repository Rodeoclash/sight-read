import MidiInput from "@/components/MidiInput";
import state from "@/services/state";
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
