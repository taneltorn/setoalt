import React from 'react';
import StaveNote from "./StaveNote.tsx";
import {Voice} from "../../../../model/Voice.ts";
import {useScoreContext} from "../../../../hooks/useScoreContext.tsx";

interface Properties {
    voice: Voice;
}

const VoiceLine: React.FC<Properties> = ({voice}) => {

    const {isEditMode} = useScoreContext();

    return (
        <>
            {voice.notes
                .filter(n => isEditMode || !n.hidden)
                .map((note, index) =>
                    <StaveNote
                        key={`note-${index}`}
                        note={note}
                        voice={voice}
                    />)}
        </>
    )
};

export default VoiceLine;
