import { setSelectedInput } from "@/services/state";
import type { Input } from "webmidi";

type Props = {
	input: Input;
};

function MidiInput({ input }: Props) {
	function handleClick(input: Input) {
		setSelectedInput(input);
	}

	return (
		<>
			<p>
				<input
					type="button"
					onClick={(_event) => handleClick(input)}
					value="Select"
				/>{" "}
				Midi: {input.name}
			</p>
		</>
	);
}

export default MidiInput;
