import EventEmitter from "eventemitter3";

export const LESSON_ENDED = "LESSON_ENDED";

class Bus extends EventEmitter {}
export const bus = new Bus();
