import React, {useContext} from 'react';
import {Note} from "../model/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {ScoreContextProperties} from "./ScoreContext";
import {Stave} from "../model/Stave.ts";
import {Instrument} from "../model/Instrument.ts";

export interface AudioContextProperties {

    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;

    playNotes: (notes: Note[], stave: Stave) => void;

    startPlayback: (context: ScoreContextProperties) => void;
    stopPlayback: () => void;
    resetPlayback: (context: ScoreContextProperties) => void;

    instrument: Instrument;
    setInstrument: (instrument: Instrument) => void;

    tempo: number;
    setTempo: (value: number) => void;

    transposition: number;
    setTransposition: (value: number) => void;
}

export const AudioContext = React.createContext<AudioContextProperties>({} as AudioContextProperties);

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (isEmpty(context)) {
        throw new Error('useAudioContext must be used within a AudioContextProvider')
    }

    return context;
};
