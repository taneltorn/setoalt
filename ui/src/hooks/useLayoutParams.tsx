import React, {useContext, useMemo, useState} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {LayoutParams} from "../model/LayoutParams.ts";
import {LayoutParamsContext} from "../context/LayoutParamsContext.tsx";
import {LayoutParamsMd, LayoutParamsLg, LayoutParamsSm} from "../utils/layout.tsx";

interface Properties {
    children: React.ReactNode;
}

export const Layouts = [
    LayoutParamsSm,
    LayoutParamsMd,
    LayoutParamsLg,
];

export const LayoutParamsContextProvider: React.FC<Properties> = ({children}) => {

    const [params, setParams] = useState<LayoutParams>(Layouts[1]);

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
