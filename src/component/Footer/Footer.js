import "./Footer.css";

import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const playPage = window.location.pathname.includes("/player/");
  return (
    <div className="footer" style={playPage ? { display: "none" } : {}}>
      <div className="footer-content">
        <p>Mọi vấn đề khi được đưa ra đều có cách giải quyết.</p>
        <p>Nếu có vấn đề không giải quyết được...</p>
        <p>
          Thì ta nên <strong>“ giải quyết đứa đưa ra vấn đề ”</strong>
        </p>
        <p style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          Thế là okie thôi!
        </p>
      </div>

      <span className="border-footer"></span>
      <div className="footer-author">
        <p>
          Final Boss - © 2025 ♥ <Link to="/">ksc88.net</Link>
        </p>
      </div>
    </div>
  );
}
