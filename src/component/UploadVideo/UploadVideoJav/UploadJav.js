import "./UploadJav.css";
import uploadAPI from "../../../apis/uploadAPI";
import UploadForm from "../UploadForm";
import displayText from "../../../utils/displayText";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { AiFillDelete } from "react-icons/ai";

const URI_PUBLIC_R2 = process.env.REACT_APP_URI_PUBLIC_R2_JAV;

function UploadVideoJav() {
  const [videoLinks, setVideoLinks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleSelectFile = async (e) => {
    setVideoLinks([]);
    const selectedFiles = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("video/")
    );

    if (selectedFiles.length === 0) {
      return Swal.fire({
        text: "Chọn ít nhất một file video.",
        width: "18rem",
        confirmButtonColor: "#007bff",
      });
    }

    const newFiles = [];
    const existingNames = new Set(files.map((f) => f.name));

    selectedFiles.forEach((file) => {
      const normalizedName = file.name.replace(/\s/g, "_");
      if (!existingNames.has(normalizedName)) {
        newFiles.push({
          id: uuidv4(),
          name: normalizedName,
          type: file.type,
          file,
          videoUrl: URL.createObjectURL(file),
          status: "pending",
          progress: 0,
        });
        existingNames.add(normalizedName);
      }
    });

    if (newFiles.length === 0 && selectedFiles.length > 0) {
      return Swal.fire({
        text: "Các file bạn chọn đã có trong danh sách.",
        width: "25rem",
        confirmButtonColor: "#007bff",
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSelectAgain = async () => {
    if (videoLinks.length === 0 && files.length === 0) {
      Swal.fire({
        text: "Bạn chưa chọn file nào.",
        width: "18rem",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        text: "Bạn có muốn chọn lại không? Tất cả các file đã chọn sẽ bị xóa.",
        width: "25rem",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, chọn lại!",
        confirmButtonColor: "#007bff",
        cancelButtonText: "Không",
      });

      if (result.isConfirmed) {
        setFiles([]);
        setVideoLinks([]);
        Toast.fire({
          icon: "info",
          title: "Đã xóa danh sách file.",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire("Lỗi: " + error.message);
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      return Swal.fire({
        text: "Vui lòng chọn ít nhất một file để upload.",
        width: "25rem",
        confirmButtonColor: "#007bff",
      });
    }

    setUploading(true);

    const uploadedLinks = [];

    const MAX_CONCURRENT_UPLOADS = 3;
    const uploadQueue = [...files];

    while (uploadQueue.length > 0) {
      const batch = uploadQueue.splice(0, MAX_CONCURRENT_UPLOADS);

      const promises = batch.map(async (fileToUpload) => {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileToUpload.id
              ? { ...f, status: "uploading", progress: 0 }
              : f
          )
        );

        try {
          // Bước 1: Yêu cầu Signed URL từ backend
          const signRes = await uploadAPI.sign_jav({
            fileName: fileToUpload.name,
            fileType: fileToUpload.type,
          });
          const { signedUrl } = signRes.data;

          // Bước 2: Upload file trực tiếp lên R2 bằng Signed URL
          await axios.put(signedUrl, fileToUpload.file, {
            headers: {
              "Content-Type": fileToUpload.type,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileToUpload.id
                    ? { ...f, progress: percentCompleted }
                    : f
                )
              );
            },
          });

          const videoPublicUrl = `${URI_PUBLIC_R2}/${fileToUpload.name}`;

          uploadedLinks.push({
            id: uuidv4(),
            name: fileToUpload.name,
            url: videoPublicUrl,
            thumbnail: "",
            tag: "normal",
          });

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === fileToUpload.id
                ? { ...f, status: "success", progress: 100 }
                : f
            )
          );
          return true;
        } catch (err) {
          console.error(`❌ Lỗi upload ${fileToUpload.name}:`, err);
          const errorMessage =
            err.response?.data?.error || err.message || "Không xác định";
          Swal.fire({
            text: `Upload thất bại: ${fileToUpload.name}. Lỗi: ${errorMessage}`,
            icon: "error",
            confirmButtonColor: "#007bff",
          });
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === fileToUpload.id
                ? { ...f, status: "failed", progress: 0 }
                : f
            )
          );
          return false;
        }
      });
      await Promise.all(promises);
    }

    setVideoLinks((prev) => [...prev, ...uploadedLinks]);
    // Giữ lại các file có status 'failed' nếu muốn cho phép upload lại
    setFiles((prevFiles) => prevFiles.filter((f) => f.status === "failed"));
    setUploading(false);

    if (uploadedLinks.length > 0) {
      Toast.fire({
        icon: "success",
        title: "Upload hoàn tất!",
        timer: 1500,
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Không có video nào được upload thành công.",
        timer: 2000,
      });
    }
  };

  const handleUploadLink = async (e) => {
    e.preventDefault();

    // hoàn tất kiểm tra đầu vào setloading true bắt đầu upload
    setLoading(true);
    setError(null);

    const finalVideoData = videoLinks.map((video) => ({
      id: video.id,
      name: video.name,
      url: video.url,
      thumbnail: video.thumbnail || "",
      tag: video.tag || "normal",
      createdAt: new Date(),
    }));

    try {
      await uploadAPI.jav(finalVideoData);
      // Reset form fields
      Toast.fire({
        icon: "success",
        title: "Video uploaded successfully!",
        timer: 2000,
      });

      setVideoLinks([]);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading video:", error);

      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.videoUrl));
    };
  }, [files]);

  return (
    <div className="container-upload">
      <div className="upload-jav-real-box">
        <div className="controls-upload-jav">
          <label
            htmlFor="select-file"
            className={
              uploading ? "disabled-uploading select-file" : "select-file"
            }
            disabled={uploading}
          >
            <input
              id="select-file"
              type="file"
              accept="video/*"
              multiple
              onChange={handleSelectFile}
              disabled={uploading}
            />
            Chọn file
          </label>
          <label
            className={
              uploading ? "disabled-uploading select-again" : "select-again"
            }
            onClick={handleSelectAgain}
            disabled={uploading}
          >
            Chọn lại
          </label>
          <button
            onClick={handleUpload}
            className={
              uploading
                ? "disabled-uploading btn_upload_file"
                : "btn_upload_file"
            }
            disabled={uploading || files.length === 0}
          >
            {uploading ? "Đang upload..." : "Upload"}
          </button>
        </div>

        {files.length === 0 ? (
          <p style={{ margin: "20px 0 20px 3px" }}>
            Không có file nào được chọn
          </p>
        ) : (
          <p style={{ margin: "20px 0 20px 3px" }}>
            Đã chọn {files.length} file
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="selected-files-list">
          {files.map((file) => (
            <div key={file.id} className="file-item-link">
              <span className="file-name" title={file.name}>
                {displayText(file.name, 10)}
              </span>
              <div className="file-progress-container-link">
                <div
                  className="file-progress-bar-link"
                  style={{
                    width: `${file.progress}%`,
                    backgroundColor:
                      file.status === "failed"
                        ? "#F44C63"
                        : file.status === "success"
                        ? "#a9d433"
                        : file.status === "uploading"
                        ? "#056DFF"
                        : "#999",
                  }}
                >
                  <span
                    className="file-progress-text"
                    style={
                      file.progress > 0
                        ? { color: "#f3f4f5" }
                        : { color: "#000", right: "-3px" }
                    }
                  >
                    {file.status === "pending" && "waiting..."}
                    {file.status === "uploading" && `${file.progress}%`}
                    {file.status === "success" && "success"}
                    {file.status === "failed" && "error"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(file.id)}
                className="remove-file-btn-link"
                disabled={uploading}
                title="delete file"
              >
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      )}

      {videoLinks.length > 0 && (
        <>
          <div>
            {videoLinks?.map((video, index) => (
              <UploadForm
                key={index}
                video={video}
                index={index}
                setVideoLinks={setVideoLinks}
              />
            ))}
          </div>
          <div style={{ width: "78%", textAlign: "right" }}>
            {error && <p className="error">{error}</p>}
            <button
              type="submit"
              className="submit-on-server"
              onClick={handleUploadLink}
            >
              {loading ? "ĐANG UPLOAD..." : "UPLOAD"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadVideoJav;
