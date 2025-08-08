import "./UserProfile.css";

import uploadAPI from "../../apis/uploadAPI";
import AuthContext from "../../context/AuthContext/AuthContext";

import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { FcCheckmark, FcPicture } from "react-icons/fc";
import { BeatLoader, PropagateLoader } from "react-spinners";

export default function UserProfile() {
  const [avatarPreview, setAvatarPreview] = useState(
    "https://i.postimg.cc/MZMBxsd1/avatar.jpg"
  );
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState("");
  const [error, setError] = useState("");

  const { auth, loading, handleLogout } = useContext(AuthContext);
  const { user, isAuthenticated } = auth;
  const userAvatar = user?.avatar;

  const inputFileRef = useRef(null);
  const timeRef = useRef(null);

  const activeLink = ({ isActive }) => (isActive ? "active-profile" : "");

  useEffect(() => {
    if (!userAvatar) return;

    if (!image) {
      setAvatarPreview(userAvatar);
      return;
    }
    const urlReview = URL.createObjectURL(image);
    setAvatarPreview(urlReview);
  }, [image, userAvatar]);

  useEffect(() => {
    if (!completed) return;
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      setCompleted("");
    }, 3000);
  }, [completed]);

  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUploadAvatar = async (e) => {
    if (!image) {
      inputFileRef.current.click();
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (image.size > MAX_FILE_SIZE) {
      setError("Kích thước file không được vượt quá 5MB.");
      return;
    }

    setUploading(true);
    setError(null);
    setCompleted(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("_id", user?._id);

    try {
      const response = await uploadAPI.avatar(formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Rất quan trọng cho việc tải lên file
        },
      });
      const { avatarUrl } = response.data;
      setAvatarPreview(avatarUrl);
      setCompleted("completed!");
    } catch (error) {
      console.error("Lỗi khi tải lên avatar:", error.response?.data?.message);
      setError("upload failed!");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div style={{ height: "60vh", marginTop: "5rem" }}>
        <PropagateLoader color="#657e1f" />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/sigin" replace />;

  return (
    <div className="profile-layout-container">
      <aside className="profile-sidebar">
        <div className="content-box-avatar">
          <img src={avatarPreview} alt="avatar" />

          <p>{uploading && <BeatLoader color="#657e1f" size={8} />}</p>
          {error && <p className="error">{error}</p>}
          {completed && <p className="notification">{completed}</p>}
          <input
            ref={inputFileRef}
            type="file"
            id="edit-avatar"
            accept="image/*"
            onChange={handleSelectedFile}
          />
          <div className="acction-upload-avatar">
            <button
              onClick={() => {
                inputFileRef.current.click();
              }}
              className="change-avatar root_flex_row"
              title="Edit avatar"
            >
              <small>
                <FcPicture />
              </small>
              <small>CHANGE</small>
            </button>
            <button
              title="Submit upload"
              className="submit-change-avatar root_flex_row"
              onClick={handleUploadAvatar}
            >
              <small>
                <FcCheckmark />
              </small>
              <small>UPLOAD</small>
            </button>
          </div>
        </div>
      </aside>
      <div className="profile-box">
        <header className="profile-header">
          <nav>
            {" "}
            <ul>
              <li>
                <NavLink to="/profile" end className={activeLink}>
                  ABOUT ME
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/edit-profile" className={activeLink}>
                  EDIT PROFILE
                </NavLink>
              </li>
              <li onClick={handleLogout}>
                <NavLink to="/" end className={activeLink}>
                  LOGOUT
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main className="profile-content">
          <Outlet context={user} />
        </main>
      </div>
    </div>
  );
}
