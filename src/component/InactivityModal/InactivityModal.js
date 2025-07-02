import "./InactivityModal.css";
import ActiveContext from "../../context/ActiveContext/ActiveContext";

import React, { useState, useContext } from "react";

function InactivityModal() {
  const [code, setCode] = useState("");

  const { verifySecurityCode, error, setError } = useContext(ActiveContext);

  const handleInputChange = (e) => {
    setError("");
    setCode(e.target.value);
  };

  return (
    <div className="inactivity-modal-overlay">
      <div className="inactivity-modal-content">
        <aside className="content-inactivity">
          <h2>Phiên làm việc tạm dừng</h2>
          <p>Bạn đã không hoạt động trong một thời gian.</p>
          <p>Vui lòng nhập mã bảo mật để tiếp tục.</p>
        </aside>

        <input
          type="password" // Hoặc "text" tùy theo yêu cầu của bạn
          placeholder="Nhập mã bảo mật"
          value={code}
          onChange={handleInputChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" onClick={() => verifySecurityCode(code)}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
}

export default InactivityModal;
