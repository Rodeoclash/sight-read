import type State from "@/services/state";
import type { useSnapshot } from "valtio";
import type { EasyScore, StemmableNote } from "vexflow";
import { Vex } from "vexflow";

const { Factory, Modifier } = Vex.Flow;

type SnapshotState = ReturnType<typeof useSnapshot<typeof State>>;

// Create a custom modifier that adds a ghost note
class GhostNoteModifier extends Modifier {
  private ghostNote: StemmableNote;
  private readonly ghostStyle = "rgba(156, 163, 175, 1)";

  constructor(noteSpec: string, score: EasyScore) {
    super();
    // Create the ghost note when the modifier is constructed
    this.ghostNote = score.notes(noteSpec)[0];

    // Style the ghost note and its components
    this.ghostNote.setStyle({
      fillStyle: this.ghostStyle,
      strokeStyle: this.ghostStyle,
    });
  }

  draw() {
    const ctx = this.checkContext();
    const note = this.note;

    if (!ctx || !note) return;

    const stave = note.getStave();

    if (!stave) return;

    // Save current context state
    ctx.save();

    // Copy position and context from the parent note
    this.ghostNote.setContext(ctx);
    this.ghostNote.setStave(stave);

    // Important: Set up the tick context
    if (note.getTickContext()) {
      this.ghostNote.setTickContext(note.getTickContext());
      this.ghostNote.preFormat();
    }

    // Position the ghost note at the same X coordinate as the parent note
    const noteX = note.getAbsoluteX();
    this.ghostNote.setXShift(noteX - this.ghostNote.getAbsoluteX());

    // Draw the ghost note
    this.ghostNote.draw();

    // Restore context
    ctx.restore();
  }
}

export function render(el: HTMLDivElement, state: SnapshotState) {
  // Clear any existing content
  el.innerHTML = "";

  // Calculate the width based on the items in the lesson
  const width = state.lesson.length * 75;
  el.style.width = `${width + 10}px`;

  const vexFlow = new Factory({
    // @ts-expect-error: We can pass an element here
    renderer: { elementId: el, width: width, height: 140 },
  });

  const score = vexFlow.EasyScore();
  const system = vexFlow.System({
    width: width,
  });

  const notesToRender = state.lesson
    .map((lessonItem) => {
      return `${lessonItem.value}/${lessonItem.duration}`;
    })
    .join(",");

  const notes = score.notes(notesToRender);

  for (let i = 0; i < state.lessonCorrectNotes; i++) {
    notes[i].setStyle({
      fillStyle: "#15803d",
      strokeStyle: "#15803d",
    });
  }

  for (const [_noteIdentifier, note] of Object.entries(state.notesOn)) {
    if (note) {
      notes[state.lessonCorrectNotes].addModifier(
        new GhostNoteModifier(`${note.identifier}/q`, score),
      );
    }
  }

  system
    .addStave({
      voices: [score.voice(notes)],
    })
    .addClef("treble")
    .addTimeSignature("4/4");

  vexFlow.draw();
}
