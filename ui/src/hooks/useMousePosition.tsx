import {RefObject, useState, useEffect} from 'react';

type MousePosition = {
    x: number;
    y: number;
    cx: number;
    cy: number;
};

const useMousePosition = (elementRef: RefObject<HTMLElement>): MousePosition => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({x: 0, y: 0, cx: 0, cy: 0});

    useEffect(() => {
        if (!elementRef?.current) {
            return
        }
        const updateMousePosition = (ev: MouseEvent) => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const cx = ev.clientX - rect.left;
                const cy = ev.clientY - rect.top;

                const x = Math.round(cx / 50) - 1;
                const y = cy;

                setMousePosition({
                    x, y, cx, cy
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

    return mousePosition;
};

export default useMousePosition;
