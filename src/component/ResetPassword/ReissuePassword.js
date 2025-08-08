import React, { useState } from "react";
import { FcInfo, FcHighPriority } from "react-icons/fc";

import userAPI from "../../apis/userAPI";

function ReissuePassword({ setChangeReissue }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [notification, setNotification] = useState("");

  const handleReissuePassword = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail) {
      setErrors("Please fill in both fields.");
      return;
    }

    const infoReissue = {
      usernameOrEmail: usernameOrEmail,
    };
    setNotification("");
    setErrors("");
    try {
      const response = await userAPI.requestReset(infoReissue);
      setNotification(`${response.data?.message}`);
      setUsernameOrEmail("");
    } catch (err) {
      setErrors(err?.response?.data.message);
    }
  };

  return (
    <div className="container_login_page">
      <h1 id="title-login" style={{ marginTop: "1rem" }}>
        Reissue Password
      </h1>
      <form className="login-page" onSubmit={handleReissuePassword}>
        <div className="login-box-center">
          <div className="form-group">
            <input
              type="text"
              className="input_login"
              id="input_reissue_pass"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <label
              htmlFor="input_reissue_pass"
              style={usernameOrEmail ? { top: "-8px" } : {}}
            >
              Username or Email
            </label>
          </div>

          <p className="chage-reissue">
            <span onClick={() => setChangeReissue(false)}>Back Login</span>
          </p>
          {notification && (
            <p className="notification">
              <span className="icon-notification">
                <FcInfo />
              </span>{" "}
              {notification}
            </p>
          )}
          {errors && (
            <p className="error">
              <span className="icon-error">
                <FcHighPriority />
              </span>{" "}
              {errors}
            </p>
          )}
          <button type="submit" className="btn_login">
            Send Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReissuePassword;
