import "./DashBoard.css";
import authAPI from "../../apis/authAPI";
import { session } from "../../utils/setStorage";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";

export default function DashBoard() {
  const [validated, setValidated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const timeRef = useRef(null);
  const timeExpires = 1000 * 60 * 10;

  useEffect(() => {
    const valid = session.get("validated");
    if (!valid) {
      setValidated(false);
      return;
    }
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    setValidated(true);
    timeRef.current = setTimeout(() => {
      session.remove("validated");
      setValidated(false);
    }, timeExpires);
  }, [timeExpires]);

  const verifyCode = async (code) => {
    if (!code) {
      setError("Missing input data!");
      return;
    }
    try {
      await authAPI.verifyCode({ security_code: code });
      setValidated(true);
      session.set("validated", true);
    } catch (error) {
      setError(error.response?.data?.message);
      setValidated(false);
    }
  };

  return (
    <>
      {validated ? (
        <div className="admin-layout-container">
          <aside className="admin-sidebar">
            <nav>
              <ul>
                <li>
                  <Link to="/admin">ADD USER</Link>
                </li>
                <li>
                  <Link to="/admin/search-member">EDIT USER</Link>
                </li>
                <li>
                  <Link to="/admin/action-quote">ACTION QUOTE</Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="admin-content">
            {/* Đây là vị trí "placeholder" mà các component con sẽ được render vào */}
            <Outlet />
          </main>
        </div>
      ) : (
        <div className="admin-layout-container">
          <div className="enter-code-valid">
            <label htmlFor="enter-code-valid">Plesae enter code</label>
            <input
              type="password"
              id="enter-code-valid"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {error && <p className="error">{error}</p>}

            <button type="button" onClick={() => verifyCode(code)}>
              Verify
            </button>
          </div>
        </div>
      )}
    </>
  );
}
