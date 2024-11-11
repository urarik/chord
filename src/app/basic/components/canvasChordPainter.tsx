import { doesNotMatch } from "assert";
import { ChordDirection } from "./ChordDirection";

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

export const drawChordNotation = (ctx: CanvasRenderingContext2D, chordInfo: ChordInfo) => {
    drawTabs(ctx, chordInfo);
    drawFret(ctx, chordInfo);
    drawDirections(ctx, chordInfo);
}

const drawTabs = (ctx: CanvasRenderingContext2D, chordInfo: ChordInfo) => {
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
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(horizontalPadding, verticalPadding);
    ctx.lineTo(horizontalPadding, height - verticalPadding);
    ctx.lineTo(horizontalPadding + doubleBarLineWidth, height - verticalPadding);
    ctx.lineTo(horizontalPadding + doubleBarLineWidth, verticalPadding);
    ctx.moveTo(horizontalPadding, verticalPadding);
    ctx.fill();

    let startX = horizontalPadding + doubleBarLineWidth;
    let startY = verticalPadding;


    for (let i = 0; i < 6; ++i) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + lineWidth, startY);
        ctx.stroke();

        startY = startY + lineVerticalGap;
    }
}

const drawFret = (ctx: CanvasRenderingContext2D, info: ChordInfo) => {
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
    const y = verticalPadding + lineVerticalGap * 5;

    ctx.textBaseline = "top";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    
    ctx.fillText(startFretIndex.toString(), x - 6, y + 2);

    let startX = x;
    let startY = verticalPadding;

    for (let i = 0; i < 4; ++i) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, height - verticalPadding);
        ctx.stroke();

        startX = startX + fretWidth;
    }
}

const drawDirections = (ctx: CanvasRenderingContext2D, info: ChordInfo) => {
    const {
        directions
    } = info;

    directions.forEach((direction) => {
        if (direction.type === ChordDirection.Type.MUTE) return; // TODO

        if (direction.type === ChordDirection.Type.FINGER) drawFingers(ctx, direction, info);
    })
}

const drawFingers = (ctx: CanvasRenderingContext2D, direction: ChordDirection, info: ChordInfo) => {
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

    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(finger.toString(), x, y + 1);
}