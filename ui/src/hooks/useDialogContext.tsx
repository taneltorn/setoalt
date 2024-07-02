import React, {useContext, useMemo, useState} from "react";
import {isEmpty} from "../utils/helpers.tsx";
import {DialogType} from "../utils/enums.ts";
import { DialogContext } from "../context/DialogContext.tsx";

interface Properties {
    children: React.ReactNode;
}

export const DialogContextProvider: React.FC<Properties> = (props) => {

    const [active, setActive] = useState<DialogType>();
    const [context, setContext] = useState<any>();

    const open = (type: DialogType, context?: any): void => {
        setActive(type);
        setContext(context);
    }

    const close = (): void => {
        setActive(undefined);
        setContext(undefined);
    }

    const ctx = useMemo(() => {
        return {
            active,
            open,
            close,
            context: context || {}
        }
    }, [active, context]);

    return <DialogContext.Provider value={ctx} {...props} />;
};


export const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (isEmpty(context)) {
        throw new Error('useDialogContext must be used within a DialogContextProvider')
    }

    return context;
};
