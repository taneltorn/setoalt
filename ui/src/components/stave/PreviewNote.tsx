import React, {useState} from 'react';
import {Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
import useMousePosition from "../../hooks/useMousePosition.tsx";

interface Properties {
    pitch: string;
    x: number;
    y: number;
}

const PreviewNote: React.FC<Properties> = ({pitch, y}) => {

    const context = useScoreContext();
    const [opacity, setOpacity] = useState<number>(0);

    const { x} = useMousePosition(context.containerRef);

    const handleClick = () => {

        // todo
        // todo
        // todo
        // todo
        const position = x / 50 - 1
        const note = context.getNote(position );
        if (note) {
            context.changePitch(note, pitch);
            return;
        }
        context.insertNote(pitch, position);
        context.setCurrentPosition(position + 1)

    }
    return (<>
        {/*<rect x={x}*/}
        {/*      y={y}*/}
        {/*      width={40} fill={"#f11"} height={20} />*/}
        <circle
            className={"hover-pointer"}
            cx={x + 7}
            cy={y}
            opacity={opacity}
            r={Layout.stave.note.RADIUS}
        >
            <title>{pitch}</title>
        </circle>
        <rect
            className={"hover-pointer"}
            x={x - 50}
            y={y - 10}
            opacity={0}
            onMouseOver={() => setOpacity(0.8)}
            onMouseLeave={() => setOpacity(0)}
            r={Layout.stave.note.RADIUS * 2.5}
            height={40}
            fill={"red"}
            width={100}
            onClick={handleClick}
        />
        {/*<circle*/}
        {/*    className={"hover-pointer"}*/}
        {/*    cx={x}*/}
        {/*    cy={y}*/}
        {/*    opacity={0}*/}
        {/*    onMouseOver={() => setOpacity(0.8)}*/}
        {/*    onMouseLeave={() => setOpacity(0)}*/}
        {/*    r={Layout.stave.note.RADIUS * 2.5}*/}
        {/*    fill={"black"}*/}
        {/*    onClick={handleClick}*/}
        {/*/>*/}
    </>);
};

export default PreviewNote;
