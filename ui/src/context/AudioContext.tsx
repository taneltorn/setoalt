import React from 'react';
import {Note} from "../model/Note";
import {Stave} from "../model/Stave.ts";
import {Instrument} from "../model/Instrument.ts";
import {ScoreContextProperties} from "./ScoreContext.tsx";

export interface AudioContextProperties {

    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
    isSwitching: boolean;
    setIsSwitching: (value: boolean) => void;

    playNotes: (notes: Note[], stave: Stave) => void;

    startPlayback: (context: ScoreContextProperties) => void;
    stopPlayback: () => void;
    resetPlayback: (context: ScoreContextProperties) => void;

    instrument: Instrument;
    setInstrument: (instrument: Instrument) => void;

    volume: number;
    setVolume: (value: number) => void;

    tempo: number;
    setTempo: (value: number) => void;

    transposition: number;
    setTransposition: (value: number) => void;
}

export const AudioContext = React.createContext<AudioContextProperties>({} as AudioContextProperties);
