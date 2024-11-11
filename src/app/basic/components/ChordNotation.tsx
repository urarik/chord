'use client';

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { drawChordNotation as canvasDrawChordNotation, ChordInfo } from "./canvasChordPainter";
import { drawChordNotation as svgDrawChordNotation } from "./svgChordPainter";
import { ChordDirection } from "./ChordDirection";


export default function ChordNotation({
    directions,
    width,
    height,
    type
}: {
    directions: ChordDirection[],
    width: number,
    height: number,
    type: "canvas" | "svg"
}) {    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [svgChildren, setSvgChildren] = useState<ReactElement[]>([]);

    useEffect(() => {
        if (type !== "canvas") return;
        if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;

        const width = canvasRef.current.width
        const height = canvasRef.current.height
        
        const ctx = canvasRef.current.getContext('2d')!!

        const info = new ChordInfo(width, height, directions);
        
        canvasDrawChordNotation(ctx, info);
    }, [canvasRef])

    useEffect(() => {
        if (type !== "svg") return;
        
        const info = new ChordInfo(width, height, directions);
        
        const children = svgDrawChordNotation(info);
        setSvgChildren(children)
    }, [canvasRef])
    
    return (
        (type === "canvas")
        ? <canvas ref={canvasRef} width={width} height={height} />
        : <svg width={width} height={height}>
            {svgChildren}
        </svg>
    )
}