import "./Error.css";

import React, { useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      document.title = "FINAL BOSS CINEPLEX - HỆ THỐNG RẠP CHIẾU PHIM HIỆN ĐẠI";
    };
  }, []);

  useLayoutEffect(() => {
    document.title = "Final Boss - Error Page";
  }, []);

  return (
    <div className="error">
      <div className="box-error">
        <h1 className="text-title">404. That's an error</h1>
        <h2 className="text-error">Page not found</h2>

        <p className="text-error">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã xảy ra lỗi khác.
        </p>
        <p className="text-error">
          Vui lòng quay trở lại, hoặc đi đến{" "}
          <Link to="/" className="error-link">
            <strong>Trang Chủ </strong>
          </Link>
          để đi đến trang khác.
        </p>
        <button
          type="button"
          title="go back"
          className="error-button"
          onClick={() => navigate(-1)}
        >
          QUAY LẠI
        </button>
      </div>
    </div>
  );
};

export default Error;
