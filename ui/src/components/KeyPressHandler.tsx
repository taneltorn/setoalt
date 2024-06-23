import React, {useEffect} from 'react';
import {useScoreContext} from "../context/ScoreContext";
import {useAudioContext} from "../context/AudioContext";
import {ShortKey} from "../utils/keymap";
import {range} from "../utils/helpers.tsx";
import {DialogType, useDialogContext} from "../context/DialogContext";
import {NoteType} from "../model/Note.ts";
import {useHistory} from "../context/HistoryContext.tsx";

const KeyPressHandler: React.FC = () => {

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();
    const history = useHistory();
    const dialogContext = useDialogContext();

    const handleKeyPress = (event: KeyboardEvent) => {
        if (scoreContext.isTypeMode || dialogContext.active !== undefined) {
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
                    scoreContext.insertOrUpdateNote(pitch, scoreContext.activePosition, scoreContext.activeDuration, true);
                }
                return;
            }

            if (event.ctrlKey || event.metaKey) {
                switch (event.key.toUpperCase()) {
                    case ShortKey.UNDO:
                        if (history.undoStates.length) {
                            history.undo(scoreContext);
                        }
                        return;
                    case ShortKey.REDO:
                        if (history.redoStates.length) {
                            history.redo(scoreContext);
                        }
                        return;
                    default:
                        break;
                }
            }

            switch (event.key.toUpperCase()) {
                case ShortKey.MICRO_TUNING:
                    if (scoreContext.activeNote) {
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
                    scoreContext.removeNote(scoreContext.activePosition, true);
                    break;
                case ShortKey.HALF_NOTE:
                    scoreContext.setActiveDuration("2n");
                    break;
                case ShortKey.QUARTER_NOTE:
                    scoreContext.setActiveDuration("4n");
                    break;
                case ShortKey.EIGHT_NOTE:
                    scoreContext.setActiveDuration("8n");
                    break;
                case ShortKey.INCREASE_PITCH:
                    scoreContext.increaseNotePitch();
                    break;
                case ShortKey.DECREASE_PITCH:
                    scoreContext.decreaseNotePitch();
                    break;
                case ShortKey.CHANGE_TYPE:
                    scoreContext.changeType(scoreContext.activeNote, scoreContext.activeNote?.type === NoteType.SMALL
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
                scoreContext.previous();
                break;
            case ShortKey.NEXT:
                scoreContext.next();
                break;
            case ShortKey.START_PLAYBACK:
                if (audioContext.isPlaying) {
                    audioContext.stopPlayback();
                    break;
                }
                audioContext.startPlayback(scoreContext);
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
