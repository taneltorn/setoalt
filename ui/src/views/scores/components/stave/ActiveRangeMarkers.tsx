import React, {useMemo} from 'react';
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {Layout, Size} from "../../../../utils/constants.ts";
import {calculateLoopRangeCoords} from "../../../../utils/calculation.helpers.tsx";
import {RxReset} from "react-icons/rx";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../../../context/AudioContext.tsx";

const ActiveRangeMarkers: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();

    // todo calc innerY inside provider
    const height = context.dimensions.y
        - Layout.stave.container.SYMBOLS_BAR
        - Layout.stave.container.LYRICS_BAR
        + Layout.stave.divider.SEPARATOR_HEIGHT;

    const [start, end] = useMemo(() => {
        return calculateLoopRangeCoords(context)
    }, [context.loopRange]);

    const handleReset = () => {
        stopPlayback();
        context.setLoopRange(undefined);
    }
    return (
        <>
            <foreignObject x={end.x - 10} y={end.y - Layout.stave.container.SYMBOLS_BAR + 20} width={200} height={22}>
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
                    width={Layout.stave.range.WIDTH}
                    fill={"red"}
                    opacity={0.5}
                    height={height}
                />}

            <rect
                x={end.x}
                y={end.y}
                width={Layout.stave.range.WIDTH}
                fill={"red"}
                opacity={0.5}
                height={height}
            />
        </>
    )
};

export default ActiveRangeMarkers;
