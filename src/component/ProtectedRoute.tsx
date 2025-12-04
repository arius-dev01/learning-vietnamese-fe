import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type ProtectedRouteProps = {
  children: ReactElement;
  requiredRole: string[];
};

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem("access_token");

  // Đang loading, hiển thị spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141f25]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Không có token → chưa login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User === null sau khi load xong → token hết hạn hoặc lỗi
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // Check role
  if (!requiredRole.includes(user.roleName)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
