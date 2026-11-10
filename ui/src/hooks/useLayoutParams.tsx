import React, {useContext, useMemo, useState} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {LayoutParams} from "../model/LayoutParams.ts";
import {LayoutParamsContext} from "../context/LayoutParamsContext.tsx";
import {CompactLayoutParams} from "../utils/layout.tsx";

interface Properties {
    children: React.ReactNode;
}

export const LayoutParamsContextProvider: React.FC<Properties> = ({children}) => {

    const [params, setParams] = useState<LayoutParams>(CompactLayoutParams);

    const context = useMemo(() => ({
        params, setParams,
    }), [params]);

    return (
        <LayoutParamsContext.Provider value={context}>
            {children}
        </LayoutParamsContext.Provider>);
}
export const useLayoutParams = () => {
    const context = useContext(LayoutParamsContext);
    if (isEmpty(context)) {
        throw new Error('useLayoutParams must be used within a LayoutParamsContextProvider')
    }

    return context;
};
