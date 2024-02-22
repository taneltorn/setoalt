import AppRouter from "./AppRouter.tsx";
import {Notifications} from "@mantine/notifications";
import "./i18n";

function App() {

    return (
        <>
            <Notifications position="top-right" />
            <AppRouter/>
        </>
    )
}

export default App
