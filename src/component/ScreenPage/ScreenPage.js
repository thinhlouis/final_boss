import "./ScreenPage.css";

import React from "react";
import { useContext } from "react";

import AuthContext from "../../context/AuthContext/AuthContext";
import LoginPage from "../LoginPage/LoginPage";
import { local } from "../../utils/setStorage";

export default function ScreenPage({ children }) {
  const { auth } = useContext(AuthContext);
  const { isAuthenticated } = auth;
  const isAuth = isAuthenticated || local.get("isAuth");
  return isAuth ? (
    children
  ) : (
    <div>
      <div className="title-login-movie">
        <p>
          Trang này yêu cầu <span>login</span>, vui lòng <span>login</span> rồi
          thử lại.
        </p>
        <p>
          Nếu chưa có tài khoản, vui lòng liên hệ <span>QTV</span> để được cung
          cấp.
        </p>
      </div>
      <LoginPage />
    </div>
  );
}
