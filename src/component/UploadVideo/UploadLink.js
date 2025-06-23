import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";

import uploadAPI from "../../apis/uploadAPI";

export default function UploadLink() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("normal");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    const payload = {
      name,
      url,
      thumbnail,
      tag,
    };
    // hoàn tất kiểm tra đầu vào setloading true bắt đầu upload
    setLoading(true);
    try {
      await uploadAPI.jav(payload);
      // Reset form fields
      setName("");
      setUrl("");
      setThumbnail("");
      setTag("normal");

      Toast.fire({
        icon: "success",
        title: "Video uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading video:", error);

      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
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
      <label>{error && <p className="upload-err">{error}</p>}</label>

      <label>
        <button type="submit">{loading ? "ĐANG UPLOAD..." : "UPLOAD"}</button>
      </label>
    </form>
  );
}
