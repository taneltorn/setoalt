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
                path: "/editor",
                element: <Editor/>,
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                ),
            }
            // {
            //     path: "/editor",
            //     // Wrap the Editor component in a ProtectedRoute
            //     element: (
            //         <ProtectedRoute allowedRoles={['admin', 'editor']}>
            //             <Editor />
            //         </ProtectedRoute>
            //     ),
            // }
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
