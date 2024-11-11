import { ChordDirection } from "./ChordDirection";

const get = (finger: number, fret: number, lines: number[]): ChordDirection => {
    return new ChordDirection (
        ChordDirection.Type.FINGER,
        finger,
        fret,
        lines
    )
}

interface Form {
    [key: string]: ChordDirection[] | undefined
}

const formsStaringFirst: Form = {
    "": [
        get(1, 1, [1, 2, 4, 5, 6]),
        get(2, 2, [4]),
        get(3, 3, [3]),
        get(4, 3, [2])
    ],
    "M": [
        get(1, 1, [1, 2, 4, 5, 6]),
        get(2, 2, [4]),
        get(3, 3, [3]),
        get(4, 3, [2])
    ],
    "M7": [
        get(1, 1, [1]),
        get(2, 1, [5]),
        get(3, 2, [3]),
        get(4, 2, [4])
    ],
    "m7": [
        get(2, 1, [1]),
        get(3, 1, [3, 4, 5])
    ],
    "m": [
        get(1, 1, [1, 2, 4, 5, 6]),
        get(3, 3, [3]),
        get(4, 3, [2])
    ],
    "7": [
        get(1, 1, [1, 2, 4, 5, 6]),
        get(2, 2, [4]),
        get(4, 3, [2])
    ]
}
const formsStaringSecond: Form = {
    "": [
        get(1, 1, [2, 3, 4, 5, 6]),
        get(2, 3, [3, 4, 5])
    ],
    "M": [
        get(1, 1, [2, 3, 4, 5, 6]),
        get(2, 3, [3, 4, 5])
    ],
    "M7": [
        get(1, 1, [2, 3, 4, 5, 6]),
        get(2, 2, [4]),
        get(3, 3, [3]),
        get(4, 3, [5])
    ],
    "m7": [
        get(1, 1, [2, 3, 4, 5, 6]),
        get(2, 2, [5]),
        get(3, 3, [3])
    ],
    "m": [
        get(1, 1, [2, 3, 4, 5, 6]),
        get(2, 2, [5]),
        get(3, 3, [4]),
        get(4, 3, [3])
    ],
    "7": [
        get(1, 1, [2, 3, 4, 5, 6]),
        get(3, 3, [3]),
        get(4, 3, [5])
    ]
}

const firstNotes = ["F", ["F#", "Gb"], "G", ["G#", "Ab"], "A", ["A#", "Bb"], "B", "C", ["C#", "Db"], "D"];
const secondNotes = [["A#", "Bb"], "B", "C", ["C#", "Db"], "D", ["D#", "Eb"], "E", "F", ["F#", "Gb"], "G"];

export const getChordsDirections = (chord: string): ChordDirection[][] => {
    const [root, rest] = getStructuredChord(chord);
    const formStaringFirst: ChordDirection[] = formsStaringFirst[rest]!!;
    const formStaringSecond: ChordDirection[] = formsStaringSecond[rest]!!;

    const fretIndicesForFirst = getAllIndexes(firstNotes, root);
    const fretIndicesForSecond = getAllIndexes(secondNotes, root);    

    return [
        ...fretIndicesForFirst.map((i) => {
            return formStaringFirst.map((direction) => get(
                direction.finger,
                direction.fret + i,
                direction.lines
            ))
        }),
        ...fretIndicesForSecond.map((i) => {
            return formStaringSecond.map((direction) => get(
                direction.finger,
                direction.fret + i,
                direction.lines
            ))
        }),
    ];
}

const getStructuredChord = (chord: string): string[] => {
    if (chord[1] === '#' || chord[1] === 'b')
        return [chord.slice(0, 2), chord.slice(2)]
    else return [chord[0], chord.slice(1)]
}

function getAllIndexes(arr: any[], val: any) {
    const indexes = arr
    .flatMap((v, i) => {
        if (Array.isArray(v)) 
            return v.map(vv => [vv, i])
        else return [[v, i]]
    })
    .filter(([v, i]) => v === val)
    .map(([v, i]) => i)

    return Array.from(new Set(indexes))
}