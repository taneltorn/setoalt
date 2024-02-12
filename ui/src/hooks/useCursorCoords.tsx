import {RefObject, useState, useEffect} from 'react';
import {Layout} from "../utils/constants.ts";

type MousePosition = {
    x: number;
    y: number;
    cx: number;
    cy: number;
};

const useCursorCoords = (elementRef: RefObject<HTMLElement> | undefined): MousePosition => {

    const [cursorPosition, setCursorPosition] = useState<MousePosition>({x: 0, y: 0, cx: 0, cy: 0});

    useEffect(() => {
        if (!elementRef?.current) {
            return
        }
        const updateMousePosition = (ev: MouseEvent) => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const cx = ev.clientX - rect.left;
                const cy = ev.clientY - rect.top;

                let x = Math.round(cx / Layout.stave.note.SPACING) - 1;
                const y = Math.floor(cy / 250) ; // todo should be dynamic

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
    }, [elementRef?.current]);

    return cursorPosition;
};

export default useCursorCoords;
