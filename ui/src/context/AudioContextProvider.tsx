import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Note} from "../models/Note";
import * as Tone from "tone";
import {Playback} from "../utils/constants";
import {excludeDuplicates, noteToFrequency, positionToSeconds} from "../utils/helpers.tsx";
import {AudioContext} from "./AudioContext";
import {ScoreContextProperties} from "./ScoreContext";
import useAudioPlayer from "../hooks/useAudioPlayer.tsx";

interface Properties {
    children: React.ReactNode;
}

interface GroupedNote {
    position: number;
    notes: Note[];
}

const AudioContextProvider: React.FC<Properties> = ({children}) => {

    const player = useAudioPlayer();
    const sequenceRef = useRef<Tone.Part | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [tempo, setTempo] = useState<number>(Playback.DEFAULT_TEMPO);
    const [transposition, setTransposition] = useState<number>(Playback.DEFAULT_TRANSPOSITION);

    const playNotes = (notes: Note[]) => {
        const unique = excludeDuplicates(notes);

        const frequencies = unique.map(n => noteToFrequency(n, transposition));
        const durations = unique.map(n => n.duration);

        player.playNotes(frequencies, durations);
    }
    const startPlayback = (context: ScoreContextProperties) => {
        stopPlayback();
        setIsPlaying(true);

        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }

        const startPosition = context.activePosition >= context.endPosition ? 0 : Math.max(0, context.activePosition);

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
                playNotes(event.notes)
                context.setActivePosition(event.position);
            }, events).start(0);
        }

        const longestDuration = Math.max(...endTimes, 0);
        Tone.Transport.scheduleOnce(() => {
            resetPlayback(context);
        }, `+${longestDuration}`);

        sequenceRef.current.loop = false;
        sequenceRef.current.loopEnd = longestDuration;

        Tone.Transport.start();
    };

    const stopPlayback = () => {
        setIsPlaying(false);

        if (Tone.Transport.state === "stopped") return;

        if (sequenceRef.current) {
            sequenceRef.current.stop();
            sequenceRef.current.dispose();
            sequenceRef.current = null;
        }
        Tone.Transport.cancel();
        Tone.Transport.stop();
    };

    const resetPlayback = (context: ScoreContextProperties) => {
        stopPlayback();
        context.setActivePosition(0);
        context.refresh();
    };

    useEffect(() => {
        Tone.Transport.bpm.value = tempo;
    }, [tempo]);

    const context = useMemo(() => ({

        isPlaying, setIsPlaying,

        playNotes,
        startPlayback,
        stopPlayback,
        resetPlayback,

        tempo, setTempo,
        transposition, setTransposition,
    }), [isPlaying, tempo, transposition]);

    return (
        <AudioContext.Provider value={context}>
            {children}
        </AudioContext.Provider>);
}

export default AudioContextProvider;