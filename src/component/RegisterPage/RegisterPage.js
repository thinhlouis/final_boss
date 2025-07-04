import "./RegisterPage.css";
import authAPI from "../../apis/authAPI";

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [hideRePass, setHideRePass] = useState(false);
  const [hideCode, setHideCode] = useState(false);
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !role || !securityCode) {
      return setErrors("Please enter all fields!");
    }
    if (password !== rePassword) {
      return setErrors("Password & Re-password not matching");
    }

    const payload = {
      username: username,
      email: email,
      password: password,
      security_code: securityCode,
      role: role,
    };

    try {
      await authAPI.register(payload);

      Toast.fire({
        icon: "success",
        title: "Register successfully.",
      });

      setUsername("");
      setEmail("");
      setPassword("");
      setRePassword("");
      setSecurityCode("");
      setRole("");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrors(error);
    } finally {
    }
  };

  return (
    <div className="register_container">
      <h1 id="title-sigin" style={{ marginBottom: "10px" }}>
        Register Final Boss
      </h1>

      <form className="sigup-page" onSubmit={handleRegister}>
        <div className="form-group">
          <input
            type="text"
            className="input_sigup"
            id="input_sigup"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            tabIndex="1"
          />
          <label
            htmlFor="input_sigup"
            style={username ? { top: "-8px", color: "#657e1f" } : {}}
          >
            Username
          </label>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="input_sigup"
            id="input_email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            tabIndex="2"
          />
          <label
            htmlFor="input_email"
            style={email ? { top: "-8px", color: "#657e1f" } : {}}
          >
            Email
          </label>
        </div>
        <div className="form-group position-btn-hide">
          <input
            type={hidePass ? "text" : "password"}
            id="input_pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex="3"
          />
          <label
            htmlFor="input_pass"
            style={password ? { top: "-8px", color: "#657e1f" } : {}}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setHidePass((prev) => !prev)}
            className="hide_unhide p-b-hide"
          >
            {hidePass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>

        <div className="form-group">
          <input
            type={hideRePass ? "text" : "password"}
            id="input_repass"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            tabIndex="4"
          />
          <label
            htmlFor="input_repass"
            style={rePassword ? { top: "-8px", color: "#657e1f" } : {}}
          >
            Re-Password
          </label>
          <button
            type="button"
            onClick={() => setHideRePass((prev) => !prev)}
            className="hide_unhide p-b-hide"
          >
            {hideRePass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>
        <div className="form-group">
          <input
            type={hideCode ? "text" : "password"}
            className="input_sigup"
            id="input_code"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, ""))}
            tabIndex="5"
          />
          <label
            htmlFor="input_code"
            style={securityCode ? { top: "-8px", color: "#657e1f" } : {}}
          >
            Security Code
          </label>
          <button
            type="button"
            onClick={() => setHideCode((prev) => !prev)}
            className="hide_unhide p-b-hide"
          >
            {hideCode ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>
        <div className="form-group">
          <select
            value={role}
            id="input_role"
            onChange={(e) => setRole(e.target.value)}
            tabIndex="6"
          >
            <option value="" disabled hidden></option>
            <option value="super_root">SUPER ROOT</option>
            <option value="admin">ADMINISTRATOR</option>
            <option value="regular_member">REGULAR MEMBER</option>
          </select>
          <label
            htmlFor="input_role"
            style={role ? { top: "-8px", color: "#657e1f" } : {}}
          >
            Select Role
          </label>
        </div>
        {errors && <p className="error_login">{errors}</p>}

        <button type="submit" className="btn_sigup">
          Register
        </button>
      </form>
    </div>
  );
}
