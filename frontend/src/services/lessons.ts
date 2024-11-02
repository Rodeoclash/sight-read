type LessonItem = {
	duration: "q";
	value: string;
};

export type Lesson = Array<LessonItem>;

const lessons: Array<Lesson> = [
	[
		{
			duration: "q",
			value: "C#5",
		},
		{
			duration: "q",
			value: "C#5",
		},
		{
			duration: "q",
			value: "C#5",
		},
		{
			duration: "q",
			value: "G#4",
		},
	],
];

export function getRandomLesson() {
	return lessons[0];
}

// This should be replaced with AI generated melodies
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const octaves = ["4", "5"];

export function generateRandomLesson(): Lesson {
	const lesson: Lesson = [];

	// Generate 4 random notes
	for (let i = 0; i < 4; i++) {
		const noteIndex = Math.floor(Math.random() * notes.length);
		const octave = octaves[Math.floor(Math.random() * octaves.length)];

		lesson.push({
			duration: "q",
			value: `${notes[noteIndex]}${octave}`,
		});
	}

	return lesson;
}
