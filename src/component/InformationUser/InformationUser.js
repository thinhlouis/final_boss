import "./InformationUser.css";
import adminAPI from "../../apis/adminAPI";
import formattedDate from "../../utils/formattedDate";
import useDebounce from "../../utils/useDebounce";

import React from "react";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function InformationUser() {
  const [usersFind, setUsersFind] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [hiddenPassUpdate, setHiddenPassUpdate] = useState(true);
  const [hiddenCodeUpdate, setHiddenCodeUpdate] = useState(true);
  //
  const [edited, setEdited] = useState(false);
  const [user, setUser] = useState({});
  const [payload, setPayload] = useState({});

  const objRoles = {
    super_root: "Final Boss",
    admin: "Administrator",
    moderator: "Moderator",
    regular_member: "Member",
  };

  const {
    fullname,
    username,
    email,
    phone,
    password,
    security_code,
    role,
    status,
  } = payload;

  const fetchSearchUsers = async (searchKeyword) => {
    if (!searchKeyword.trim()) {
      setUsersFind([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await adminAPI.search(searchKeyword);
      setUsersFind(response.data.users);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching search users:", error);
      setError(
        error.response?.data?.message ||
          "Đã có lỗi xảy ra khi tìm kiếm người dùng."
      );
      setUsersFind([]); // Xóa kết quả nếu có lỗi;
      setShowTable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResultDebounce = useDebounce(fetchSearchUsers, 1000);

  const handleShowInfoUser = (id) => {
    if (usersFind.length === 0) return;
    const infomationUser = usersFind.find((user) => user.userId === id);
    const { fullname, username, email, phone, role, status } = infomationUser;

    if (!infomationUser) {
      setError("Không tìm thấy thông tin người dùng này!");
      return;
    }
    setError(""); // Xóa lỗi nếu tìm thấy
    setEdited(true);
    setKeyword("");
    setShowTable(false);

    setUser(infomationUser);
    setPayload({
      fullname,
      username,
      email,
      phone,
      role,
      status,
      password: "",
      security_code: "",
    });
  };

  const handleChangeSearch = (e) => {
    if (!e.target.value) {
      setShowTable(false);
      setHiddenCodeUpdate(true);
      setHiddenPassUpdate(true);
      setError("");
      setNotification("");
    }

    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    handleResultDebounce(newKeyword);
  };

  const handleCancelRequestUpdate = () => {
    setEdited(false);
    setShowTable(true);
  };

  const handleSendRequestUpdate = async () => {
    setNotification("");
    setError("");

    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => {
        const isEmptyString = value === "";
        const isDuplicate = user.hasOwnProperty(key) && user[key] === value;
        return !isEmptyString && !isDuplicate;
      })
    );
    try {
      const result = await adminAPI.update(filteredPayload);
      setNotification(result.data.message);
      setKeyword("");
      setUser({});
      setPayload({});
      setEdited(false);
      setShowTable(false);
      setHiddenCodeUpdate(true);
      setHiddenPassUpdate(true);
    } catch (error) {
      setError(error?.response.data.message);
    }
  };

  return (
    <div className="infomation-container root_flex_column">
      <div className="header_search root_flex_row">
        <p className="style-color-search">SEARCH USER</p>
        <div className="search">
          <p>
            <span>
              <RiSearchLine />
            </span>
          </p>
          <input
            type="search"
            value={keyword}
            name="search"
            onChange={handleChangeSearch}
            onInput={() => handleResultDebounce(keyword)}
          ></input>
        </div>
      </div>

      {!showTable && (
        <>
          {error && <p className="error">{error}</p>}
          {notification && <p className="notification">{notification}</p>}
        </>
      )}
      {!loading && showTable && (
        <table className="table-infomation">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Birthay</th>
              <th>Sex</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Status</th>
              <th>CreatedAt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {usersFind.map((user) => (
              <tr key={user.userId}>
                <td
                  style={
                    user.role === "super_root"
                      ? { color: "#657e1f", fontWeight: "bold" }
                      : {}
                  }
                >
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td>
                  {user.date_of_birth?.day}/{user.date_of_birth?.month}/
                  {user.date_of_birth?.year}
                </td>
                <td>{user.gender}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{objRoles[user.role]}</td>
                <td
                  style={
                    user.status ? { color: "#97b72b" } : { color: "#b0b0b0" }
                  }
                >
                  {user.status ? "open" : "close"}
                </td>
                <td>{formattedDate(user.createdAt)}</td>
                <td>
                  <button onClick={() => handleShowInfoUser(user.userId)}>
                    Edited
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {edited && (
        <div className="form_edited root_flex_column">
          <div className="edited-item">
            <input
              type="text"
              id="edit_fullname"
              value={fullname}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, fullname: e.target.value }))
              }
            />
            <label htmlFor="edit_username">Edit fullname</label>
          </div>
          <div className="edited-item">
            <input
              type="text"
              id="edit_username"
              value={username}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <label htmlFor="edit_username">Edit username</label>
          </div>
          <div className="edited-item">
            <input
              type="text"
              id="edit_email"
              value={email}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <label htmlFor="edit_email">Edit email</label>
          </div>
          <div className="edited-item">
            <input
              type="text"
              id="edit_phone"
              value={phone}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <label htmlFor="edit_phone">Edit Phone</label>
          </div>
          <div className="edited-item">
            <input
              type={hiddenPassUpdate ? "password" : "text"}
              id="edit_password"
              className="relative"
              value={password}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <label htmlFor="edit_password">Edit password</label>
            <button
              type="button"
              className="is_hidden"
              onClick={() => setHiddenPassUpdate(!hiddenPassUpdate)}
            >
              {hiddenPassUpdate ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <div className="edited-item">
            <input
              type={hiddenCodeUpdate ? "password" : "number"}
              id="edit_security_code"
              className="relative"
              value={security_code}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  security_code: e.target.value.replace(/\D/g, ""),
                }))
              }
            />
            <label htmlFor="edit_security_code">Edit security code</label>
            <button
              type="button"
              className="is_hidden"
              onClick={() => setHiddenCodeUpdate(!hiddenCodeUpdate)}
            >
              {hiddenCodeUpdate ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <div className="edited-item">
            <select
              id="edit_role"
              value={role}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <option value="" disabled hidden></option>
              <option value="super_root">Super Root</option>
              <option value="admin">Administrator</option>
              <option value="moderator">Moderator</option>
              <option value="regular_member">Member</option>
            </select>
            <label htmlFor="edit_role">Edit user role</label>
          </div>
          <div className="edited-item">
            <select
              id="edit_status"
              value={status}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value={null} disabled hidden></option>
              <option value={true}>Open</option>
              <option value={false}>Close</option>
            </select>
            <label htmlFor="edit_status">Edit user status</label>
          </div>
          <div className="edited-item edited-item-btn-box">
            <button
              type="submit"
              className="cancel-update"
              onClick={handleCancelRequestUpdate}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-update"
              onClick={handleSendRequestUpdate}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
