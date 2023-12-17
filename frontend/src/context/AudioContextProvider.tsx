import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Note} from "../models/Note";
import * as Tone from "tone";
import {Playback} from "../utils/constants";
import {positionToSeconds} from "../utils/helpers";
import useAudioPlayer from "../hooks/useAudioPlayer";
import {Voice} from "../models/Voice";
import {AudioContext} from "./AudioContext";
import {ScoreContextProperties} from "./ScoreContext";
import {Score} from "../models/Score";

interface Properties {
    children: React.ReactNode;
}

const AudioContextProvider: React.FC<Properties> = ({children}) => {

    const player = useAudioPlayer();
    const sequenceRef = useRef<Tone.Part | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [tempo, setTempo] = useState<number>(Playback.DEFAULT_TEMPO);

    const playNote = (note: Note, voice: Voice, detune?: number, semitones?: number) => {
        if (!(note.position >= 0)) return;

        player.playNote(note, voice, detune, semitones);
    }

    const playPosition = (score: Score, position: number, voice?: Voice, semitones?: number) => {
        score.voices
            .filter(v => voice ? v.name === voice.name : true)
            .forEach(voice => {
                voice.notes
                    .filter(note => note.position === position)
                    .forEach(note => {
                        const line = score.stave.lines.find(l => l.pitch === note.pitch);
                        playNote(note, voice, note.detune || line?.detune, semitones);
                    });
            });
    }

    const playNext = (context: ScoreContextProperties) => {
        stopPlayback();

        const position = context.next();
        playPosition(context.score, position, context.isEditMode ? context.currentVoice : undefined);

    }

    const playPrevious = (context: ScoreContextProperties) => {
        stopPlayback();

        const position = context.previous();
        playPosition(context.score, position, context.isEditMode ? context.currentVoice : undefined);
    }


    const startPlayback = (context: ScoreContextProperties) => {
        stopPlayback();
        setIsPlaying(true);

        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }

        const startPosition = context.currentPosition >= context.endPosition ? 0 : context.currentPosition;

        const endTimes: number[] = [];
        const events: Array<[number, { note: Note, voice: Voice }]> = [];
        context.score.voices.forEach(voice => {
            voice.notes
                .filter(n => n.position >= startPosition)
                .forEach(note => {
                    const t = positionToSeconds(note.position - startPosition);
                    events.push([t, {note: note, voice: voice}]);
                    const noteEndTime = t + Tone.Time(note.duration).toSeconds();
                    endTimes.push(noteEndTime);
                });
        });

        if (!sequenceRef.current) {
            sequenceRef.current = new Tone.Part((_, event) => {
                const line = context.score.stave.lines.find(l => l.pitch === event.note.pitch);
                playNote(event.note, event.voice, event.note.detune || line?.detune, context.semitones);
                context.setCurrentPosition(event.note.position);

                const notes = context.getNotes(event.note.position);
                context.setCurrentNote(notes.length === 1 ? event.note : undefined);
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

    const resetPlayback = (scoreContext: ScoreContextProperties) => {
        stopPlayback();
        scoreContext.setCurrentPosition(0);
        scoreContext.refresh();
    };

    useEffect(() => {
        Tone.Transport.bpm.value = tempo;
    }, [tempo]);

    const context = useMemo(() => ({

        isPlaying,
        setIsPlaying,

        playNote,
        playPosition,
        playNext,
        playPrevious,
        startPlayback,
        stopPlayback,
        resetPlayback,

        tempo,
        setTempo,
    }), [isPlaying, tempo]);

    return (
        <AudioContext.Provider value={context}>
            {children}
        </AudioContext.Provider>);
}

export default AudioContextProvider;