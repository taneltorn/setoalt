import React from "react";
import Editor from "./views/Editor.tsx";
import ScoreDetails from "./views/ScoreDetails.tsx";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.tsx";
import Home from "./views/Home.tsx";
import Scores from "./views/Scores.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/scores",
                element: <Scores/>,
            },
            {
                path: "/scores/:id",
                element: <ScoreDetails/>,
            },
            {
                path: "/editor",
                element: <Editor/>,
            },
        ]
    },
]);

const AppRouter = () => {

    return (<>
            <React.Suspense fallback={<p>Loading</p>}>
                <RouterProvider router={router} />
            </React.Suspense>
        </>
    );
};

export default AppRouter;
