import "./ResetPassword.css";

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import authAPI from "../../apis/authAPI";

function ResetPasswordForm({ token, loading }) {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [hiddenRePassword, setHiddenRePassword] = useState(false);

  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setNotification("");
    setError("");

    if (!password) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== rePassword) {
      setError("Password and Re-Password not macth!");
      return;
    }

    const infoPayload = {
      token: token,
      newPassword: password,
    };

    try {
      const response = await authAPI.confirmReset(infoPayload);

      setNotification(`${response.data?.message}`);
      setPassword("");
      setRePassword("");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigate("/sigin");
      }, 5000);
    } catch (err) {
      setError(err?.response?.data.message);
    }
  };

  return (
    <>
      {!loading && (
        <div className="container_login_page">
          <h1 id="title-login" style={{ marginTop: "1rem" }}>
            Reset Password Final Boss
          </h1>
          <form className="login-page" onSubmit={handleResetPassword}>
            <div className="login-box-center">
              <div className="form-group reset-password">
                <input
                  type={hiddenPassword ? "text" : "password"}
                  className="input_login"
                  id="input_reset_pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  tabIndex="1"
                />
                <label
                  htmlFor="input_reset_pass"
                  style={password ? { top: "-8px" } : {}}
                >
                  New password
                </label>
                <button
                  type="button"
                  className="hidden-reset-pass"
                  onClick={() => setHiddenPassword(!hiddenPassword)}
                >
                  {hiddenPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              <div className="form-group reset-password">
                <input
                  type={hiddenRePassword ? "text" : "password"}
                  className="input_reset_r-pass"
                  id="input_login"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  tabIndex="2"
                />
                <label
                  htmlFor="nput_reset_r-pass"
                  style={rePassword ? { top: "-8px" } : {}}
                >
                  Re-new-Password
                </label>
                <button
                  type="button"
                  className="hidden-reset-pass"
                  onClick={() => setHiddenRePassword(!hiddenRePassword)}
                >
                  {hiddenRePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              {notification && (
                <p className="notification">
                  {notification}{" "}
                  <strong style={{ color: "#657e1f" }}>
                    <Link to="/sigin">Go to Login</Link>
                  </strong>
                </p>
              )}
              {error && <p className="error">{error}</p>}

              <button type="submit" className="btn_login">
                Submit Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ResetPasswordForm;
