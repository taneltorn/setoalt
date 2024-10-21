import React from "react";
import {Box} from "@mantine/core";

interface Properties {
    lyrics?: string;
}

const ScoreLyrics: React.FC<Properties> = ({lyrics}) => {

    return (
        <Box>
            <pre style={{whiteSpace: "pre-wrap"}}>{lyrics}</pre>
        </Box>
    );
}

export default ScoreLyrics;
