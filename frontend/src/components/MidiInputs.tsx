import state, {
  setSelectedMidiInputId,
  setSelectedMidiInputChannel,
} from "@/services/state";
import { useSnapshot } from "valtio";
import { WebMidi } from "webmidi";

function MidiInputs() {
  const snap = useSnapshot(state);

  const deviceOptions = WebMidi.inputs.map((input) => {
    return (
      <option key={input.id} value={input.id}>
        {input.name}
      </option>
    );
  });

  const channelOptions = [...Array(16).keys()].map((n) => {
    const channel = n + 1;

    return (
      <option key={channel} value={channel}>
        {channel}
      </option>
    );
  });

  const handleDeviceOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedMidiInputId(event.target.value);
  };

  const handleDeviceChannelChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedMidiInputChannel(Number.parseInt(event.target.value));
  };

  if (deviceOptions.length === 0) {
    return <p>No available midi inputs found</p>;
  }

  if (!snap.selectedMidiInputId) {
    throw new Error("Expected midi input to be selected");
  }

  return (
    <>
      <div>
        <label htmlFor="selectedMidiInputId">Input device</label>
        <select
          id="selectedMidiInputId"
          value={snap.selectedMidiInputId}
          onChange={handleDeviceOptionChange}
        >
          {deviceOptions}
        </select>
      </div>
      <div>
        <label htmlFor="selectedMidiInputChannel">Channel</label>
        <select
          id="selectedMidiInputChannel"
          value={snap.selectedMidiInputChannel}
          onChange={handleDeviceChannelChange}
        >
          {channelOptions}
        </select>
      </div>
    </>
  );
}

export default MidiInputs;
