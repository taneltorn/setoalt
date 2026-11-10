import React, {useMemo} from 'react';
import {useMantineTheme} from "@mantine/core";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {calculateCurrentPositionCoords} from "../../../../../utils/calculation.helpers.tsx";
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

const CurrentPositionMarker: React.FC = () => {

    const context = useScoreContext();
    const theme = useMantineTheme();
    const breaksDependency = JSON.stringify(context.score.data.breaks);
    const {params} = useLayoutParams();

    const {x, y} = useMemo(() => {
        return calculateCurrentPositionCoords(context, params);
    }, [context.activePosition, context.score.data.stave, breaksDependency, params]);

    return (<>
            {context.activePosition >= 0 &&
                <rect
                    x={x}
                    y={y}
                    width={params.CURSOR_WIDTH}
                    height={context.dimensions.y}
                    fill={theme.colors.gray[9]}
                    opacity={0.05}
                    style={{zIndex: 1}}
                />}
        </>
    )
};

export default CurrentPositionMarker;
