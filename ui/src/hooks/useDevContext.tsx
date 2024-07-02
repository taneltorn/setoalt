import React, {useContext, useMemo, useState} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {DevContext} from "../context/DevContext.tsx";

interface Properties {
    children: React.ReactNode;
}

export const DevContextProvider: React.FC<Properties> = ({children}) => {

    const [isDevMode, setIsDevMode] = useState<boolean>(false);

    const context = useMemo(() => ({
        isDevMode, setIsDevMode
    }), [isDevMode]);

    return (
        <DevContext.Provider value={context}>
            {children}
        </DevContext.Provider>);
}


export const useDevMode = () => {
    const context = useContext(DevContext);
    if (isEmpty(context)) {
        throw new Error('useDevMode must be used within a DevContextProvider')
    }

    return context;
};
