import React, { ReactNode, useEffect, useState } from "react";

type User = {
    email: string;
    role: string;
    fullName: string;
}

type AuthContextType = {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const login = (token: string) => {
        localStorage.setItem("access_token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.sub, role: payload.role, fullName: payload.fullName });

    };
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({ email: payload.sub, role: payload.role, fullName: payload.fullName });
        }
    }, [])

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
    )
}