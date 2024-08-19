import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.tsx";
import Scores from "./views/scores/ScoreList.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Admin from "./views/admin/Admin.tsx";
import {Role} from "./utils/enums.ts";
import ScoreManager from "./views/scores/ScoreManager.tsx";
import Home from "./views/Home.tsx";
import ChangeLog from "./views/ChangeLog.tsx";
import Error from "./views/Error.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        ...(import.meta.env.VITE_ENVIRONMENT === "local" ? {} : {errorElement: <Error/>}),
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/changelog",
                element: <ChangeLog/>,
            },
            {
                path: "/scores",
                element: <Scores/>,
            },
            {
                path: "/scores/:id",
                element: <ScoreManager mode={"details"}/>,
            },
            {
                path: "/scores/:id/edit",
                element: (
                    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.EDITOR]}>
                        <ScoreManager mode={"edit"}/>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/editor",
                element: <ScoreManager mode={"new"}/>,
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                        <Admin/>
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: "/embed/:id",
        element: <ScoreManager mode={"embed"}/>,
        errorElement: <>Error</>
    }
]);

const AppRouter = () => {

    return (<>
            <React.Suspense fallback={<p>Loading</p>}>
                <RouterProvider router={router}/>
            </React.Suspense>
        </>
    );
};

export default AppRouter;
