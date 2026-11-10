import React, {useMemo} from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Size} from "../../../../../utils/constants.ts";
import {calculateLoopRangeCoords} from "../../../../../utils/calculation.helpers.tsx";
import {RxReset} from "react-icons/rx";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {useMantineTheme} from "@mantine/core";
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

const ActiveRangeMarkers: React.FC = () => {

    const {t} = useTranslation();
    const {params} = useLayoutParams();
    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();
    const theme = useMantineTheme();

    // todo calc innerY inside provider
    const height = context.dimensions.y
        - params.CONTAINER_SYMBOLS_BAR
        - params.CONTAINER_LYRICS_BAR
        + params.DIVIDER_SEPARATOR_HEIGHT;

    const [start, end] = useMemo(() => {
        return calculateLoopRangeCoords(context, params)
    }, [context.loopRange]);

    const handleReset = () => {
        stopPlayback();
        context.setLoopRange(undefined);
    }
    return (
        <>
            <foreignObject x={end.x - 10} y={end.y - params.CONTAINER_SYMBOLS_BAR + 20} width={200} height={22}>
                <RxReset
                    size={Size.icon.SM}
                    title={t("button.reset")}
                    onClick={handleReset}
                    style={{cursor: "pointer"}}
                />
            </foreignObject>

            {start.x >= 0 &&
                <rect
                    x={start.x}
                    y={start.y}
                    width={params.RANGE_WIDTH}
                    fill={theme.colors.red[9]}
                    opacity={0.5}
                    height={height}
                />}

            <rect
                x={end.x}
                y={end.y}
                width={params.RANGE_WIDTH}
                fill={theme.colors.red[9]}
                opacity={0.5}
                height={height}
            />
        </>
    )
};

export default ActiveRangeMarkers;
