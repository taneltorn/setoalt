import React from "react";
import {Box, Text} from "@mantine/core";
import {Layout} from "../../../../utils/constants.ts";

interface Properties {
    lyrics?: string;
}

const ScoreLyrics: React.FC<Properties> = ({lyrics}) => {

    return (
        <Box>
            <Text fz={Layout.stave.lyrics.INCREASED_FONT_SIZE}>
            <pre style={{whiteSpace: "pre-wrap"}}>{lyrics}</pre>
            </Text>
        </Box>
    );
}

export default ScoreLyrics;
