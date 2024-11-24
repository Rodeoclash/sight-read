import type State from "@/services/state";
import type { useSnapshot } from "valtio";

type LessonItem = {
  duration: "q";
  value: string;
};

export type Lesson = Array<LessonItem>;
type SnapshotState = ReturnType<typeof useSnapshot<typeof State>>;

// This should be replaced with AI generated melodies
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function generateRandomLesson(state: SnapshotState): Lesson {
  const lesson: Lesson = [];

  // Generate 4 random notes
  for (let i = 0; i < 4; i++) {
    const noteIndex = Math.floor(Math.random() * notes.length);

    lesson.push({
      duration: "q",
      value: `${notes[noteIndex]}${state.middleCOctave}`,
    });
  }

  return lesson;
}
