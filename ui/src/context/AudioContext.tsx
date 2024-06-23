import React, {useContext} from 'react';
import {Note} from "../models/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {ScoreContextProperties} from "./ScoreContext";
import {Stave} from "../models/Stave.ts";

export interface PlaybackOptions {
    detune?: number;
    transpose?: number;
}

export interface AudioContextProperties {

    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;

    playNotes: (notes: Note[], stave: Stave) => void;

    startPlayback: (context: ScoreContextProperties) => void;
    stopPlayback: () => void;
    resetPlayback: (context: ScoreContextProperties) => void;

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
