import React from "react";
import {DialogType} from "../utils/enums.ts";

export interface Properties {
    active: DialogType | undefined;
    open: (type: DialogType, context?: any) => void;
    close: () => void;
    context: any | undefined;
}

export const DialogContext = React.createContext<Properties>({} as Properties);
