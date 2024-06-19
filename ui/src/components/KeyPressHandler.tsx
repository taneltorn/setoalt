import React, {useEffect} from 'react';
import {useScoreContext} from "../context/ScoreContext";
import {useAudioContext} from "../context/AudioContext";
import {ShortKey} from "../utils/keymap";
import {range} from "../utils/helpers.tsx";
import {DialogType, useDialogContext} from "../context/DialogContext";
import {NoteType} from "../models/Note.ts";

const KeyPressHandler: React.FC = () => {

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();
    const dialogContext = useDialogContext();

    const handleKeyPress = (event: KeyboardEvent) => {
        if (scoreContext.isTyping || dialogContext.active !== undefined) {
            return;
        }

        if (!range(9).includes(+event.key) && !Object.values(ShortKey).some(v => v === event.key.toUpperCase())) {
            return;
        }
        event.preventDefault();

        if (scoreContext.isEditMode) {

            if (range(9).includes(+event.key)) {
                const pitch = scoreContext.score.data.stave.lines.map(l => l.pitch).reverse()[+event.key - 1];
                if (pitch) {
                    scoreContext.insertOrUpdateNote(pitch, scoreContext.currentPosition, true);
                }
                return;
            }

            switch (event.key.toUpperCase()) {
                case ShortKey.MICRO_TUNING:
                    if (scoreContext.currentNote) {
                        dialogContext.open(DialogType.MICRO_TUNING);
                    }
                    break;
                case ShortKey.SHIFT_LEFT:
                    scoreContext.shiftLeft();
                    scoreContext.refresh();
                    break;
                case ShortKey.SHIFT_RIGHT:
                    scoreContext.shiftRight();
                    break;
                case ShortKey.REMOVE_NOTE:
                case ShortKey.DELETE_NOTE:
                    scoreContext.removeNote();
                    break;
                case ShortKey.HALF_NOTE:
                    scoreContext.changeDuration("2n");
                    break;
                case ShortKey.QUARTER_NOTE:
                    scoreContext.changeDuration("4n");
                    break;
                case ShortKey.EIGHT_NOTE:
                    scoreContext.changeDuration("8n");
                    break;
                case ShortKey.INCREASE_PITCH:
                    scoreContext.increasePitch();
                    break;
                case ShortKey.DECREASE_PITCH:
                    scoreContext.decreasePitch();
                    break;
                case ShortKey.CHANGE_TYPE:
                    scoreContext.changeType(scoreContext.currentNote, scoreContext.currentNote?.type === NoteType.SMALL
                        ? undefined
                        : NoteType.SMALL);
                    break;
                case ShortKey.BREAK:
                    scoreContext.toggleBreak();
                    break;
                case ShortKey.DIVIDER:
                    scoreContext.toggleDivider();
                    break;
            }
        }

        switch (event.key.toUpperCase()) {
            case ShortKey.PREVIOUS:
                audioContext.playPrevious(scoreContext);
                break;
            case ShortKey.NEXT:
                audioContext.playNext(scoreContext);
                break;
            case ShortKey.START_PLAYBACK:
                if (audioContext.isPlaying) {
                    audioContext.stopPlayback();
                    break;
                }
                audioContext.startPlaybackNEW(scoreContext);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return null;
};

export default KeyPressHandler;
