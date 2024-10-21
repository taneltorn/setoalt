import React, {useMemo, useState} from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useDevMode} from "../../../../../hooks/useDevContext.tsx";
import {calculateCursorNoteCoords} from "../../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../../utils/constants.ts";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {NoteFactory} from "../../../../../utils/factories.ts";
import {useNoteControls} from "../../../../../hooks/useNoteControls.tsx";
import {useActiveKeys} from "../../../../../hooks/useActiveKeys.tsx";

interface Properties {
    pitch: string;
    x: number;
    y: number;
}

const PreviewNote: React.FC<Properties> = ({pitch, ...props}) => {


    const context = useScoreContext();
    const {isCtrlKeyActive} = useActiveKeys();
    const {changePitch, insertNote} = useNoteControls();
    const {stopPlayback} = useAudioContext();
    const {isDevMode} = useDevMode();
    const [opacity, setOpacity] = useState<number>(isDevMode ? 0.2 : 0);

    const {x, y} = useMemo(() => {
        return calculateCursorNoteCoords(pitch, props.x, props.y, context);
    }, [pitch, props.x, props.y]);

    const handleClick = (event: any) => {
        if (event.ctrlKey) {
            context.updateLoopRange(context.loopRange?.start || context.activePosition, context.cursorPosition);
            stopPlayback();
            return;
        }

        const existingNote = context.getNote(context.cursorPosition, context.activeVoice);
        if (existingNote) {
            changePitch(existingNote, pitch);
        } else {
            const note = NoteFactory.create(pitch, context.cursorPosition, context.activeDuration);
            insertNote(note);
        }
        context.activate(context.cursorPosition)
    }

    return (<>
        {context.cursorPosition >= 0 && !isCtrlKeyActive && <>
            <circle
                cx={x}
                cy={y}
                opacity={isDevMode ? Math.max(opacity, 0.2) : opacity}
                r={Layout.stave.note.RADIUS}
            />
            <rect
                className={"hover-pointer"}
                x={x - 50}
                y={y - 10}
                opacity={isDevMode ? 0.1 : 0}
                onMouseOver={() => setOpacity(0.5)}
                onMouseLeave={() => setOpacity(0)}
                r={Layout.stave.note.RADIUS * 2.5}
                height={40}
                fill={"red"}
                width={100}
                onClick={event => handleClick(event)}
            >
                <title>{pitch.toUpperCase()}</title>
            </rect>
        </>}
    </>);
};

export default PreviewNote;
