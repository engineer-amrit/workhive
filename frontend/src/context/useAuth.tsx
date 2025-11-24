import axiosInstance from "@/config/axios";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    fullName: string;
    email: string;
}

interface AuthContextType {
    user: null | User;
    loading: boolean;
    logout?: () => void;
    fetchUser?: () => void;
}

interface Provider {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

const AuthProvider = ({ children }: Provider) => {
    const [loading, setLoaing] = useState(true);
    const [user, setUser] = useState<null | User>(null);

    const fetchUser = () => {
        setLoaing(true);
        axiosInstance.get("/client/").then((response) => {
            setUser(response.data);
        }).finally(() => {
            setLoaing(false);
        });
    };

    useEffect(() => {
        // defer calling fetchUser to avoid calling setState synchronously inside the effect
        Promise.resolve().then(fetchUser);
    }, []);

    const logout = () => {
        setLoaing(true);
        axiosInstance.get("/client/logout").then(() => {
            setUser(null);
        }).finally(() => {
            setLoaing(false);
        });
    };


    return (
        <AuthContext.Provider value={{ user, loading, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };