import React from 'react';

export interface DevContextProperties {
    isDevMode: boolean;
    setIsDevMode: (value: boolean) => void;
}

export const DevContext = React.createContext<DevContextProperties>({} as DevContextProperties)
