import AppRouter from "./AppRouter.tsx";

import "./i18n";
import {Notifications} from "@mantine/notifications";

function App() {

    return (
        <>
            <Notifications position="top-right" />
            <AppRouter/>
        </>
    )
}

export default App
