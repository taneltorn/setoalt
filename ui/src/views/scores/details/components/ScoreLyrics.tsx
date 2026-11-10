import React from "react";
import {Box, Text} from "@mantine/core";
import {useLayoutParams} from "../../../../hooks/useLayoutParams.tsx";

interface Properties {
    lyrics?: string;
}

const ScoreLyrics: React.FC<Properties> = ({lyrics}) => {

    const {params} = useLayoutParams();

    return (
        <Box>
            <Text fz={params.LYRICS_INCREASED_FONT_SIZE}>
                <pre style={{whiteSpace: "pre-wrap", fontFamily: "Verdana"}}>{lyrics}</pre>
            </Text>
        </Box>
    );
}

export default ScoreLyrics;
