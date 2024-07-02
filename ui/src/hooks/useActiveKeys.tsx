import React, {useContext, useMemo, useState} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {ActiveKeysContext} from '../context/ActiveKeysContext.tsx';

interface Properties {
    children: React.ReactNode;
}

export const ActiveKeysContextProvider: React.FC<Properties> = ({children}) => {

    const [isCtrlKeyActive, setIsCtrlKeyActive] = useState<boolean>(false);
    const [isShiftKeyActive, setIsShiftKeyActive] = useState<boolean>(false);

    const context = useMemo(() => ({
        isCtrlKeyActive, setIsCtrlKeyActive,
        isShiftKeyActive, setIsShiftKeyActive
    }), [isCtrlKeyActive, isShiftKeyActive]);

    return (
        <ActiveKeysContext.Provider value={context}>
            {children}
        </ActiveKeysContext.Provider>);
}

export const useActiveKeys = () => {
    const context = useContext(ActiveKeysContext);
    if (isEmpty(context)) {
        throw new Error('useActiveKeys must be used within a ActiveKeysContextProvider')
    }

    return context;
};
