import React from 'react';
import {LayoutParams} from "../model/LayoutParams.ts";

export interface LayoutParamsContextProperties {
    params: LayoutParams;
    setParams: (values: LayoutParams) => void;
}

export const LayoutParamsContext = React.createContext<LayoutParamsContextProperties>({} as LayoutParamsContextProperties)
