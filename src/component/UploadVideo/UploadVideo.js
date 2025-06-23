import "./UploadVideo.css";
import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import UploadLink from "./UploadLink";
import UploadFile from "./UploadFile";

export default function UploadVideo() {
  const [uploadCategory, setUploadCategory] = useState("");

  return (
    <div className="upload-video-container">
      <h1>Upload Video Final Boss</h1>
      <nav>
        <ul>
          <li onClick={() => setUploadCategory("link")}>
            <NavLink
              to="#"
              className={uploadCategory === "link" ? "active-category" : ""}
            >
              UPLOAD LINK
            </NavLink>
          </li>
          <li onClick={() => setUploadCategory("file")}>
            <NavLink
              to="##"
              className={uploadCategory === "file" ? "active-category" : ""}
            >
              UPLOAD FILE
            </NavLink>
          </li>
        </ul>
      </nav>
      {uploadCategory === "link" && <UploadLink />}
      {uploadCategory === "file" && <UploadFile />}
    </div>
  );
}
