import React from "react";
import {Box, Button} from "@mantine/core";
import {Score} from "../../../../../model/Score.ts";
import LyricsBox from "./LyricsBox.tsx";
import {useTranslation} from "react-i18next";
import {useElementSize} from "@mantine/hooks";
import {Size} from "../../../../../utils/constants.ts";

interface Properties {
    score: Score;
}

const LyricsSection: React.FC<Properties> = ({score}) => {

    const {t} = useTranslation();

    const {ref: lyricsRef, height: lyricsHeight} = useElementSize();
    const {ref: boxRef, height: boxHeight} = useElementSize<HTMLDivElement>();

    const defaultHeight = Size.page.LYRICS_TEXT_DEFAULT_HEIGHT;
    const exceedsMaxHeight = lyricsHeight > defaultHeight;
    const showAllLyrics = boxHeight >= lyricsHeight;

    const toggleLyrics = () => {
        if (boxRef.current) {
            boxRef.current.style.height = `${
                showAllLyrics ? defaultHeight : lyricsHeight
            }px`;
        }
    };

    return (
        <>
            <Box
                ref={boxRef}
                h={exceedsMaxHeight ? defaultHeight : undefined}
                mih={Size.page.LYRICS_TEXT_MIN_HEIGHT}
                mah={lyricsHeight || undefined}
                style={{
                    resize: exceedsMaxHeight ? "vertical" : "none",
                    overflow: "auto",
                }}
            >
                <div ref={lyricsRef}>
                    <LyricsBox score={score}/>
                </div>
            </Box>

            {exceedsMaxHeight && (
                <Button
                    mt="md"
                    variant="subtle"
                    onClick={toggleLyrics}
                >
                    {t(`button.${showAllLyrics ? "displayPartially" : "displayAll"}`)}
                </Button>
            )}
        </>
    );
}

export default LyricsSection;
