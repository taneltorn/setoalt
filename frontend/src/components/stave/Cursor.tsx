import React from 'react';
import {Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
import {getCursorCoords} from "../../utils/helpers";

const Cursor: React.FC = () => {

    const context = useScoreContext();

    const {x, y} = getCursorCoords(context);

    return (
        <rect
            x={x}
            y={y}
            width={Layout.stave.cursor.WIDTH}
            height={context.dimensions.y}
            fill={"#eee"}
            opacity={0.5}
            style={{zIndex: 1}}
        />
    )
};

export default Cursor;
