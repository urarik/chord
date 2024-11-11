export class ChordDirection {
    type: ChordDirection.Type;
    finger: number;
    fret: number;
    lines: number[];

    constructor(type: ChordDirection.Type, finger: number, fret: number, lines: number[]) {
        this.type = type;
        this.finger = finger;
        this.fret = fret;
        this.lines = lines;
    }
}

export namespace ChordDirection {
    export enum Type {
        FINGER,
        MUTE
    }
}

