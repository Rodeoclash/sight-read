import React from "react";
import { WebMidi } from "webmidi";

function MidiInputs() {
	React.useEffect(() => {
		console.log(WebMidi.inputs);
	}, []);

	return (
		<>
			<p>Midi inputs</p>
		</>
	);
}

export default MidiInputs;
