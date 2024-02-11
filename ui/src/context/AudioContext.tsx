import React, {useContext} from 'react';
import {Note} from "../models/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {Voice} from "../models/Voice";
import {ScoreContextProperties} from "./ScoreContext";
import {Score} from "../models/Score";
import {AudioOptions} from "../models/AudioOptions.ts";

export interface PlaybackOptions {
    detune?: number;
    transpose?: number;
}

export interface AudioContextProperties {

    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;

    playNote: (note: Note, voice: string, options?: AudioOptions) => void;
    playPosition: (score: Score, position: number, voice?: Voice, options?: AudioOptions) => void;

    playNext: (scoreContext: ScoreContextProperties) => void;
    playPrevious: (scoreContext: ScoreContextProperties) => void;

    startPlayback: (context: ScoreContextProperties) => void;
    stopPlayback: () => void;
    resetPlayback: (context: ScoreContextProperties) => void;

    tempo: number;
    setTempo: (value: number) => void;
}

export const AudioContext = React.createContext<AudioContextProperties>({} as AudioContextProperties);

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (isEmpty(context)) {
        throw new Error('useAudioContext must be used within a AudioContextProvider')
    }

    return context;
};
