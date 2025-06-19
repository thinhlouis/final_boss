import React from "react";
import "./Header.css";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export default function Header() {
  const { auth, handleLogout } = useContext(AuthContext);

  const isAuthenticated = auth.isAuthenticated;

  const activeLink = ({ isActive }) => (isActive ? "active-item" : "");

  return (
    <div className="Header">
      <nav className="Header__nav">
        <ul className="Header__nav-list">
          {isAuthenticated && (
            <li>
              <NavLink to="/upload-video-767202115" className={activeLink}>
                UPLOAD
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <NavLink to="/video-final-boss-202115-767" className={activeLink}>
                VIDEO
              </NavLink>
            </li>
          )}

          {isAuthenticated ? (
            <li onClick={handleLogout}>
              <NavLink to="*">LOGOUT</NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/" className={activeLink}>
                LOGIN
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
