import React, {useMemo, useState} from "react";
import {DialogContext, DialogType} from "./DialogContext";

interface Properties {
    children: React.ReactNode;
}

const DialogContextProvider: React.FC<Properties> = (props) => {

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

export default DialogContextProvider;