import "./LoginPage.css";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import AuthContext from "../../context/AuthContext/AuthContext";
import authAPI from "../../apis/authAPI";
import ReissuePassword from "../ResetPassword/ReissuePassword";

function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [errors, setErrors] = useState("");
  const [chageReissue, setChangeReissue] = useState(false);

  const {
    handleUserLogin,
    auth: { error: errorState },
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      setErrors("Please fill in both fields.");
      return;
    }

    const infoLogin = {
      usernameOrEmail,
      password,
    };
    try {
      const response = await authAPI.login(infoLogin);

      const { accessToken } = response.data;

      sessionStorage.setItem("accessToken", accessToken);

      await handleUserLogin();
      navigate(from, { replace: true });
    } catch (err) {
      setErrors(err.response?.data?.message);
    }
  };

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  useEffect(() => {
    if (errorState) {
      setErrors(errorState);
    }
  }, [errorState]);

  return (
    <>
      {chageReissue ? (
        <ReissuePassword setChangeReissue={setChangeReissue} />
      ) : (
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
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
                <label
                  htmlFor="input_login"
                  style={usernameOrEmail ? { top: "-8px" } : {}}
                >
                  Username or Email
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

              {errors && <p className="error">{errors}</p>}
              <p
                className="chage-reissue"
                onClick={() => setChangeReissue(true)}
              >
                <span>Forgot Password</span>
              </p>

              <button type="submit" className="btn_login">
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginPage;
