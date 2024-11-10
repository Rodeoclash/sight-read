import MidiInputs from "@/components/MidiInputs";
import { setSettings } from "@/services/state";

import styles from "./Settings.module.css";

function Settings() {
	const handleClick = () => {
		setSettings(false);
	};

	return (
		<div className={styles.root}>
			<div className={styles.inner}>
				<h2 className={styles.header}>Settings</h2>
				<h3 className={styles.subHeader}>Midi input</h3>
				<div className={styles.section}>
					<MidiInputs />
				</div>
				<div className={styles.controls}>
					<input onClick={handleClick} type="button" value="Close" />
				</div>
			</div>
		</div>
	);
}

export default Settings;
