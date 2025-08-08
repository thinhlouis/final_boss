import "./LoginPage.css";
import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import AuthContext from "../../context/AuthContext/AuthContext";
import ReissuePassword from "../ResetPassword/ReissuePassword";

function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(false);

  const [chageReissue, setChangeReissue] = useState(false);

  const { handleSubmitLogin, error } = useContext(AuthContext);

  const location = useLocation();
  const path = location.pathname;

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  return (
    <>
      {chageReissue ? (
        <ReissuePassword setChangeReissue={setChangeReissue} />
      ) : (
        <div className="container_login_page">
          <h1 id="title-login" style={{ marginTop: "1rem" }}>
            Login
          </h1>
          <form
            className="login-page"
            onSubmit={(e) =>
              handleSubmitLogin(e, usernameOrEmail, password, path)
            }
          >
            <div className="login-box-center">
              <div className="form-group">
                <input
                  type="text"
                  className="input_login"
                  id="input_login"
                  value={usernameOrEmail}
                  onChange={(e) =>
                    setUsernameOrEmail(e.target.value.toLowerCase())
                  }
                />
                <label
                  htmlFor="input_login"
                  style={
                    usernameOrEmail ? { top: "-25%", fontSize: "0.9rem" } : {}
                  }
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
                  style={password ? { top: "-25%", fontSize: "0.9rem" } : {}}
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

              {error && <p className="error">{error}</p>}
              <div className="form-group">
                <p className="chage-reissue">
                  <span onClick={() => setChangeReissue(true)}>
                    Forgot Password
                  </span>
                </p>

                <button type="submit" className="btn_login">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginPage;
