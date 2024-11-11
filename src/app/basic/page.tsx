'use client';

import React, { FC, useEffect, useRef, useState } from "react";
import "./style.css";
import { FaPlay, FaPause  } from "react-icons/fa";
import { getChord } from "./chordGenerator";
import ChordNotation from "./components/ChordNotation";
import { ChordDirection } from "./components/ChordDirection";
import { getChordsDirections } from "./components/ChordCalculator";

enum Statuses {
    PLAYING,
    PAUSING,
    ANSWERING
}

export default function BasicChord() {
    const [status, setStatus] = useState<Statuses>(Statuses.PAUSING);
    const [chord, setChord] = useState<string>("");
    const [chordsDirections, setChordsDirections] = useState<ChordDirection[][]>([]);
    const scheduleIds = useRef<(NodeJS.Timeout | null)[]>([]);

    useEffect(() => {
        if (status === Statuses.PLAYING) {
            const chord = getChord();
            setChord(chord);
            const aa = getChordsDirections(chord);            
            setChordsDirections(aa);

            const id = setTimeout(() => {
                setStatus(Statuses.ANSWERING);
            }, 5000);

            scheduleIds.current = [...scheduleIds.current, id];
        }
        if (status === Statuses.PAUSING) {
            scheduleIds.current.forEach((id) => clearTimeout(id!!));
            scheduleIds.current = [];
        }
        if (status === Statuses.ANSWERING) {
            const id = setTimeout(() => {
                setStatus(Statuses.PLAYING);
            }, 2000);

            scheduleIds.current = [...scheduleIds.current, id];
        }
    }, [status]);

    return (
        <div className="basic-container">
            <div className="basic-chord">
                {chord}
                {
                    status !== Statuses.PLAYING &&
                        chordsDirections.map((directions, i) => 
                            <ChordNotation 
                                key={directions.map(d => `${d.finger}${d.fret}${d.lines.join(",")}${d.type}`).join(", ")}
                                directions={directions}
                                width={240}
                                height={120}
                                type="svg"
                            />
                        )
                }
            </div>

            <div>
                {
                    status !== Statuses.PAUSING 
                        ? <FaPause className="basic-button" onClick={() => setStatus(Statuses.PAUSING)}/>
                        : <FaPlay className="basic-button" onClick={() => setStatus(Statuses.PLAYING)}/>
                    
                }
            </div>
        </div>
    )
}