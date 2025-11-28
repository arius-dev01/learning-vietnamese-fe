import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type ProtectedRouteProps = {
    children: ReactElement;
    requiredRole: string[];
};

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { user } = useAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Chờ user load xong (user !== undefined)
        if (user !== undefined) {
            setIsReady(true);
        }
    }, [user]);

    const token = localStorage.getItem("access_token");

    // Không có token → login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Đang load user → show loading
    if (!isReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#141f25]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );
    }

    // User === null → logout rồi
    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    // Check role
    if (!requiredRole.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};