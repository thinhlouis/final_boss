import "./UploadReal.css";
import UploadForm from "../UploadForm";
import uploadAPI from "../../../apis/uploadAPI";
import displayText from "../../../utils/displayText";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { AiFillDelete } from "react-icons/ai";

// Ensure this matches your backend's endpoint for getting signed URLs
// If your backend router is mounted at /api/sign, then the full path is /api/sign/videos-real

const URI_PUBLIC_VIDEO_R2 = process.env.REACT_APP_URI_PUBLIC_R2_REAL;
const URI_PUBLIC_THUMB_R2 = process.env.REACT_APP_URI_PUBLIC_R2_THUMB;

function UploadVideoReal() {
  const [videoLinks, setVideoLinks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filesRef = useRef([]);

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const generateThumbnail = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.src = URL.createObjectURL(file);
      video.currentTime = 2; // Capture frame at 2 seconds

      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert to Blob for upload, specify JPEG format
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9 // Quality
        );
        URL.revokeObjectURL(video.src); // Release memory
      };

      video.onerror = () => {
        resolve(null); // Return null if there's an error
      };
    });
  };

  const handleSelectFile = async (e) => {
    const selectedFiles = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("video/")
    );

    if (selectedFiles.length === 0) {
      return Swal.fire({
        text: "Select at least one video file.",
        width: "18rem",
        confirmButtonColor: "#007bff",
      });
    }

    const newFiles = [];
    const existingNames = new Set(files.map((f) => f.file.name)); // Check against original file name

    selectedFiles.forEach((file) => {
      if (!existingNames.has(file.name)) {
        newFiles.push({
          id: uuidv4(),
          originalName: file.name, // Store original name for display
          name: `${uuidv4()}-${file.name.replace(/\s/g, "_")}`, // Generate a unique name for upload
          type: file.type,
          file,
          videoUrl: URL.createObjectURL(file),
          status: "pending",
          progress: 0,
        });
        existingNames.add(file.name);
      }
    });

    if (newFiles.length === 0 && selectedFiles.length > 0) {
      return Swal.fire({
        text: "The files you selected are already in the list.",
        width: "25rem",
        confirmButtonColor: "#007bff",
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSelectAgain = useCallback(async () => {
    if (videoLinks.length === 0 && files.length === 0) {
      Swal.fire({
        text: "You haven't selected any files.",
        width: "18rem",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        text: "Do you want to re-select? All selected files will be cleared.",
        width: "25rem",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, re-select!",
        confirmButtonColor: "#007bff",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        // Thu hồi tất cả các Blob URL hiện tại trước khi xóa danh sách
        filesRef.current.forEach((file) => {
          // <-- filesRef.current là một dependency
          if (file.videoUrl) {
            URL.revokeObjectURL(file.videoUrl);
          }
        });

        setFiles([]);
        setVideoLinks([]);

        Toast.fire({
          icon: "info",
          title: "File list cleared.",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire("Error: " + error.message);
    }
  }, [videoLinks.length, files.length, Toast, filesRef]);

  const handleRemoveFile = (id) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove && fileToRemove.videoUrl) {
        URL.revokeObjectURL(fileToRemove.videoUrl); // Thu hồi Blob URL khi tệp bị xóa
      }
      return prevFiles.filter((file) => file.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      return Swal.fire({
        text: "Please select at least one file to upload.",
        width: "25rem",
        confirmButtonColor: "#007bff",
      });
    }

    setUploading(true);
    setVideoLinks([]);
    const uploadedLinks = [];

    const MAX_CONCURRENT_UPLOADS = 5;
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

        let thumbnailBlob = null;
        try {
          // Generate thumbnail locally
          thumbnailBlob = await generateThumbnail(fileToUpload.file);
          if (!thumbnailBlob) {
            throw new Error("Failed to generate thumbnail.");
          }
        } catch (thumbError) {
          console.error(
            `❌ Error generating thumbnail for ${fileToUpload.originalName}:`,
            thumbError
          );
          Swal.fire({
            text: `Thumbnail generation failed for: ${fileToUpload.originalName}. Error: ${thumbError.message}`,
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
          return false; // Skip to next file if thumbnail generation fails
        }

        try {
          // Step 1: Send the actual video file to the backend to get signed URLs
          // The backend uses `multer` to process the file and then returns signed URLs
          const formData = new FormData();
          formData.append(
            "video",
            fileToUpload.file,
            fileToUpload.originalName
          ); // Append original name for backend's use

          const signRes = await uploadAPI.sign_real(formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file uploads
              // Add any authentication headers if needed, e.g., "Authorization": `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              // This progress is for the initial upload to your backend server (if it's large)
              // For small files, it might complete very quickly.
            },
          });

          const { videoUploadUrl, thumbUploadUrl, videoName, thumbName } =
            signRes.data;

          // Step 2: Upload video directly to R2 using the signed URL
          await axios.put(videoUploadUrl, fileToUpload.file, {
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
                    ? { ...f, progress: percentCompleted } // Show video upload progress
                    : f
                )
              );
            },
          });

          // Step 3: Upload thumbnail directly to R2 using its signed URL
          await axios.put(thumbUploadUrl, thumbnailBlob, {
            headers: {
              "Content-Type": "image/jpeg", // Must match Content-Type used when generating signed URL
            },
          });

          const videoPublicUrl = `${URI_PUBLIC_VIDEO_R2}/${videoName}`;
          const thumbPublicUrl = `${URI_PUBLIC_THUMB_R2}/${thumbName}`;

          uploadedLinks.push({
            id: fileToUpload.id,
            name: fileToUpload.originalName,
            url: videoPublicUrl,
            thumbnail: thumbPublicUrl, // Store thumbnail URL too
            tag: "video_real",
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
          console.error(
            `❌ Upload failed for ${fileToUpload.originalName}:`,
            err
          );
          const errorMessage =
            err.response?.data?.error || err.message || "Unknown error";
          Swal.fire({
            text: `Upload failed: ${fileToUpload.originalName}. Error: ${errorMessage}`,
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
    // Keep files with 'failed' status if you want to allow re-uploading them
    setFiles((prevFiles) => prevFiles.filter((f) => f.status === "failed"));
    setUploading(false);

    if (uploadedLinks.length > 0) {
      Toast.fire({
        icon: "success",
        title: "Upload complete!",
        timer: 1500,
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "No videos uploaded successfully.",
        timer: 2000,
      });
    }
  };

  const handleUploadData = async (e) => {
    e.preventDefault();

    // hoàn tất kiểm tra đầu vào setloading true bắt đầu upload
    setLoading(true);
    setError(null);

    const finalVideoData = videoLinks.map((video) => ({
      id: video.id,
      fileName: video.name,
      videoUrl: video.url,
      thumbUrl: video.thumbnail,
      uploadedAt: new Date(),
      category: video.tag,
    }));

    try {
      await uploadAPI.real(finalVideoData);
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
    // Điều này sẽ chỉ chạy khi thành phần bị hủy gắn kết
    return () => {
      // Dọn dẹp bất kỳ URL Blob nào còn lại khi thành phần bị hủy gắn kết
      filesRef.current.forEach((file) => {
        if (file.videoUrl) {
          URL.revokeObjectURL(file.videoUrl);
        }
      });
    };
  }, []);

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
              onClick={handleUploadData}
            >
              {loading ? "ĐANG UPLOAD..." : "UPLOAD"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadVideoReal;
