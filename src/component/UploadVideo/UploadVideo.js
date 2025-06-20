import "./UploadVideo.css";
import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import AuthContext from "../../context/AuthContext";

export default function UploadVideo() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("normal");
  const [thumbnail, setThumbnail] = useState("");
  const { auth, fetchVideos, setAuth } = useContext(AuthContext);
  const { videos } = auth;

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !url || !thumbnail) {
      Toast.fire({
        icon: "warning",
        title: "Please fill in all fields",
      });
      return;
    }
    const duplecateVideo = videos.find((video) => video.name === name);
    if (duplecateVideo) {
      Toast.fire({
        icon: "warning",
        title: "Video has existed.",
      });
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_UIR_API}`, {
        id: videos.length + 1, // Assuming videos is an array and we want to increment the ID
        name,
        url,
        thumbnail,
        tag,
      });

      // Reset form fields
      setName("");
      setUrl("");
      setThumbnail("");
      setTag("normal");
      const updatedVideos = await fetchVideos();
      setAuth((prevAuth) => ({
        ...prevAuth,
        videos: updatedVideos,
      }));

      Toast.fire({
        icon: "success",
        title: "Video uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      // Show error message using SweetAlert2
      Toast.fire({
        icon: "error",
        title: "Failed to upload video. Please try again.",
      });
    }
  };

  return (
    <div className="upload-video-container">
      <h1>UploadVideo Final Boss</h1>
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

        <label htmlFor="thumbnail-video">
          <span>Thumbnail Video:</span>
          <input
            type="text"
            id="thumbnail-video"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
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
        <label htmlFor="tag-video">
          <span>Tag Video:</span>
          <select
            id="tag-video"
            onChange={(e) => setTag(e.target.value)}
            value={tag}
          >
            <option value="normal">Normal Video</option>
            <option value="hot">Hot Video</option>
          </select>
        </label>
        <div style={{ width: "100%" }}>
          <button type="submit">UPLOAD</button>
        </div>
      </form>
    </div>
  );
}
