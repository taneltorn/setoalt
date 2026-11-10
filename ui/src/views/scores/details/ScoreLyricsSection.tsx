import React from "react";
import {Group} from "@mantine/core";
import {Score} from "../../../model/Score.ts";
import ScoreLyrics from "./components/ScoreLyrics.tsx";
import {useTranslation} from "react-i18next";
import {useLayoutParams} from "../../../hooks/useLayoutParams.tsx";

interface Properties {
    score: Score;
}

const ScoreLyricsSection: React.FC<Properties> = ({score}) => {

    const {i18n} = useTranslation();
    const {params} = useLayoutParams();

    const translation = score.translations?.[i18n.resolvedLanguage ?? i18n.language] || score.translations?.["et"];

    return (
        <Group align="flex-start" gap={params.LYRICS_TEXT_HEIGHT}>
            <ScoreLyrics lyrics={score.text}/>
            {translation && <ScoreLyrics lyrics={translation}/>}
        </Group>
    );
}

export default ScoreLyricsSection;
