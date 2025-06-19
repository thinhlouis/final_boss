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
    auth: { isAuthenticated },
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
    try {
      handleUserLogin(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass(!hidePass);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/video-final-boss-202115-767");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container_login_page">
      <form className="login-page" onSubmit={handleLogin}>
        <h1 id="title-login">Login Final Boss</h1>
        <div className="form-group">
          <input
            type="text"
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
          {hidePass ? (
            <button
              type="button"
              onClick={handleHidePass}
              className="hide_unhide p-b-hide"
            >
              <AiFillEye />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleHidePass}
              className="hide_unhide p-b-hide"
            >
              <AiFillEyeInvisible />
            </button>
          )}
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
