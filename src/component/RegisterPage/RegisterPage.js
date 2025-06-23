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
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [errors, setErrors] = useState("");

  const native = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !role || !securityCode) {
      return setErrors("Please enter all fields!");
    }
    if (password !== rePassword) {
      return setErrors("Password & Re-password not matching");
    }

    const payload = {
      username,
      password,
      securityCode,
      role,
    };

    try {
      const response = await authAPI.register(payload);

      if (response) {
        return Toast.fire({
          icon: "success",
          title: "Register successfully.",
        });
      }
      setTimeout(() => {
        native("/");
      }, 2000);
    } catch (error) {
      setErrors(error);
    } finally {
    }
  };

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  return (
    <div className="register_container">
      <form className="sigup-page" onSubmit={handleRegister}>
        <h1 id="title-sigin">Register Final Boss</h1>

        <div className="form-group">
          <input
            type="text"
            className="input_sigup"
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

        <div className="form-group">
          <input
            type={hidePass ? "text" : "password"}
            placeholder="Re-Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="input_sigup"
            placeholder="Security Code"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled hidden>
              Select Role
            </option>
            <option value="super_root">SUPER ROOT</option>
            <option value="admin">ADMINISTRATOR</option>
            <option value="regular_member">REGULAR MEMBER</option>
          </select>
        </div>
        {errors && <p className="error_login">{errors}</p>}

        <button type="submit" className="btn_sigup">
          Register
        </button>
      </form>
    </div>
  );
}
