// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@mantine/core/styles.css';
import "./i18n";
import './index.scss'
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import 'react-h5-audio-player/lib/styles.css';
import chroma from "chroma-js";

import {MantineProvider, createTheme} from '@mantine/core';
import {AuthContextProvider} from "./hooks/useAuth.tsx";
import {AudioContextProvider} from "./hooks/useAudioContext.tsx";
import {DevContextProvider} from "./hooks/useDevContext.tsx";
import {DialogContextProvider} from './hooks/useDialogContext.tsx';
import {PaginationContextProvider} from "./hooks/usePagination.tsx";
import {DataServiceContextProvider} from "./hooks/useDataService.tsx";

const theme = createTheme({
    fontFamily: 'Verdana, sans-serif',
    defaultRadius: 'xl',
    primaryColor: 'red',
    primaryShade: 9,
    colors: {
        // @ts-ignore
        red: chroma.scale("Reds").colors(10),
    },
    breakpoints: {
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '74em',
        xl: '90em',
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <MantineProvider theme={theme}>
        <DataServiceContextProvider>
            <DevContextProvider>
                <AuthContextProvider>
                    <DialogContextProvider>
                        <AudioContextProvider>
                            <PaginationContextProvider>
                                <App/>
                            </PaginationContextProvider>
                        </AudioContextProvider>
                    </DialogContextProvider>
                </AuthContextProvider>
            </DevContextProvider>
        </DataServiceContextProvider>
    </MantineProvider>
    // </React.StrictMode>,
)
