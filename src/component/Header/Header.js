import React from "react";
import "./Header.css";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export default function Header() {
  const { auth, handleLogout } = useContext(AuthContext);

  const isAuthenticated = auth.isAuthenticated;
  const isRoot = auth?.user?.role === "super_root";

  const activeLink = ({ isActive }) => (isActive ? "active-item" : "");

  return (
    <div className="Header">
      <nav className="Header__nav">
        <ul className="Header__nav-list">
          <li>
            <NavLink to="/" className={activeLink}>
              HOME
            </NavLink>
          </li>
          {!isAuthenticated && !isRoot && (
            <li>
              <NavLink to="/bmi" className={activeLink}>
                BMI
              </NavLink>
            </li>
          )}
          {isAuthenticated && isRoot && (
            <li>
              <NavLink to="/upload-video-767202115" className={activeLink}>
                UPLOAD
              </NavLink>
            </li>
          )}
          {isAuthenticated && isRoot && (
            <li>
              <NavLink to="/video-final-boss-202115-767" className={activeLink}>
                CINEMA
              </NavLink>
            </li>
          )}

          {isAuthenticated && isRoot && (
            <li>
              <NavLink to="/sigup" className={activeLink}>
                SIGUP
              </NavLink>
            </li>
          )}

          {isAuthenticated ? (
            <li onClick={handleLogout}>
              <NavLink to="*">LOGOUT</NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/sigin" className={activeLink}>
                LOGIN
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
