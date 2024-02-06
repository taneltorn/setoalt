import { Navigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";
import {ReactNode, useEffect} from "react";

interface Properties {
    children: ReactNode;
}

const ProtectedRoute: React.FC<Properties> = ({ children }) => {
    const auth = useAuth();

    if (!auth.currentUser) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        // const verify = async () => {
        //     auth.verify(); // Make sure this method exists and is implemented in useAuth
        // };
        //
        // verify();
        auth.verify(); // Make sure this method exists and is implemented in useAuth

    }, [auth]);

    return children;
};

export default ProtectedRoute;