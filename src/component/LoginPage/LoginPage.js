import "./LoginPage.css";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Cookies from "js-cookie";

import AuthContext from "../../context/AuthContext";
import authAPI from "../../apis/authAPI";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [errors, setErrors] = useState("");

  const {
    handleUserLogin,
    handleLogout,
    auth: { error: authError },
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const timeLogout = 60 * 60 * 1000; // Thời gian logout sau khi đăng nhập thành công

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrors("Please fill in both fields.");
      return;
    }

    const payload = {
      username,
      password,
    };
    try {
      const response = await authAPI.login(payload);

      const { accessToken } = response.data;

      Cookies.set("accessToken", accessToken);
      await handleUserLogin();
      navigate(from, { replace: true });
    } catch (err) {
      setErrors(authError);
    }

    setTimeout(handleLogout, timeLogout);
  };

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  useEffect(() => {
    if (authError) {
      setErrors(authError);
    }
  }, [authError]);

  return (
    <div className="container_login_page">
      <h1 id="title-login" style={{ marginTop: "1rem" }}>
        Login Final Boss
      </h1>
      <form className="login-page" onSubmit={handleLogin}>
        <div className="login-box-center">
          <div className="form-group">
            <input
              type="text"
              className="input_login"
              id="input_login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label
              htmlFor="input_login"
              style={username ? { top: "-8px" } : {}}
            >
              Username
            </label>
          </div>

          <div className="form-group position-btn-hide">
            <input
              type={hidePass ? "text" : "password"}
              id="input_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="input_password"
              style={password ? { top: "-8px" } : {}}
            >
              Password
            </label>
            <button
              type="button"
              onClick={handleHidePass}
              className="hide_unhide p-b-hide"
            >
              {hidePass ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>

          {errors && <p className="error_login">{errors}</p>}

          <button type="submit" className="btn_login">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
