import React, {useEffect} from 'react';
import {useScoreContext} from "../hooks/useScoreContext.tsx";
import {useAudioContext} from "../hooks/useAudioContext.tsx";
import {ShortKey} from "../utils/keymap";
import {range} from "../utils/helpers.tsx";
import {useDialogContext} from "../hooks/useDialogContext.tsx";
import {NoteType} from "../model/Note.ts";
import {DialogType, ShiftMode} from "../utils/enums.ts";
import {useNoteControls} from "../hooks/useNoteControls.tsx";
import {NoteFactory} from "../utils/factories.ts";
import {useLayoutControls} from "../hooks/useLayoutControls.tsx";
import {useActiveKeys} from "../hooks/useActiveKeys.tsx";
import {useHistory} from "../hooks/useHistory.tsx";
import useScoreService from "../hooks/useScoreService.tsx";

const KeyPressHandler: React.FC = () => {

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();
    const dialogContext = useDialogContext();

    const {setIsCtrlKeyActive, setIsShiftKeyActive} = useActiveKeys();
    const {
        changeDuration,
        changePitch,
        changeType,
        decreasePitch,
        increasePitch,
        insertNote,
        removeNote
    } = useNoteControls();
    const {shiftLeft, shiftRight, toggleBreak, toggleDivider} = useLayoutControls();
    const history = useHistory();
    const scoreService = useScoreService();

    const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === "Control") {
            setIsCtrlKeyActive(false);
        }
        if (event.key === "Shift") {
            setIsShiftKeyActive(false);
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (scoreContext.isTypeMode || dialogContext.active !== undefined) {
            return;
        }

        if (event.ctrlKey) {
            setIsCtrlKeyActive(true);
        }

        if (event.shiftKey) {
            setIsShiftKeyActive(true);
        }

        if (!range(9).includes(+event.key) && !Object.values(ShortKey).some(v => v === event.key.toUpperCase())) {
            return;
        }
        event.preventDefault();

        if (scoreContext.isEditMode) {
            if (range(9).includes(+event.key)) {
                const pitch = scoreContext.score.data.stave.lines.map(l => l.pitch).reverse()[+event.key - 1];
                if (pitch) {
                    if (scoreContext.activeNote) {
                        changePitch(scoreContext.activeNote, pitch);
                        return;
                    }
                    const note = NoteFactory.create(pitch, scoreContext.activePosition, scoreContext.activeDuration);
                    insertNote(note, true);
                    audioContext.playNotes([note], scoreContext.score.data.stave);
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
                    case ShortKey.SAVE:
                        if (scoreContext.score.id) {
                            scoreService.updateScore(scoreContext.score.id, scoreContext.score);
                        }
                        break;
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
                    return shiftLeft(event.shiftKey
                        ? ShiftMode.VOICES
                        : (event.ctrlKey ? ShiftMode.LYRICS : ShiftMode.NOTES));
                case ShortKey.SHIFT_RIGHT:
                    return shiftRight(event.shiftKey
                        ? ShiftMode.VOICES
                        : (event.ctrlKey ? ShiftMode.LYRICS : ShiftMode.NOTES));
                case ShortKey.REMOVE_NOTE:
                case ShortKey.DELETE_NOTE:
                    removeNote(scoreContext.activePosition, true);
                    break;

                case ShortKey.HALF_NOTE:
                    changeDuration("2n", scoreContext.activeNote, true);
                    break;
                case ShortKey.QUARTER_NOTE:
                    changeDuration("4n", scoreContext.activeNote, true);
                    break;
                case ShortKey.EIGHT_NOTE:
                    changeDuration("8n", scoreContext.activeNote, true);
                    break;

                case ShortKey.INCREASE_PITCH:
                    if (scoreContext.activeNote) {
                        increasePitch(scoreContext.activeNote);
                    }
                    break;
                case ShortKey.DECREASE_PITCH:
                    if (scoreContext.activeNote) {
                        decreasePitch(scoreContext.activeNote);
                    }
                    break;
                case ShortKey.CHANGE_TYPE:
                    if (scoreContext.activeNote) {
                        changeType(scoreContext.activeNote, scoreContext.activeNote?.type === NoteType.SMALL
                            ? NoteType.REGULAR
                            : NoteType.SMALL);
                    }
                    break;
                case ShortKey.BREAK:
                    toggleBreak();
                    break;
                case ShortKey.DIVIDER:
                    toggleDivider();
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
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyUp]);

    return null;
};

export default KeyPressHandler;
