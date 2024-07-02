import React, {ReactNode} from "react";
import {NoteControlsContextProvider} from "./hooks/useNoteControls.tsx";
import {LayoutControlsContextProvider} from "./hooks/useLayoutControls.tsx";
import {ActiveKeysContextProvider} from "./hooks/useActiveKeys.tsx";
import {HistoryContextProvider} from "./hooks/useHistory.tsx";
import {ScoreContextProvider} from "./hooks/useScoreContext.tsx";

interface Properties {
    children: ReactNode;
}

const ContextProviders: React.FC<Properties> = ({children}) => {

    return (
        <ActiveKeysContextProvider>
            <HistoryContextProvider>
                <ScoreContextProvider>
                    <LayoutControlsContextProvider>
                        <NoteControlsContextProvider>
                            {children}
                        </NoteControlsContextProvider>
                    </LayoutControlsContextProvider>
                </ScoreContextProvider>
            </HistoryContextProvider>
        </ActiveKeysContextProvider>
    );
}

export default ContextProviders;
