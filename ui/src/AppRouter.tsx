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
import Login from "./views/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Admin from "./views/Admin.tsx";
import ApiStatus from "./views/ApiStatus.tsx";
import {Role} from "./context/AuthContext.tsx";

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
                path: "/login",
                element: <Login/>,
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
                path: "/scores/:id/edit",
                element: (
                    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.EDITOR]}>
                        <ScoreDetails isEditMode />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/editor",
                element: <Editor/>,
            },
            {
                path: "/api-status",
                element: <ApiStatus/>,
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.EDITOR]}>
                        <Admin />
                    </ProtectedRoute>
                ),
            }
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
