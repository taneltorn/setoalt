import React, {useContext} from "react";
import {isEmpty} from "../utils/helpers";

export enum DialogType {
    MICRO_TUNING,
    CLEAR_SCORE,
    TRANSPOSE,
    STAVE_SELECTION,
    JSON,
}

export interface Properties {
    active: DialogType | undefined;
    open: (type: DialogType, context?: any) => void;
    close: () => void;
    context: any | undefined;
}

export const DialogContext = React.createContext<Properties>({} as Properties);

export const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (isEmpty(context)) {
        throw new Error('useDialogContext must be used within a DialogContextProvider')
    }

    return context;
};
