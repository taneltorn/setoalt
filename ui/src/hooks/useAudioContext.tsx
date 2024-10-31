import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Note} from "../model/Note.ts";
import {durationToScalar, excludeDuplicates, isEmpty, noteToFrequency, positionToSeconds} from "../utils/helpers.tsx";
import {Stave} from "../model/Stave.ts";
import {Instrument} from "../model/Instrument.ts";
import useAudioPlayer from "./useAudioPlayer.tsx";
import * as Tone from "tone";
import {Playback} from "../utils/constants.ts";
import {Instruments} from "../utils/dictionaries.ts";
import {AudioContext} from "../context/AudioContext.tsx";
import {GroupedNote} from "../model/GroupedNote.ts";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";
import useLocalStorage from "./useLocalStorage.tsx";

interface Properties {
    children: React.ReactNode;
}

export const AudioContextProvider: React.FC<Properties> = ({children}) => {

    const player = useAudioPlayer();
    const sequenceRef = useRef<Tone.Part | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isSwitching, setIsSwitching] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(Playback.DEFAULT_VOLUME);
    const [tempo, setTempo] = useState<number>(Playback.DEFAULT_TEMPO);
    const [transposition, setTransposition] = useState<number>(Playback.DEFAULT_TRANSPOSITION);
    const [instrument, setInstrument] = useLocalStorage<Instrument>("active-instrument", Instruments.find(i => i.name === Playback.DEFAULT_INSTRUMENT) || Instruments[0]);

    const changeInstrument = (instrument: Instrument) => {
        setIsSwitching(true);
        player.use(instrument, () => setIsSwitching(false));
        setInstrument(instrument);
    }

    const playNotes = (notes: Note[], stave: Stave) => {
        const unique = excludeDuplicates(notes).filter(n => !n.hidden);

        const frequencies = unique.map(n => noteToFrequency(n, stave, transposition));
        const durations = unique.map(n => n.duration);

        player.playNotes(frequencies, durations);
    }

    const startPlayback = (context: ScoreContextProperties) => {
        if (isSwitching) {
            console.log("still switching instruments!")
            return;
        }

        stopPlayback();
        setIsPlaying(true);

        if (Tone.getContext().state !== 'running') {
            Tone.getContext().resume().then(() => console.log("resuming"));
        }

        const isLooping = context.loopRange?.start !== undefined && context.loopRange?.end !== undefined;
        const startPosition = context.loopRange?.start !== undefined ? context.loopRange.start : context.activePosition >= context.endPosition ? 0 : Math.max(0, context.activePosition);
        const endPosition = context.loopRange?.end !== undefined ? context.loopRange.end : context.endPosition;

        const endTimes: number[] = [];
        const events: Array<[number, { position: number, notes: Note[] }]> = [];

        const groupedNotes: GroupedNote[] = Object.values(
            context.score.data.voices
                .filter(v => !v.hidden)
                .flatMap(v => v.notes)
                .filter(n => n.position >= startPosition)
                .reduce((acc, note) => {
                    if (!acc[note.position]) {
                        acc[note.position] = {
                            position: note.position,
                            notes: []
                        };
                    }
                    acc[note.position].notes.push(note);
                    return acc;
                }, {} as { [key: number]: GroupedNote })
        );

        groupedNotes.forEach(group => {
            const t = positionToSeconds(group.position - startPosition);
            events.push([t, {position: group.position, notes: group.notes}]);

            const times = group.notes.map(n => t + Tone.Time(n.duration).toSeconds());
            endTimes.push(...times);
        });

        if (!sequenceRef.current) {
            sequenceRef.current = new Tone.Part((_, event) => {
                playNotes(event.notes, context.score.data.stave)
                context.setActivePosition(event.position);
                context.scrollToPosition(event.position);
            }, events).start(0);
        }
        const endNote = context.getNote(endPosition);
        const add = endNote?.duration ? durationToScalar(endNote.duration) : 0;

        const longestDuration = Math.max(...endTimes, 0);
        const loopDuration = positionToSeconds(endPosition + add - startPosition);

        if (isLooping) {
            sequenceRef.current.loop = true;
            sequenceRef.current.loopEnd = loopDuration;
        } else {
            sequenceRef.current.loop = false;
            sequenceRef.current.loopEnd = longestDuration;
        }

        Tone.getContext().transport.scheduleOnce(() => {
            if (!isLooping) {
                resetPlayback(context);
            }
        }, `+${longestDuration}`);

        Tone.getContext().transport.start();
    };

    const stopPlayback = () => {
        setIsPlaying(false);

        if (Tone.getContext().transport.state === "stopped") return;

        if (sequenceRef.current) {
            sequenceRef.current.stop();
            sequenceRef.current.dispose();
            sequenceRef.current = null;
        }
        Tone.getContext().transport.cancel();
        Tone.getContext().transport.stop();
    };

    const resetPlayback = (context: ScoreContextProperties) => {
        stopPlayback();
        context.activate(-1);
        context.refresh();
    };

    useEffect(() => {
        player.setVolume(volume);
    }, [volume]);

    useEffect(() => {
        Tone.getContext().transport.bpm.value = tempo;
    }, [tempo]);


    useEffect(() => {
        changeInstrument(instrument);
    }, []);

    const context = useMemo(() => ({

        isPlaying, setIsPlaying,
        isSwitching, setIsSwitching,

        playNotes,
        startPlayback,
        stopPlayback,
        resetPlayback,

        instrument, setInstrument: changeInstrument,
        volume, setVolume,
        tempo, setTempo,
        transposition, setTransposition,
    }), [isPlaying, isSwitching, instrument, tempo, transposition, volume]);

    return (
        <AudioContext.Provider value={context}>
            {children}
        </AudioContext.Provider>);
}

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (isEmpty(context)) {
        throw new Error('useAudioContext must be used within a AudioContextProvider')
    }

    return context;
};
