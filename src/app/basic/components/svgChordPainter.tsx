import { doesNotMatch } from "assert";
import { ChordDirection } from "./ChordDirection";
import { ReactElement } from "react";
import { range } from "@/utils/arrayUtils";

export class ChordInfo {
    width: number;
    height: number;
    horizontalPadding: number;
    doubleBarLineWidth: number;
    verticalPadding: number;
    lineWidth: number;
    lineVerticalGap: number;
    fretWidth: number;
    directions: ChordDirection[];
    startFretIndex: number;

    constructor(width: number, height: number, directions: ChordDirection[]) {
        this.width = width;
        this.height = height * 0.95;
        this.horizontalPadding = width / 12;
        this.verticalPadding = this.height / 9;
        this.doubleBarLineWidth = width / 12;
        this.lineWidth = width / 12 * 8;
        this.lineVerticalGap = this.height / 9 * 1.4;
        this.directions = directions;
        this.fretWidth = this.lineWidth / 4.5;
        this.startFretIndex = directions
            .filter((direction) => direction.type === ChordDirection.Type.FINGER)
            .map((direction) => direction.fret)
            .reduce((acc, newFretIdx) =>  Math.min(acc, newFretIdx), 100);        
    }
}

export const drawChordNotation = (chordInfo: ChordInfo): ReactElement[] => {
    return [...drawTabs(chordInfo), ...drawFret(chordInfo), ...drawDirections(chordInfo)]
}

const drawTabs = (chordInfo: ChordInfo): ReactElement[] => {
    const {
        width, 
        height,
        horizontalPadding,
        verticalPadding,
        doubleBarLineWidth,
        lineWidth,
        lineVerticalGap
    } = chordInfo;

    // drawing double line
    const doubleLine = <rect 
            key={`doubleLine${horizontalPadding}`}
            x={horizontalPadding} 
            y={verticalPadding} 
            width={doubleBarLineWidth} 
            height={height - verticalPadding * 2}
        />
    
    let startX = horizontalPadding + doubleBarLineWidth;
    let startY = verticalPadding;


    const lines = range(6).map((i) => {
        const line = <line
                key={`line${startY}_${i}`}
                x1={startX}
                y1={startY}
                x2={startX+lineWidth}
                y2={startY}
                stroke="black"
            />

        startY = startY + lineVerticalGap;
        return line;
    })

    return [doubleLine, ...lines]
}

const drawFret = (info: ChordInfo): ReactElement[] => {
    const { 
        height,
        horizontalPadding,
        doubleBarLineWidth,
        verticalPadding,
        fretWidth,
        lineVerticalGap,
        startFretIndex
     } = info;

    const x = horizontalPadding + doubleBarLineWidth + fretWidth;
    const y = verticalPadding + lineVerticalGap * 6;

    const startFretText = <text 
            key={`startFretText_${x}`}
            x={x - 6}
            y={y - 2}
            className="start-fret-text"
        >{startFretIndex.toString()}</text>

    let startX = x;
    let startY = verticalPadding;

    const frets = range(4).map((i) => {
        const fret = <line 
            key={`fret_${startX}`}
            x1={startX}
            y1={startY}
            x2={startX}
            y2={height - verticalPadding}
            stroke="black"
        />

        startX = startX + fretWidth
        return fret
    })

    return [startFretText, ...frets];
}

const drawDirections = (info: ChordInfo): ReactElement[] => {
    const {
        directions
    } = info;

    return directions.flatMap((direction) => {
        if (direction.type === ChordDirection.Type.MUTE) return emptyElement(); // TODO
        else if (direction.type === ChordDirection.Type.FINGER) return drawFingers(direction, info);
        
        return emptyElement();
    })
}

const emptyElement = (): ReactElement[] => [<></>]

const drawFingers = (direction: ChordDirection, info: ChordInfo): ReactElement[] => {
    const {
        height,
        horizontalPadding,
        doubleBarLineWidth,
        verticalPadding,
        fretWidth,
        lineVerticalGap,
        startFretIndex
    } = info;
    const {
        finger,
        fret,
        lines
    } = direction;

    const startLineIndex = 6 - lines.reduce((a, b) => Math.max(a, b), -1);
    const endLineIndex = 6 - lines.reduce((a, b) => Math.min(a, b), 100);    

    const fretIndex = fret - startFretIndex;
    const x = horizontalPadding + doubleBarLineWidth + (fretWidth * fretIndex) + (fretWidth / 2);
    const y = verticalPadding + lineVerticalGap * ((startLineIndex + endLineIndex) / 2);
    const radiusX = fretWidth * 0.2;

    let radiusY;
    if (lines.length === 1) {
        radiusY = (endLineIndex - startLineIndex + 1) * (fretWidth * 0.2);
    } else {
        radiusY = (endLineIndex - startLineIndex + 1) * (lineVerticalGap * 0.5);
    }

    const ellipse = <ellipse 
            key={`ellipse_${x}${y}`}
            cx={x}
            cy={y}
            rx={radiusX}
            ry={radiusY}
        />

    const fingerText = <text
        key={`fingerText_${x}${y}`}
        x={x-3}
        y={y+4}
        className="finger-text"
    >
        {finger.toString()}
    </text>

    return [ellipse, fingerText]
}