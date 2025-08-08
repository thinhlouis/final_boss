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
      <div className="footer-author">
        <p className="root_flex_row gap_025">
          © 2025 - I'm A ♥
          <span>
            <span>
              <Link to="/">ksc88.net</Link>
            </span>
            <span>
              <Link to="/">Final Boss</Link>
            </span>
            <span>
              <Link to="/">Trùm Cuối</Link>
            </span>
            <span>
              <Link to="/">nht louis</Link>
            </span>
            <span>
              <Link to="/">Kenji XX</Link>
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}
