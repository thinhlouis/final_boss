import "./LoginPage.css";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import AuthContext from "../../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [error, setError] = useState("");

  const {
    handleUserLogin,
    handleLogout,
    auth: { isAuthenticated, error: authError },
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const timeLogout = 30 * 60 * 1000; // Thời gian logout sau khi đăng nhập thành công

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const success = await handleUserLogin(username, password, from);

    if (!success) {
      // authError sẽ được cập nhật từ context sau khi gọi handleUserLogin
      return;
    }
    setTimeout(handleLogout, timeLogout);
    // Nếu login thành công thì điều hướng, không cần làm gì ở đây vì đã navigate trong AuthState
  };

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/video-final-boss-202115-767");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="container_login_page">
      <form className="login-page" onSubmit={handleLogin}>
        <h1 id="title-login">Login Final Boss</h1>

        <div className="form-group">
          <input
            type="text"
            className="input_login"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group position-btn-hide">
          <input
            type={hidePass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleHidePass}
            className="hide_unhide p-b-hide"
          >
            {hidePass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>

        {error && <p className="error_login">{error}</p>}

        <button type="submit" className="btn_login">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
