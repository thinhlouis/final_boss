import "./UploadVideo.css";
import React from "react";
import { useState, useContext } from "react";
import axios from "axios";

import AuthContext from "../../context/AuthContext";

export default function UploadVideo() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const { auth, fetchVideos, setAuth } = useContext(AuthContext);
  const { videos } = auth;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !url || !thumbnail) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_UIR_API}`, {
        id: videos.length + 1, // Assuming videos is an array and we want to increment the ID
        name,
        url,
        thumbnail,
      });
      console.log("Video uploaded successfully:", response.data);
      // Reset form fields
      setName("");
      setUrl("");
      setThumbnail("");
      const updatedVideos = await fetchVideos();
      setAuth((prevAuth) => ({
        ...prevAuth,
        videos: updatedVideos,
      }));
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  return (
    <div className="upload-video-container">
      <h1>UploadVideo</h1>
      <form className="upload-video-form" onSubmit={handleUpload}>
        <label htmlFor="name-video">
          <span>Name Video:</span>
          <input
            type="text"
            id="name-video"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label htmlFor="url-video">
          <span>URL Video:</span>
          <input
            type="text"
            id="url-video"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <label htmlFor="thumbnail-video">
          <span>Thumbnail Video:</span>
          <input
            type="text"
            id="thumbnail-video"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
        </label>
        <div style={{ width: "100%" }}>
          <button type="submit">UPLOAD</button>
        </div>
      </form>
    </div>
  );
}
