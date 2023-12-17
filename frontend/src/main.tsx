// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@mantine/core/styles.css';
import './index.scss'
import '@mantine/notifications/styles.css';

import {MantineProvider, createTheme} from '@mantine/core';
import DialogContextProvider from "./context/DialogContextProvider.tsx";
import AudioContextProvider from "./context/AudioContextProvider.tsx";

const theme = createTheme({
    fontFamily: ' Montserrat, sans-serif',
    defaultRadius: 'xl',
    primaryColor: 'red',
    primaryShade: 9,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <MantineProvider theme={theme}>
        <DialogContextProvider>
            <AudioContextProvider>
                <App/>
            </AudioContextProvider>
        </DialogContextProvider>
    </MantineProvider>
    // </React.StrictMode>,
)
