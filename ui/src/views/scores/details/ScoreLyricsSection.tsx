import React from "react";
import {Group} from "@mantine/core";
import {Score} from "../../../model/Score.ts";
import ScoreLyrics from "./components/ScoreLyrics.tsx";
import {useTranslation} from "react-i18next";
import {Layout} from "../../../utils/constants.ts";

interface Properties {
    score: Score;
}

const ScoreLyricsSection: React.FC<Properties> = ({score}) => {

    const {i18n} = useTranslation();

    const translation = score.translations?.[i18n.resolvedLanguage ?? i18n.language] || score.translations?.["et"];

    return (
        <Group align="flex-start" gap={Layout.lyrics.gap}>
            <ScoreLyrics lyrics={score.text}/>
            {translation && <ScoreLyrics lyrics={translation}/>}
        </Group>
    );
}

export default ScoreLyricsSection;
