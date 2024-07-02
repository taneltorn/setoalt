import React, {useMemo} from 'react';
import {useMantineTheme} from "@mantine/core";
import {useScoreContext} from "../../../../hooks/useScoreContext.tsx";
import {calculateCurrentPositionCoords} from "../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../utils/constants.ts";

const CurrentPositionMarker: React.FC = () => {

    const context = useScoreContext();
    const theme = useMantineTheme();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateCurrentPositionCoords( context);
    }, [context.activePosition, context.score.data.stave, breaksDependency]);

    return (<>
        {context.activePosition >= 0 &&
            <rect
                x={x}
                y={y}
                width={Layout.stave.cursor.WIDTH}
                height={context.dimensions.y}
                fill={theme.colors.gray[9]}
                opacity={0.05}
                style={{zIndex: 1}}
            />}
        </>
    )
};

export default CurrentPositionMarker;
