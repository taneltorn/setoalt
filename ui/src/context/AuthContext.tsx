import {createContext, useContext} from 'react';

export interface UserDetails {
    id: number;
    username: string;
    role: string;
}

export interface AuthContextProperties {
    currentUser:  UserDetails | null | undefined;
    login: (username: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
    verify: () => void;
}

export const AuthContext = createContext<AuthContextProperties | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};