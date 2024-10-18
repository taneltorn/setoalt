import React from 'react';

export interface DataServiceContextProperties {
    isLoading: boolean;
    isSaving: boolean;

    setIsLoading: (value: boolean) => void;
    setIsSaving: (value: boolean) => void;
}

export const DataServiceContext = React.createContext<DataServiceContextProperties>({} as DataServiceContextProperties);
