import React, { useMemo, useState} from 'react';
import { DevModeContext } from './DevModeContext.tsx';

interface Properties {
    children: React.ReactNode;
}

const DevModeContextProvider: React.FC<Properties> = ({children}) => {

    const [isDevMode, setIsDevMode] = useState<boolean>(false);

    const context = useMemo(() => ({
        isDevMode,
        setIsDevMode
    }), [isDevMode]);

    return (
        <DevModeContext.Provider value={context}>
            {children}
        </DevModeContext.Provider>);
}

export default DevModeContextProvider;