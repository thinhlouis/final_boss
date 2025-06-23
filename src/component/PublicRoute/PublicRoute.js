import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom"; // Sửa lỗi chính tả từ "react-router" thành "react-router-dom"

const PublicRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  const { isAuthenticated } = auth; // Chỉ cần isAuthenticated ở đây

  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Vẫn hiển thị loading trong khi chờ xác thực
  }

  return isAuthenticated ? (
    <Navigate to="/" replace state={{ from: location.pathname }} />
  ) : (
    children
  );
};

export default PublicRoute;
