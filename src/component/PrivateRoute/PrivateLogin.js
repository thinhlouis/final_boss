import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import { Navigate, useLocation } from "react-router";

const Private = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  const { isAuthenticated } = auth;

  const location = useLocation();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (isAuthenticated) {
    // Nếu đã xác thực và có vai trò phù hợp, hiển thị component con
    return children;
  } else {
    // Nếu không xác thực hoặc không có vai trò phù hợp, chuyển hướng
    return <Navigate to="*" replace state={{ from: location.pathname }} />; //
  }
};

export default Private;
