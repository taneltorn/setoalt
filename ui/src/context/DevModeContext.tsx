import React, {useContext} from 'react';
import {isEmpty} from "../utils/helpers.tsx";

export interface DevModeContextProperties {
    isDevMode: boolean;
    setIsDevMode: (value: boolean) => void;
}

export const DevModeContext = React.createContext<DevModeContextProperties>({} as DevModeContextProperties)
export const useDevMode = () => {
    const context = useContext(DevModeContext);
    if (isEmpty(context)) {
        throw new Error('useDevMode must be used within a DevModeContextProvider')
    }

    return context;
};
