import "./RegisterPage.css";
import authAPI from "../../apis/authAPI";

import React from "react";
import { useState, useEffect } from "react";
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
  const [hidePass, setHidePass] = useState(false);
  const [hideRePass, setHideRePass] = useState(false);
  const [hideCode, setHideCode] = useState(false);
  const [errors, setErrors] = useState("");

  const [infoRegister, setInfoRegister] = useState({
    avatar: "https://i.postimg.cc/3x414VD3/default.png",
    fullname: "",
    username: "",
    email: "",
    password: "",
    rePassword: "",
    date_of_birth: {
      day: "",
      month: "",
      year: "",
    },
    gender: "",
    address: "",
    phone: "",
    role: "",
    security_code: "",
  });

  const {
    fullname,
    username,
    email,
    password,
    rePassword,
    date_of_birth: { day, month, year },
    gender,
    address,
    phone,
    role,
    security_code,
  } = infoRegister;

  const navigate = useNavigate();

  const handleChangeRegister = (
    event,
    key,
    props,
    applyDigitFilter = false
  ) => {
    let value = event.target.value;

    if (applyDigitFilter) {
      value = value.replace(/\D/g, "");
    }

    if (!props) {
      setInfoRegister((prve) => ({ ...prve, [key]: value }));
    } else {
      setInfoRegister((prve) => ({
        ...prve,
        [key]: { ...(prve[key] || {}), [props]: value },
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !role || !security_code) {
      return setErrors("Please enter all fields!");
    }
    if (password !== rePassword) {
      return setErrors("Password & Re-password not matching");
    }

    const payload = {
      rePassword,
      ...infoRegister,
    };

    try {
      await authAPI.register(payload);

      Toast.fire({
        icon: "success",
        title: "Register successfully.",
      });
      setInfoRegister({
        avatar: "https://i.postimg.cc/3x414VD3/default.png",
        fullname: "",
        username: "",
        email: "",
        password: "",
        rePassword: "",
        date_of_birth: {
          day: "",
          month: "",
          year: "",
        },
        gender: "",
        address: "",
        phone: "",
        role: "",
        security_code: "",
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrors(error);
    } finally {
    }
  };

  return (
    <div className="register_container root_flex_column">
      <h1 id="title-sigup" style={{ marginBottom: "10px" }}>
        Register Final Boss
      </h1>

      <div className="register_page">
        <form className="form_registers" onSubmit={handleRegister}>
          <section className="form_item root_flex_row">
            <div className="form-group root_flex_column">
              <label htmlFor="input_fullname">Fullname</label>
              <input
                type="text"
                className="input_sigup"
                id="input_fullname"
                autoComplete="off"
                value={fullname}
                onChange={(e) =>
                  handleChangeRegister(e, "fullname", null, false)
                }
                tabIndex="0"
              />
            </div>
            <div className="form-group">
              <div className="date_of_birth root_flex_row">
                <div className="root_flex_column item_start date_item">
                  <label htmlFor="input_day">Day</label>
                  <input
                    type="text"
                    value={day}
                    className="input_sigup_birth"
                    id="input_day"
                    placeholder="DD"
                    onChange={(e) =>
                      handleChangeRegister(e, "date_of_birth", "day", true)
                    }
                    tabIndex="1"
                  />
                </div>
                <div className="root_flex_column item_start date_item">
                  <label htmlFor="input_day">Day</label>
                  <input
                    type="text"
                    value={month}
                    className="input_sigup_birth"
                    id="input_month"
                    placeholder="MM"
                    onChange={(e) =>
                      handleChangeRegister(e, "date_of_birth", "month", true)
                    }
                    tabIndex="1"
                  />
                </div>
                <div className="root_flex_column item_start date_item">
                  <label htmlFor="input_day">Day</label>
                  <input
                    type="text"
                    value={year}
                    className="input_sigup_birth"
                    id="input_year"
                    placeholder="YYYY"
                    onChange={(e) =>
                      handleChangeRegister(e, "date_of_birth", "year", true)
                    }
                    tabIndex="1"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="form_item root_flex_row">
            <div className="form-group root_flex_column">
              <label htmlFor="input_username">Username</label>
              <input
                type="text"
                className="input_sigup"
                id="input_username"
                autoComplete="off"
                value={username}
                onChange={(e) =>
                  handleChangeRegister(e, "username", null, false)
                }
                tabIndex="1"
              />
            </div>

            <div className="form-group root_flex_column">
              <label htmlFor="input_email">Email</label>
              <input
                type="text"
                className="input_sigup"
                id="input_email"
                autoComplete="off"
                value={email}
                onChange={(e) => handleChangeRegister(e, "email", null, false)}
                tabIndex="2"
              />
            </div>
          </section>
          <section className="form_item root_flex_row">
            <div className="form-group root_flex_column position-btn-hide">
              <label htmlFor="input_pass">Password</label>
              <input
                type={hidePass ? "text" : "password"}
                id="input_pass"
                value={password}
                onChange={(e) =>
                  handleChangeRegister(e, "password", null, false)
                }
                tabIndex="3"
              />

              <button
                type="button"
                onClick={() => setHidePass((prev) => !prev)}
                className="hide_unhide p-b-hide"
              >
                {hidePass ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>

            <div className="form-group root_flex_column">
              <label htmlFor="input_repass">Re-Password</label>
              <input
                type={hideRePass ? "text" : "password"}
                id="input_repass"
                value={rePassword}
                onChange={(e) =>
                  handleChangeRegister(e, "rePassword", null, false)
                }
                tabIndex="4"
              />

              <button
                type="button"
                onClick={() => setHideRePass((prev) => !prev)}
                className="hide_unhide p-b-hide"
              >
                {hideRePass ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
          </section>
          <section className="form_item root_flex_row">
            <div className="form-group root_flex_column">
              <label htmlFor="input_phone">Phone</label>
              <input
                type="text"
                className="input_sigup"
                id="input_phone"
                value={phone}
                onChange={(e) => handleChangeRegister(e, "phone", null, true)}
                tabIndex="5"
              />
            </div>
            <div className="form-group root_flex_column">
              <label htmlFor="input_gender">Gender</label>
              <select
                value={gender}
                id="input_gender"
                onChange={(e) => handleChangeRegister(e, "gender", null, false)}
                tabIndex="6"
              >
                <option value="" disabled hidden></option>
                <option value="male">MALE</option>
                <option value="female">FEMALE</option>
                <option value="gay">GAY</option>
                <option value="les">LES</option>
              </select>
            </div>
          </section>
          <section className="form_item address">
            <div className="form-group root_flex_column">
              <label htmlFor="input_address">Address</label>
              <textarea
                className="input_sigup"
                id="input_address"
                value={address}
                onChange={(e) =>
                  handleChangeRegister(e, "address", null, false)
                }
                tabIndex="5"
              />
            </div>
          </section>
          <section className="form_item root_flex_row">
            <div className="form-group root_flex_column">
              <label htmlFor="input_code">Security Code</label>
              <input
                type={hideCode ? "text" : "password"}
                className="input_sigup"
                id="input_code"
                value={security_code}
                onChange={(e) =>
                  handleChangeRegister(e, "security_code", null, true)
                }
                tabIndex="5"
              />

              <button
                type="button"
                onClick={() => setHideCode((prev) => !prev)}
                className="hide_unhide p-b-hide"
              >
                {hideCode ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <div className="form-group root_flex_column">
              <label htmlFor="input_role">Select Role</label>
              <select
                value={role}
                id="input_role"
                onChange={(e) => handleChangeRegister(e, "role", null, false)}
                tabIndex="6"
              >
                <option value="" disabled hidden></option>
                <option value="super_root">SUPER ROOT</option>
                <option value="admin">ADMINISTRATOR</option>
                <option value="moderator">MODERATOR</option>
                <option value="regular_member">REGULAR MEMBER</option>
              </select>
            </div>
          </section>

          <div className="form-group">
            {errors && <p className="error_login">{errors}</p>}
            <button type="submit" className="btn_sigup">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
