import "./EditProfile.css";
import { useInput } from "../../hook/useInput";
import userAPI from "../../apis/userAPI";
import AuthContext from "../../context/AuthContext/AuthContext";

import React, { useState, useContext } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import _ from "lodash";

export default function EditProfile() {
  const user = useOutletContext();

  const [payload, setPayload] = useState({
    fullname: user.fullname,
    email: user.email,
    date_of_birth: {
      day: user.date_of_birth.day,
      month: user.date_of_birth.month,
      year: user.date_of_birth.year,
    },
    address: user.address,
    phone: user.phone,
    gender: user.gender,
    password: "",
    re_password: "",
    security_code: "",
  });

  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedProfile, setCheckedProfile] = useState(true);
  const [checkedPassCode, setCheckedPassCode] = useState(false);

  // const fullname = useInput("");
  // const username = useInput("");
  // const email = useInput("");
  // const code = useInput("");
  // const password = useInput("");
  // const rePassword = useInput("");

  const { handleUserLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    fullname,
    email,
    date_of_birth: { day, month, year },
    phone,
    address,
    gender,
    password,
    re_password,
    security_code,
  } = payload;

  // const dataNeedUpdate = () => {
  //   let data = {};
  //   data._id = user._id;
  //   if (
  //     fullname.value &&
  //     fullname.value !== "" &&
  //     fullname.value !== user.fullname
  //   ) {
  //     data.fullname = fullname.value;
  //   }
  //   if (
  //     username.value &&
  //     username.value !== "" &&
  //     username.value !== user.username
  //   ) {
  //     data.username = username.value;
  //   }
  //   if (email.value && email.value !== "" && email.value !== user.email) {
  //     data.email = email.value;
  //   }
  //   if (code.value && code.value !== "" && code.value !== user.code) {
  //     data.code = code.value;
  //   }
  //   if (
  //     password.value &&
  //     password.value !== "" &&
  //     password.value !== user.password
  //   ) {
  //     data.password = password.value;
  //   }
  //   return data;
  // };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => {
        const isEmptyString = value === "" || value === null;
        // Sử dụng _.isEqual để so sánh sâu các đối tượng/mảng lồng nhau
        const isDuplicate =
          user.hasOwnProperty(key) && _.isEqual(user[key], value);
        return !isEmptyString && !isDuplicate;
      })
    );
    setNotification("");
    setLoading(true);
    try {
      await userAPI.update(filteredPayload);
      setNotification("Cập nhật thành công.");

      await handleUserLogin();

      navigate("/profile");
    } catch (error) {
      console.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-profile-container">
      <p style={{ textAlign: "left" }}>
        <span>
          <i style={{ color: "red" }}>*</i>Lưu ý không điền bất kì nội dung vào
          các trường không cần cập nhật!
        </span>
      </p>
      <div
        className="root_flex_row flex_start gap_1"
        style={{ marginTop: "1rem" }}
      >
        <label className="root_flex_row gap_025">
          <input
            type="checkbox"
            checked={checkedProfile}
            onChange={(e) => setCheckedProfile(e.target.checked)}
          />
          <span>edit profile</span>
        </label>
        <label className="root_flex_row gap_025">
          <input
            type="checkbox"
            checked={checkedPassCode}
            onChange={(e) => setCheckedPassCode(e.target.checked)}
          />
          <span>edit password & code</span>
        </label>
      </div>
      {checkedProfile && (
        <>
          <div className="form-edit">
            <label htmlFor="edit-profile-fullname">fullname</label>
            <input
              type="text"
              id="edit-profile-fullname"
              value={fullname}
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, fullname: e.target.value }))
              }
            />
          </div>
          <div className="form-edit">
            <label htmlFor="edit-profile-email">email</label>
            <input
              type="text"
              id="edit-profile-email"
              value={email}
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, email: e.target.value }))
              }
            />
          </div>
          <div className="form-edit">
            <label htmlFor="edit-profile-phone">phone</label>
            <input
              type="text"
              id="edit-profile-phone"
              value={phone}
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, phone: e.target.value }))
              }
            />
          </div>
          <div className="form-edit root_flex_row flex_start">
            <label htmlFor="edit-profile-day">birthay</label>
            <div className="form-edit-item">
              <input
                type="text"
                id="edit-profile-day"
                value={day}
                onChange={(e) =>
                  setPayload((prve) => ({
                    ...prve,
                    date_of_birth: {
                      ...payload.date_of_birth,
                      day: e.target.value,
                    },
                  }))
                }
              />
              <small>/</small>
              <input
                type="text"
                id="edit-profile-month"
                value={month}
                onChange={(e) =>
                  setPayload((prve) => ({
                    ...prve,
                    date_of_birth: {
                      ...payload.date_of_birth,
                      month: e.target.value,
                    },
                  }))
                }
              />
              <small>/</small>
              <input
                type="text"
                id="edit-profile-year"
                value={year}
                onChange={(e) =>
                  setPayload((prve) => ({
                    ...prve,
                    date_of_birth: {
                      ...payload.date_of_birth,
                      year: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="form-edit">
            <label htmlFor="edit-profile-sex">Gender</label>
            <select
              value={gender}
              id="edit-profile-sex"
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, gender: e.target.value }))
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="gay">Gay</option>
              <option value="les">Les</option>
            </select>
          </div>
          <div className="form-edit">
            <label htmlFor="edit-profile-address">address</label>
            <textarea
              type="text"
              id="edit-profile-address"
              value={address}
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, address: e.target.value }))
              }
            />
          </div>
        </>
      )}
      {checkedPassCode && (
        <>
          <div className="form-edit">
            <label htmlFor="edit-profile-password">password</label>
            <input
              type="password"
              id="edit-profile-password"
              value={password}
              autoComplete="new-password"
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, password: e.target.value }))
              }
            />
          </div>
          <div className="form-edit">
            <label htmlFor="edit-profile-re-password">re-password</label>
            <input
              type="password"
              id="edit-profile-re-password"
              value={re_password}
              autoComplete="new-password"
              onChange={(e) =>
                setPayload((prve) => ({ ...prve, re_password: e.target.value }))
              }
            />
          </div>
          <div className="form-edit">
            <label htmlFor="edit-profile-code">security code</label>
            <input
              type="password"
              id="edit-profile-code"
              autoComplete="new-code"
              value={security_code}
              onChange={(e) =>
                setPayload((prve) => ({
                  ...prve,
                  security_code: e.target.value,
                }))
              }
            />
          </div>
        </>
      )}

      <div className="form-edit button">
        {notification && <p className="notification">{notification}</p>}
        {error && <p className="error">{error}</p>}
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/profile");
          }}
          className="cancel-update-profile"
        >
          cancel
        </button>
        <button onClick={handleSubmitUpdate}>
          {loading ? "updating..." : "update profile"}
        </button>
      </div>
    </form>
  );
}
