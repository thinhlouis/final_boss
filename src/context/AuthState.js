import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

import AuthContext from "./AuthContext";
import authAPI from "../apis/authAPI";

const STORAGE_KEYS = {
  TOKEN: "accessToken",
  USER_INFO: "userInfo",
};

const AuthState = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {},
    error: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const clearStorage = () => {
    Cookies.remove(STORAGE_KEYS.TOKEN);
    Cookies.remove(STORAGE_KEYS.USER_INFO);
  };

  const handleLogout = useCallback(() => {
    // Redirect to home
    navigate("/");
    // Clear all storage
    clearStorage();

    // Reset auth state
    setTimeout(() => {
      setAuth(
        {
          isAuthenticated: false,
          user: {},
          error: null,
        },
        1000
      );
    });
  }, [navigate]);

  const verifyToken = useCallback(async () => {
    try {
      await authAPI.verify();
      console.log("✅ Token hợp lệ");
      return true;
    } catch (err) {
      console.warn("⛔ Token không hợp lệ:", err);
      handleLogout();
      return false;
    }
  }, [handleLogout]);

  const handleUserLogin = useCallback(async () => {
    setError(null);

    try {
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        setAuth({
          isAuthenticated: false,
          user: {},
          error: null,
        });
        return;
      }

      const userData = Cookies.get(STORAGE_KEYS.USER_INFO);

      const cachedUser = userData ? JSON.parse(userData) : null;
      // Lấy thông tin user mới nhất
      const response_user = await authAPI.info();
      const user = response_user.data;

      setAuth({
        isAuthenticated: true,
        user: user?.userInfo || cachedUser,
        error: null,
      });
      Cookies.set(
        STORAGE_KEYS.USER_INFO,
        JSON.stringify(user?.userInfo || cachedUser)
      );
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      setError(error?.response?.data?.message || "Có lỗi xảy ra");
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [handleLogout, verifyToken]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = Cookies.get(STORAGE_KEYS.TOKEN);

      if (storedToken && storedToken !== "undefined") {
        // Nếu có token, cố gắng khôi phục session
        await handleUserLogin();
      } else {
        // Nếu không có token, người dùng rõ ràng là chưa đăng nhập
        setLoading(false); // Kết thúc loading ngay lập tức
        setAuth({ isAuthenticated: false, user: {}, error: null });
      }
    };
    initAuth();
  }, [handleUserLogin]);

  const contextValue = useMemo(
    () => ({
      auth,
      error,
      handleUserLogin,
      handleLogout,
      loading,
    }),
    [auth, error, handleUserLogin, handleLogout, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthState;
