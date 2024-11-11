'use client';


const rootNotes = [...'ABCDEFG'].flatMap(base => ['#', 'b', ''].map(plus => base+plus))
const qualities = ['', 'M', 'm']
const modifiers = ['', '7']

const sample = (ary: any[]): any => {
    const result = ary[Math.floor(Math.random() * ary.length)]
    if (['B#', 'E#', 'Cb', 'Fb'].find(v => v === result) !== undefined)
        return sample(ary)
    else return result
}

export const getChord = (): string => {
    return sample(rootNotes) + sample(qualities) + sample(modifiers);
};