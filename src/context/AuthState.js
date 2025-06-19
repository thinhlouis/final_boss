import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "./AuthContext";

const STORAGE_KEYS = {
  TOKEN: "accessToken",
};

const LISTVIDEO = process.env.REACT_APP_UIR_API;

const AuthState = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    accessToken: null,
    videos: [],
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearStorage = () => {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const fetchVideos = useCallback(async () => {
    let videoList = [];
    await axios
      .get(`${LISTVIDEO}`)
      .then((response) => {
        videoList = response.data;
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
    return videoList;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const currentlyLogin = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
      const videos = await fetchVideos(); // Luôn fetch videos

      if (currentlyLogin === process.env.REACT_APP_SECRETKEY) {
        setAuth({
          isAuthenticated: true,
          accessToken: currentlyLogin,
          videos: videos,
        });
      } else {
        // Trường hợp không có token HOẶC token không hợp lệ
        setAuth({
          isAuthenticated: false,
          accessToken: null,
          videos: videos, // Vẫn cập nhật videos
        });
        if (currentlyLogin) {
          // Chỉ cảnh báo nếu có token nhưng không hợp lệ
          console.warn(
            "Invalid secret key found in session storage. Authentication failed."
          );
        }
      }
    };

    initializeAuth();
  }, [fetchVideos]); // Thêm fetchVideos vào dependency array

  const handleLogout = useCallback(() => {
    // Clear all storage
    clearStorage();

    // Reset auth state
    setAuth({
      isAuthenticated: false,
      accessToken: null,
    });

    // Redirect to home
    navigate("/");
  }, [navigate]);

  const handleUserLogin = useCallback(
    async (username, password) => {
      setLoading(true); // Bắt đầu tải

      const isLoginSuccessful =
        username === process.env.REACT_APP_USERNAME &&
        password === process.env.REACT_APP_PASSWORD;

      if (!isLoginSuccessful) {
        console.error("Invalid username or password.");
        setAuth({
          // Đặt lại trạng thái nếu đăng nhập không thành công
          isAuthenticated: false,
          accessToken: null,
          videos: [],
        });
        setLoading(false); // Kết thúc tải ngay đây
        return;
      }

      try {
        const videos = await fetchVideos();
        sessionStorage.setItem("accessToken", process.env.REACT_APP_SECRETKEY);

        setAuth({
          isAuthenticated: true,
          accessToken: process.env.REACT_APP_SECRETKEY,
          videos: videos,
        });
        navigate("/video-final-boss-202115-767");
      } catch (error) {
        console.error("Login failed:", error);
        setAuth({
          isAuthenticated: false,
          accessToken: null,
          videos: [],
        });
      } finally {
        setLoading(false); // Luôn kết thúc tải, dù thành công hay thất bại
      }
    },
    [navigate, fetchVideos]
  );

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      loading,
      handleUserLogin,
      handleLogout,
      fetchVideos,
    }),
    [auth, loading, handleUserLogin, handleLogout, fetchVideos]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthState;
