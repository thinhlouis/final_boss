import "./InformationUser.css";
import authAPI from "../../apis/authAPI";
import formattedDate from "../../utils/formattedDate";
import useDebounce from "../../utils/useDebounce";

import React from "react";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function InformationUser() {
  const [usersFind, setUsersFind] = useState([]);
  const [isUser, setIsUser] = useState({
    _id: null,
    userId: null,
    username: null,
  });
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [hiddenPassUpdate, setHiddenPassUpdate] = useState(true);
  const [hiddenCodeUpdate, setHiddenCodeUpdate] = useState(true);
  const [hiddenRootCode, setHiddenRootCode] = useState(true);
  //
  const [edited, setEdited] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editSecurityCode, setEditSecurityCode] = useState("");
  const [editRole, setEditRole] = useState("");
  const [enterCode, setEnterCode] = useState(false);
  const [rootCode, setRootCode] = useState("");
  const [playload, setPayload] = useState({
    _id: "",
    username: "",
    email: "",
    password: "",
    security_code: "",
    role: "",
  });

  const objRoles = {
    super_root: {
      role_name: "Super Root",
      color: "#657e1f",
    },
    admin: { role_name: "Administrator", color: "#dc3545" },
    regular_member: { role_name: "Regular Member", color: "#3b82f6" },
  };

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
      const response = await authAPI.search(searchKeyword);
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

    if (!infomationUser) {
      setError("Không tìm thấy thông tin người dùng này!");
      setIsUser({
        _id: null,
        userId: null,
        username: null,
      }); // Đặt lại isUser
      return;
    }
    setError(""); // Xóa lỗi nếu tìm thấy
    setIsUser({
      _id: infomationUser._id,
      userId: infomationUser.userId,
      username: infomationUser.username,
    });
    setEdited(true);
    setEditUserName(infomationUser.username);
    setEditEmail(infomationUser.email);
    setEditRole(infomationUser.role);
  };

  const handleChangeSearch = (e) => {
    if (!e.target.value) {
      setShowTable(false);
      setHiddenCodeUpdate(true);
      setHiddenPassUpdate(true);
      setHiddenRootCode(true);
      setEdited(false);
      setEnterCode(false);
      setRootCode("");
      setError("");
    }
    setNotification("");
    const newKeyword = e.target.value;
    setKeyword(newKeyword);

    handleResultDebounce(newKeyword);
  };

  const handleSendRequestUpdate = (e) => {
    e.preventDefault();

    setPayload({
      _id: isUser._id,
      username: editUserName,
      email: editEmail,
      password: editPassword,
      security_code: editSecurityCode,
      role: editRole,
    });

    setEnterCode(true);
  };
  const handleCancelRequestUpdate = () => {
    setEdited(false);
    setEditUserName("");
    setEditEmail("");
    setEditPassword("");
    setEditSecurityCode("");
    setEditRole("");
  };
  const handleUpdateUser = async () => {
    setNotification("");
    setError("");

    if (!rootCode) {
      setError("Please enter security code!");
      return;
    }

    try {
      const code = {
        security_code: rootCode,
      };
      await authAPI.verifyCode(code);

      const result = await authAPI.update(playload);
      setNotification(result.data.message);
      setKeyword("");
      setEditUserName("");
      setEditEmail("");
      setEditPassword("");
      setEditSecurityCode();
      setEditRole("");
      setRootCode("");
      setEdited(false);
      setEnterCode(false);
      setShowTable(false);
    } catch (error) {
      setError(error?.response.data.message);
    }
  };

  return (
    <div className="infomation-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p className="style-color-search">SEARCH USER</p>
        <div className="search">
          <input
            type="text"
            list="users"
            value={keyword}
            onChange={handleChangeSearch}
            onInput={() => handleResultDebounce(keyword)}
          ></input>
          <span>
            <RiSearchLine />
          </span>
        </div>
      </div>

      {!showTable && (
        <div>
          {error && <p className="error">{error}</p>}
          {notification && <p className="notification">{notification}</p>}
        </div>
      )}
      {!loading && showTable && (
        <table className="table-infomation">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>CreatedAt</th>
              <th>Selected</th>
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
                <td style={{ color: objRoles[user.role]?.color }}>
                  {objRoles[user.role]?.role_name}
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
        <div className="form_edited">
          {enterCode ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div className="enter_code">
                <input
                  type={hiddenRootCode ? "password" : "number"}
                  id="enter_root_code"
                  className="relative"
                  value={rootCode}
                  onChange={(e) =>
                    setRootCode(e.target.value.replace(/\D/g, ""))
                  }
                />
                <label htmlFor="enter_root_code">Security code</label>
                {
                  <div>
                    {error && <p className="error">{error}</p>}
                    {notification && (
                      <p className="notification">{notification}</p>
                    )}
                  </div>
                }
                <button
                  className="is_hidden"
                  onClick={() => setHiddenRootCode(!hiddenRootCode)}
                >
                  {hiddenRootCode ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              <div className="edited-item-btn-box">
                <button
                  style={{
                    backgroundColor: "#CED3DA",
                    borderColor: "#CED3DA",
                    color: "#444746",
                  }}
                  className="submit-update"
                  onClick={() => {
                    setEnterCode(false);
                  }}
                >
                  Back Send
                </button>
                <button className="submit-update" onClick={handleUpdateUser}>
                  Submit Update
                </button>
              </div>
            </div>
          ) : (
            <form>
              <div className="edited-item">
                <input
                  type="text"
                  id="edit_username"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                />
                <label htmlFor="edit_username">Edit username</label>
              </div>
              <div className="edited-item">
                <input
                  type="text"
                  id="edit_email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
                <label htmlFor="edit_email">Edit email</label>
              </div>
              <div className="edited-item">
                <input
                  type={hiddenPassUpdate ? "password" : "text"}
                  id="edit_password"
                  className="relative"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
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
                  value={editSecurityCode}
                  onChange={(e) =>
                    setEditSecurityCode(e.target.value.replace(/\D/g, ""))
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
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="" disabled hidden></option>
                  <option value="super_root">Super Root</option>
                  <option value="admin">Administrator</option>
                  <option value="moderator">Moderator</option>
                  <option value="regular_member">Member</option>
                </select>
                <label htmlFor="edit_role">Edit user role</label>
              </div>
              <div className="edited-item edited-item-btn-box">
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#CED3DA",
                    borderColor: "#CED3DA",
                    color: "#444746",
                  }}
                  className="send_request"
                  onClick={handleCancelRequestUpdate}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="send_request"
                  onClick={handleSendRequestUpdate}
                >
                  Send
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
