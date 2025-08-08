import "./UploadImage.css";
import uploadAPI from "../../apis/uploadAPI";

import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";

const URI_PUBLIC_THUMB_R2 = "https://image.ksc88.net";

function UploadImage() {
  const [imageLinks, setImageLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
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

  useEffect(() => {
    // Điều này sẽ chỉ chạy khi thành phần bị hủy gắn kết
    return () => {
      // Dọn dẹp bất kỳ URL Blob nào còn lại khi thành phần bị hủy gắn kết
      filesRef.current.forEach((file) => {
        if (file.imageUrl) {
          URL.revokeObjectURL(file.imageUrl);
        }
      });
    };
  }, []);

  const handleCustomSelect = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleSelectFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (selectedFiles.length === 0) {
      return Swal.fire({
        text: "Select at least one image file.",
        width: "18rem",
        confirmButtonColor: "#007bff",
      });
    }
    const newFiles = [];
    const existingNames = new Set(files.map((f) => f.file.name));

    selectedFiles.forEach((file) => {
      if (!existingNames.has(file.name)) {
        newFiles.push({
          id: uuidv4(),
          originalName: file.name, // Store original name for display
          type: file.type,
          file,
          imageUrl: URL.createObjectURL(file),
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

  const convertToWebp = async (file) => {
    return await imageCompression(file, {
      fileType: "image/webp",
      maxWidthOrHeight: 1920,
    });
  };
  const handleRemoveFile = (id) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove && fileToRemove.imageUrl) {
        URL.revokeObjectURL(fileToRemove.imageUrl); // Thu hồi Blob URL khi tệp bị xóa
      }
      return prevFiles.filter((file) => file.id !== id);
    });
  };

  const handleSelectAgain = useCallback(async () => {
    if (imageLinks.length === 0 && files.length === 0) {
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
          if (file.imageUrl) {
            URL.revokeObjectURL(file.imageUrl);
          }
        });

        setFiles([]);
        setImageLinks([]);

        Toast.fire({
          icon: "info",
          title: "File list cleared.",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire("Error: " + error.message);
    }
  }, [Toast, files.length, imageLinks.length, filesRef]);

  const handleUpload = async () => {
    if (files.length === 0) {
      return Swal.fire({
        text: "Please select at least one file to upload.",
        width: "25rem",
        confirmButtonColor: "#007bff",
      });
    }

    setUploading(true);
    setImageLinks([]);
    const uploadedLinks = [];

    const MAX_CONCURRENT_UPLOADS = 10;
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

        let imageWebp = null;
        try {
          // Generate thumbnail locally
          imageWebp = await convertToWebp(fileToUpload.file);

          if (!imageWebp) {
            throw new Error("Failed to generate image webp.");
          }
        } catch (thumbError) {
          console.error(
            `❌ Error generating image webp for ${fileToUpload.originalName}:`,
            thumbError
          );
          Swal.fire({
            text: `Image webp generation failed for: ${fileToUpload.originalName}. Error: ${thumbError.message}`,
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
          formData.append("image", fileToUpload.file); // gửi ảnh gốc

          const signRes = await uploadAPI.sign_image(formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: () => {},
          });

          const { originalUrl, webpUrl, originalName, webpName } = signRes.data;

          // Step 2: Upload video directly to R2 using the signed URL
          await axios.put(originalUrl, fileToUpload.file, {
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
          await axios.put(webpUrl, imageWebp, {
            headers: { "Content-Type": "image/webp" },
          });

          const imagePublicUrl = `${URI_PUBLIC_THUMB_R2}/${originalName}`;
          const imageWebpPublicUrl = `${URI_PUBLIC_THUMB_R2}/${webpName}`;

          uploadedLinks.push({
            id: fileToUpload.id,
            original_link: imagePublicUrl,
            display_link: imageWebpPublicUrl,
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

    // for (const item of files) {
    //   try {
    //     const webpFile = await convertToWebp(item.file);

    //     const formData = new FormData();
    //     formData.append("image", item.file); // gửi ảnh gốc

    //     const response = await uploadAPI.sign_image(formData, {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     });

    //     const { originalUrl, webpUrl, originalName, webpName } = response.data;

    //     await Promise.all([
    //       axios.put(originalUrl, item.file, {
    //         headers: { "Content-Type": item.file.type },
    //       }),
    //       axios.put(webpUrl, webpFile, {
    //         headers: { "Content-Type": "image/webp" },
    //       }),
    //     ]);

    //     setFiles((prev) =>
    //       prev.map((f) =>
    //         f.id === item.id ? { ...f, status: "success", progress: 100 } : f
    //       )
    //     );

    //     const imagePublicUrl = `${URI_PUBLIC_THUMB_R2}/${originalName}`;
    //     const imageWebpPublicUrl = `${URI_PUBLIC_THUMB_R2}/${webpName}`;

    //     uploadedLinks.push({
    //       id: item.id,
    //       original_link: imagePublicUrl,
    //       display_link: imageWebpPublicUrl,
    //     });
    //   } catch (err) {
    //     console.error("❌ Upload failed:", err);
    //     setFiles((prev) =>
    //       prev.map((f) =>
    //         f.id === item.id ? { ...f, status: "failed", progress: 0 } : f
    //       )
    //     );
    //   }
    // }
    setImageLinks((prev) => [...prev, ...uploadedLinks]);
    setUploading(false);
  };

  const handleUploadData = async () => {
    if (imageLinks.length === 0) return;
    // hoàn tất kiểm tra đầu vào setloading true bắt đầu upload
    setLoading(true);
    setError(null);

    const finalImageData = imageLinks.map((img) => ({
      id: img.id,
      original_link: img.original_link,
      display_link: img.display_link,
      category: "realitic",
      uploadedAt: new Date(),
    }));
    try {
      await uploadAPI.image(finalImageData);

      // Reset form fields
      Toast.fire({
        icon: "success",
        title: "Video uploaded successfully!",
        timer: 2000,
      });

      setImageLinks([]);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="root_flex_column container_upload_image">
        <div className="root_flex_row" style={{ gap: "2rem" }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleSelectFiles}
            className="custom-file-input"
          />
          <button
            onClick={handleCustomSelect}
            disabled={uploading || imageLinks.length > 0}
          >
            Select File
          </button>
          <button
            onClick={handleSelectAgain}
            disabled={uploading || loading || files.length === 0}
            className="selected-again"
          >
            Select Again
          </button>
        </div>
        <div className="root_flex_row" style={{ gap: "2rem" }}>
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
          >
            {uploading ? "Uploading..." : "Upload R2"}
          </button>
          <button
            onClick={handleUploadData}
            disabled={uploading || imageLinks.length === 0}
            className="uploaded_db"
          >
            Upload DB
          </button>
        </div>
      </div>
      <div className="container_list_file_img">
        {files.length > 0 && (
          <div className="selected-files-list">
            {files.map((file) => (
              <div key={file.id} className="file-item-upload-img">
                <p className="file_preview" title={file.file.name}>
                  <img src={file.imageUrl} alt={file.file.name} />
                </p>
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
                          : { color: "#000", left: "5px" }
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
      </div>
      {files.length === 0 && (
        <>
          <p style={{ textAlign: "center", margin: "1rem 0" }}>
            <small>Chưa có file nào được chọn...</small>
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </>
  );
}

export default UploadImage;
