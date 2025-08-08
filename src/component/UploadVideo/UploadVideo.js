import "./UploadVideo.css";
import React from "react";
import { useState } from "react";

import UploadVideoReal from "./UploadVideoReal/UploadReal";
import UploadVideoJav from "./UploadVideoJav/UploadJav";

export default function UploadVideo() {
  const [checked, setCheked] = useState(false);

  const handleChangeSlider = (e) => {
    setCheked(e.target.checked);
  };

  return (
    <div className="upload-video-container">
      <h1>Upload Video Final Boss</h1>
      <div className="switch-box">
        <label className="switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChangeSlider}
          />
          <span className="slider"></span>
        </label>
        <span>{checked ? "REAL UPLOAD" : "JAV UPLOAD"}</span>
      </div>
      <>{checked ? <UploadVideoReal /> : <UploadVideoJav />}</>
    </div>
  );
}
