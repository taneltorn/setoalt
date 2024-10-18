import React, {useContext, useMemo, useState} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {DataServiceContext} from "../context/DataServiceContext.tsx";

interface Properties {
    children: React.ReactNode;
}

export const DataServiceContextProvider: React.FC<Properties> = ({children}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const context = useMemo(() => ({
        isLoading, setIsLoading,
        isSaving, setIsSaving
    }), [isLoading, isSaving]);

    return (
        <DataServiceContext.Provider value={context}>
            {children}
        </DataServiceContext.Provider>);
}

export const useDataService = () => {
    const context = useContext(DataServiceContext);
    if (isEmpty(context)) {
        throw new Error('useDataService must be used within a DataServiceContextProvider')
    }

    return context;
};
