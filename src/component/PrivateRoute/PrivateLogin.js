import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router";

const PrivateLogin = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  const { isAuthenticated, user } = auth;
  const isRoot = user?.role === "super_root";

  const location = useLocation();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (isAuthenticated && isRoot) {
    // Nếu đã xác thực và có vai trò phù hợp, hiển thị component con
    return children;
  } else {
    // Nếu không xác thực hoặc không có vai trò phù hợp, chuyển hướng
    return <Navigate to="/sigin" replace state={{ from: location.pathname }} />; //
  }
};

export default PrivateLogin;
