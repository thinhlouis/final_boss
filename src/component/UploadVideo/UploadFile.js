import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";

import uploadAPI from "../../apis/uploadAPI";

export default function UploadFile() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");

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

  function EMT({ text = "", start = 30, end = 20 }) {
    if (text.length <= start + end) return <span>{text}</span>;

    const s = text.slice(0, start);
    const e = text.slice(-end);

    return (
      <span title={text} className="title-file">
        {s}...{e}
      </span>
    );
  }

  const handleSelectFile = async (e) => {
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

    // Tạo Set để theo dõi các file đã chọn
    const existingFiles = new Set(files.map((f) => f.name));

    // Lọc các file mới không trùng với file đã chọn trước đó
    const newFiles = selectedFiles.filter((file) => {
      const normalizedName = file.name.replace(/\s/g, "_");
      return !existingFiles.has(normalizedName);
    });

    if (newFiles.length === 0) {
      return Swal.fire({
        text: "Các file bạn chọn đã có trong danh sách.",
        width: "25rem",
        confirmButtonColor: "#007bff",
      });
    }

    const newPreviews = newFiles.map((file) => ({
      name: file.name.replace(/\s/g, "_"),
      type: file.type,
      file, // Lưu file gốc để upload
      progress: 0,
      isUploading: false, // Thêm trạng thái upload của từng file
      videoUrl: URL.createObjectURL(file), // Preview cục bộ tạm thời
      uploadError: null, // Thêm trạng thái lỗi của từng file
    }));

    setFiles((prev) => [...prev, ...newPreviews]);
  };

  const handleSelectAgain = async () => {
    if (files.length === 0) {
      Swal.fire({
        text: "Bạn chưa chọn file nào.",
        width: "18rem",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    try {
      Swal.fire({
        text: "Bạn có muốn chọn lại không?",
        width: "25rem",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, chọn lại!",
        confirmButtonColor: "#007bff",
      }).then((res) => {
        if (res.isConfirmed) {
          files.forEach((f) => URL.revokeObjectURL(f.videoUrl));
          setFiles([]);
          setUploading(false); // Đảm bảo reset trạng thái upload tổng thể
        }
      });
    } catch (error) {
      Swal.fire("Lỗi: " + error.message);
    }
  };

  // const handleUpload = async () => {
  //   if (!category) {
  //     return Swal.fire({
  //       text: "Vui lòng chọn danh mục (REAL)!",
  //       icon: "warning",
  //       confirmButtonColor: "#007bff",
  //     });
  //   }
  //   setUploading(true);

  //   let allUploadsSuccessful = true;

  //   for (const file of files) {
  //     try {
  //       // Tạo FormData để gửi file
  //       const formData = new FormData();
  //       formData.append("video", file.file);

  //       formData.append("category", category);

  //       // Gửi file lên backend
  //       await uploadAPI.real(formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //     } catch (err) {
  //       console.error(`❌ Lỗi upload ${file.name}:`, err);
  //       Swal.fire({
  //         text: `Upload thất bại: ${file.name}`,
  //         icon: "error",
  //         confirmButtonColor: "#007bff",
  //       });
  //     } finally {
  //       setUploading(false);
  //     }
  //   }

  //   setFiles([]); // Xóa file preview sau khi upload thành công
  //   Toast.fire({
  //     icon: "success",
  //     title: "Upload thành công!",
  //     timer: 1500,
  //   });
  // };
  const handleUpload = async () => {
    if (!category) {
      return Swal.fire({
        text: "Vui lòng chọn danh mục (REAL)!",
        icon: "warning",
        confirmButtonColor: "#657e1f",
        width: "20rem",
      });
    }
    if (files.length === 0) {
      return Swal.fire({
        text: "Không có file nào để upload.",
        icon: "warning",
        confirmButtonColor: "#657e1f",
      });
    }

    setUploading(true);

    let allUploadsSuccessful = true;

    for (let i = 0; i < files.length; i++) {
      const fileToUpload = files[i];

      // Cập nhật trạng thái của file đang được upload
      setFiles((prevFiles) =>
        prevFiles.map((f, index) =>
          index === i
            ? { ...f, isUploading: true, uploadError: null, progress: 0 }
            : f
        )
      );

      try {
        const formData = new FormData();
        formData.append("video", fileToUpload.file);
        formData.append("category", category);

        // Gửi file lên backend với onUploadProgress
        await uploadAPI.real(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Cập nhật tiến trình của file hiện tại
            setFiles((prevFiles) =>
              prevFiles.map((f, index) =>
                index === i ? { ...f, progress: percentCompleted } : f
              )
            );
          },
        });

        // Đánh dấu file là đã upload xong (progress 100%)
        setFiles((prevFiles) =>
          prevFiles.map((f, index) =>
            index === i ? { ...f, isUploading: false, progress: 100 } : f
          )
        );
      } catch (err) {
        console.error(`❌ Lỗi upload ${fileToUpload.name}:`, err);
        allUploadsSuccessful = false;
        // Đánh dấu file bị lỗi
        setFiles((prevFiles) =>
          prevFiles.map((f, index) =>
            index === i
              ? {
                  ...f,
                  isUploading: false,
                  uploadError: err.message || "Unknown error",
                }
              : f
          )
        );
        Swal.fire({
          text: `Upload thất bại: ${fileToUpload.name}`,
          icon: "error",
          confirmButtonColor: "#007bff",
        });
        // Không dừng lại mà tiếp tục upload các file khác nếu có lỗi
      }
    }

    setUploading(false); // Kết thúc trạng thái upload tổng thể

    if (allUploadsSuccessful) {
      // Giải phóng URL object sau khi upload hoàn tất
      files.forEach((f) => URL.revokeObjectURL(f.videoUrl));
      setFiles([]); // Xóa tất cả file preview sau khi upload thành công
      Toast.fire({
        icon: "success",
        title: "Tất cả file đã được upload thành công!",
        timer: 1500,
      });
    } else {
      Swal.fire({
        text: "Có lỗi xảy ra trong quá trình upload một hoặc nhiều file. Vui lòng kiểm tra lại.",
        icon: "info",
        confirmButtonColor: "#007bff",
      });
    }
  };

  // Hàm để xóa một file cụ thể khỏi danh sách
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((f) => f.name === fileName);
      if (fileToRemove && fileToRemove.videoUrl) {
        URL.revokeObjectURL(fileToRemove.videoUrl); // Giải phóng URL
      }
      return prevFiles.filter((f) => f.name !== fileName);
    });
  };

  return (
    <div className="upload-real-container">
      <div className="box_select_file">
        <input
          id="select-file"
          type="file"
          accept="video/*"
          multiple
          onChange={handleSelectFile}
          disabled={uploading}
        />
        <label htmlFor="select-file" className="select-file">
          <span>Select file</span>
        </label>
        <button className="select-again" onClick={handleSelectAgain}>
          Select again
        </button>
      </div>
      <div className="box_category_count-file">
        <label htmlFor="vid-real" className="category-vid">
          <input
            type="radio"
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            id="vid-real"
            checked={category === "video_real"}
            value="video_real"
          />
          <span>REAL</span>
        </label>
        <span style={{ color: "#657e1f" }}>│</span>
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

      {/* Hiển thị danh sách các file đã chọn và tiến trình */}
      <div className="file-list">
        {files.map((file, index) => (
          <div key={file.name} className="file-item">
            {/* {file.videoUrl && (
              <video
                src={file.videoUrl}
                controls
                width="200"
                height="150"
                style={{ marginTop: "10px" }}
              />
            )} */}

            <p>
              <EMT text={file.name} start={5} end={8} /> - {file.type}
              {file.isUploading && (
                <span style={{ marginLeft: "10px", color: "#007bff" }}>
                  {" "}
                  (Đang tải lên...)
                </span>
              )}
              {file.uploadError && (
                <span style={{ marginLeft: "10px", color: "red" }}>
                  {" "}
                  (Lỗi: {file.uploadError})
                </span>
              )}
            </p>
            {file.progress > 0 &&
              file.progress < 100 && ( // Chỉ hiển thị progress bar khi đang upload và chưa hoàn thành
                <div>
                  <progress value={file.progress} max="100"></progress>
                  <span style={{ marginLeft: "10px" }}>{file.progress}%</span>
                </div>
              )}
            {file.progress === 100 &&
              !file.isUploading &&
              !file.uploadError && (
                <span style={{ color: "green", marginLeft: "10px" }}>
                  {" "}
                  Đã hoàn thành!
                </span>
              )}
            {!file.isUploading &&
              file.progress < 100 && ( // Chỉ hiển thị nút xóa khi không upload và chưa hoàn thành
                <button
                  className="remove-file-btn"
                  onClick={() => handleRemoveFile(file.name)}
                  disabled={uploading}
                >
                  Xóa
                </button>
              )}
          </div>
        ))}
      </div>

      <button onClick={handleUpload} className="btn_upload_file">
        {uploading ? "Đang upload..." : "Upload"}
      </button>
      {uploading && (
        <div className="notification-upload">
          <p>Đang trong quá trình upload file lên hệ thống vui lòng </p>
          <p>không F5 hoặc refesh lại trang để tránh sự cố xảy ra.</p>
        </div>
      )}
    </div>
  );
}
