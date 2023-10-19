import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children }: any) => {
    if (!isAuthenticated()) {
      return <Navigate to="/sign-in" replace />;
    }
    return children;
  };

  return ProtectedRoute;
};

export default ProtectedRoute;
