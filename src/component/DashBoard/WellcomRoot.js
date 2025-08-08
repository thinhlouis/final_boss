import React from "react";
import { useOutletContext } from "react-router-dom";

export default function WellcomRoot() {
  const fullname = useOutletContext();
  return (
    <div className="wellcome-root">
      <p>
        Wellcom Super Root <strong>{fullname}</strong>
      </p>
      <p>Chào mừng bạn đã quay trở lại.</p>
    </div>
  );
}
