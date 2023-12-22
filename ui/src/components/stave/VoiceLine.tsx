import React from 'react';
import {Voice} from "../../models/Voice";
import StaveNote from "./StaveNote";

interface Properties {
    voice: Voice;
}

const VoiceLine: React.FC<Properties> = ({voice}) => {

    return (
        <>
            {voice.notes
                .filter(n => !n.hidden)
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
