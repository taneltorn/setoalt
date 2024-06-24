import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Note} from "../model/Note";
import * as Tone from "tone";
import {Playback} from "../utils/constants";
import {durationToScalar, excludeDuplicates, noteToFrequency, positionToSeconds} from "../utils/helpers.tsx";
import {AudioContext} from "./AudioContext";
import {ScoreContextProperties} from "./ScoreContext";
import useAudioPlayer from "../hooks/useAudioPlayer.tsx";
import {Stave} from "../model/Stave.ts";
import {Instrument} from "../model/Instrument.ts";
import {Instruments} from "../utils/dictionaries.ts";

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
    const [instrument, setInstrument] = useState<Instrument>(Instruments.find(i => i.name === Playback.DEFAULT_INSTRUMENT) || Instruments[0]);

    const changeInstrument = (instrument: Instrument) => {
        setInstrument(instrument);
        player.load(instrument);
    }

    const playNotes = (notes: Note[], stave: Stave) => {
        const unique = excludeDuplicates(notes).filter(n => !n.hidden);

        const frequencies = unique.map(n => noteToFrequency(n, stave, transposition));
        const durations = unique.map(n => n.duration);

        player.playNotes(frequencies, durations);
    }

    const startPlayback = (context: ScoreContextProperties) => {
        stopPlayback();
        setIsPlaying(true);

        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }

        const isLooping = context.loopRange?.start !== undefined && context.loopRange?.end !== undefined;
        const startPosition = context.loopRange?.start !== undefined ? context.loopRange.start : context.activePosition >= context.endPosition ? 0 : Math.max(0, context.activePosition);
        const endPosition = context.loopRange?.end !== undefined ? context.loopRange.end :  context.endPosition;

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

        Tone.Transport.scheduleOnce(() => {
            if (!isLooping) {
                resetPlayback(context);
            }
        }, `+${longestDuration}`);

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
        context.activate(-1);
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

        instrument, setInstrument: changeInstrument,
        tempo, setTempo,
        transposition, setTransposition,
    }), [isPlaying, instrument, tempo, transposition]);

    return (
        <AudioContext.Provider value={context}>
            {children}
        </AudioContext.Provider>);
}

export default AudioContextProvider;