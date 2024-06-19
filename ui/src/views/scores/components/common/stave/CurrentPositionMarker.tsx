import React, {useMemo} from 'react';
import {Layout} from "../../../../../utils/constants.ts";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useMantineTheme} from "@mantine/core";
import {calculateCurrentPositionCoords} from "../../../../../utils/calculation.helpers.tsx";

const CurrentPositionMarker: React.FC = () => {

    const context = useScoreContext();
    const theme = useMantineTheme();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateCurrentPositionCoords( context);
    }, [context.currentPosition, context.score.data.stave, breaksDependency]);

    return (<>
        {context.currentPosition >= 0 &&
            <rect
                x={x}
                y={y}
                width={Layout.stave.cursor.WIDTH}
                height={context.dimensions.y}
                fill={theme.colors.gray[2]}
                opacity={0.5}
                style={{zIndex: 1}}
            />}
            {/*<rect*/}
            {/*    x={x}*/}
            {/*    y={y}*/}
            {/*    width={Layout.stave.position.WIDTH}*/}
            {/*    height={Layout.stave.position.HEIGHT}*/}
            {/*    fill={theme.colors.red[9]}*/}
            {/*    opacity={1}*/}
            {/*/>*/}
        </>
    )
};

export default CurrentPositionMarker;
