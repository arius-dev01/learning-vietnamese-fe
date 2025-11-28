    import { JSX, useEffect, useState } from "react";
    import { Navigate } from "react-router-dom";
    import api from "../service/axiosClient";

    interface PrivateRouteProps {
        children: JSX.Element;
    }
    
    const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
        const [isVerified, setIsVerified] = useState<boolean | null>(null); // null = loading

        const token = localStorage.getItem("access_token");

        useEffect(() => {
            const check = async () => {
                if (!token) {
                    setIsVerified(false);
                } else {

                    setIsVerified(true);
                }
            }
            check();
        }, [token])


        if (isVerified === null) return <div>Loading...</div>;

        return isVerified ? children : <Navigate to="/login" replace />;


    }
    export default PrivateRoute;