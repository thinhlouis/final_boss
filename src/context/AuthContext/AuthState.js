import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import AuthContext from "./AuthContext";
import authAPI from "../../apis/authAPI";
import { session, local } from "../../utils/setStorage";

const STORAGE_KEYS = {
  TOKEN: "accessToken",
  USER_INFO: "userInfo",
  VERIFY_CODE: "validated",
  IS_AUTH: "isAuth",
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
    session.remove(STORAGE_KEYS.USER_INFO);
    session.remove(STORAGE_KEYS.VERIFY_CODE);
    local.remove(STORAGE_KEYS.IS_AUTH);
  };

  const handleLogout = useCallback(async () => {
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
      await authAPI.verifyToken();
      console.log("✅ Token hợp lệ");
      return true;
    } catch (err) {
      console.warn("⛔ Token không hợp lệ:", err);
      handleLogout();
      window.location.reload();
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

      const userData = session.get(STORAGE_KEYS.USER_INFO);

      const cachedUser = userData ? userData : {};
      // Lấy thông tin user mới nhất
      const response_user = await authAPI.info();
      const user = response_user.data;

      setAuth({
        isAuthenticated: true,
        user: user?.userInfo || cachedUser,
        error: null,
      });
      session.set(
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

  const handleSubmitLogin = useCallback(
    async (e, name, pass, path) => {
      e.preventDefault();

      if (!name || !pass) {
        setError("Please fill in both fields.");
        return;
      }

      const payloadLogin = {
        usernameOrEmail: name,
        password: pass,
      };

      try {
        const response = await authAPI.login(payloadLogin);

        const { accessToken } = response.data;

        Cookies.set("accessToken", accessToken, { expires: 1 });

        await handleUserLogin();
        navigate(path, { replace: true });
      } catch (err) {
        setError(err.response?.data?.message);
      }
    },
    [handleUserLogin, navigate]
  );

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
      handleSubmitLogin,
      handleLogout,
      loading,
    }),
    [auth, error, handleUserLogin, handleSubmitLogin, handleLogout, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthState;
