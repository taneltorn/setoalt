// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@mantine/core/styles.css';
import './index.scss'
import '@mantine/notifications/styles.css';

import {MantineProvider, createTheme} from '@mantine/core';
import DialogContextProvider from "./context/DialogContextProvider.tsx";
import AudioContextProvider from "./context/AudioContextProvider.tsx";
import {AuthContextProvider} from "./context/AuthContextProvider.tsx";
import DevModeContextProvider from "./context/DevModeContextProvider.tsx";

const theme = createTheme({
    fontFamily: 'Verdana, Montserrat, sans-serif',
    defaultRadius: 'xl',
    primaryColor: 'red',
    primaryShade: 9,
    colors: {
        'red':['#970000', '#970000', '#970000', '#970000', '#E70000', '#D70000', '#C70000', '#B70000', '#A70000', '#970000'],

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
        <DevModeContextProvider>
            <AuthContextProvider>
                <DialogContextProvider>
                    <AudioContextProvider>
                        <App/>
                    </AudioContextProvider>
                </DialogContextProvider>
            </AuthContextProvider>
        </DevModeContextProvider>
    </MantineProvider>
    // </React.StrictMode>,
)
