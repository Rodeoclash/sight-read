import MidiInputs from "@/components/MidiInputs";
import state, {
  setShowingSettings,
  setMiddleCOctave,
  resetLesson,
} from "@/services/state";
import { useSnapshot } from "valtio";

import type React from "react";
import styles from "./Settings.module.css";

function Settings() {
  const snap = useSnapshot(state);

  const handleClickCloseSettings = () => {
    setShowingSettings(false);
  };

  const handleChangeMiddleCOctave = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setMiddleCOctave(Number.parseInt(event.target.value, 10));
    resetLesson();
  };

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <h2 className={styles.header}>Settings</h2>

        <h3 className={styles.subHeader}>Midi input</h3>
        <div className={styles.section}>
          <MidiInputs />
        </div>

        <h3 className={styles.subHeader}>Middle C location</h3>
        <div className={styles.section}>
          <select
            value={snap.middleCOctave}
            onChange={handleChangeMiddleCOctave}
          >
            <option value={2}>C2</option>
            <option value={3}>C3</option>
            <option value={4}>C4</option>
            <option value={5}>C5</option>
          </select>
        </div>

        <div className={styles.controls}>
          <input
            onClick={handleClickCloseSettings}
            type="button"
            value="Close"
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;
