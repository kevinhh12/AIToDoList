import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserData {
    id: string;
    name: string;
    email: string;
    picture: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    userData: UserData | null;
    checkLoginStatus: () => Promise<void>;
    handleLogout: () => Promise<void>;
    handleGoogleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3000/login/auth/status', {
                withCredentials: true
            });

            if (response.status === 200) {
                setUserData(response.data);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/login/auth/google';
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/login/auth/logout',
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                console.log('Logout successful on client side. Updating state...');
                setIsLoggedIn(false);
                setUserData(null);
                // No need to call checkLoginStatus here, as state is already updated
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userData, checkLoginStatus, handleLogout, handleGoogleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 