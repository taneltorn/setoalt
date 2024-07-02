import React from 'react';

export interface ActiveKeysContextProperties {
    isCtrlKeyActive: boolean;
    setIsCtrlKeyActive: (value: boolean) => void;
    isShiftKeyActive: boolean;
    setIsShiftKeyActive: (value: boolean) => void;
}

export const ActiveKeysContext = React.createContext<ActiveKeysContextProperties>({} as ActiveKeysContextProperties);
