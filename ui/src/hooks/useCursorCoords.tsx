import {RefObject, useState, useEffect} from 'react';
import {Layout} from "../utils/constants.ts";
import {StaveDimensions} from "../model/Dimensions.ts";
import {HalfPosition} from "../model/HalfPosition.ts";

type MousePosition = {
    x: number;
    y: number;
    cx: number;
    cy: number;
};

const useCursorCoords = (elementRef: RefObject<HTMLElement> | undefined, dimensions: StaveDimensions, halfPositions?: HalfPosition[]): MousePosition => {

    const [cursorPosition, setCursorPosition] = useState<MousePosition>({x: 0, y: 0, cx: 0, cy: 0});

    useEffect(() => {
        if (!elementRef?.current) {
            return
        }
        const updateMousePosition = (ev: MouseEvent) => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const cx = ev.clientX - rect.left
                    + (elementRef.current.scrollLeft || 0)
                    - Layout.stave.container.PADDING_X_START
                    + Layout.stave.note.SPACING;
                const cy = ev.clientY - rect.top;

                let x = Math.round(cx / Layout.stave.note.SPACING) - 1;
                if ( halfPositions?.length) {
                    const inMiddle = halfPositions.find(it => cx >= it.cutoffCoordStart && cx < it.cutoffCoordEnd);
                    if (inMiddle) {
                        x = inMiddle.position;
                    }
                }
                const y = Math.floor(cy / dimensions.y);

                setCursorPosition({
                    x, y, cx: Math.round(cx), cy: Math.round(cy)
                });
            }
        };

        const currentElement = elementRef.current;
        if (currentElement) {
            currentElement.addEventListener('mousemove', updateMousePosition);
        }

        return () => {
            if (currentElement) {
                currentElement.removeEventListener('mousemove', updateMousePosition);
            }
        };
    }, [elementRef?.current, dimensions]);

    return cursorPosition;
};

export default useCursorCoords;
