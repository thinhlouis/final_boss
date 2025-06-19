import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router";

const PrivateLogin = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  const { isAuthenticated } = auth;

  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location.pathname }} />
  );
};

export default PrivateLogin;
