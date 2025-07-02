import "./Header.css";
import AuthContext from "../../context/AuthContext/AuthContext";

import React from "react";
import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  RiHome4Fill,
  RiFolderUploadFill,
  RiVidiconFill,
  RiUserSharedFill,
  RiUserReceivedFill,
  RiHeartPulseFill,
  RiDashboardFill,
} from "react-icons/ri";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { auth, handleLogout, loading } = useContext(AuthContext);

  const isAuthenticated = auth.isAuthenticated;
  const isRoot = auth?.user?.role === "super_root";

  const activeLink = ({ isActive }) => (isActive ? "active-item" : "");

  const pageActive = () => {
    let isPage;
    if (window.location.pathname.includes("/player/")) {
      isPage = { display: "none" };
    }
    if (window.location.pathname.includes("/admin")) {
      isPage = { width: "100%", margin: "0 auto" };
    }
    return isPage;
  };

  const isPageActive = pageActive();

  const classHeaderScroll = isScrolled
    ? "Header scrolled-up"
    : "Header scrolled-down";

  useEffect(() => {
    let prevScrollpos = window.scrollY;
    const handleScroll = () => {
      let currentScrollPos = window.scrollY;
      if (prevScrollpos > currentScrollPos) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      prevScrollpos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={classHeaderScroll} style={isPageActive ? isPageActive : {}}>
      {!loading && (
        <nav className="Header__nav">
          <ul className="Header__nav-list">
            <li>
              <NavLink to="/" className={activeLink}>
                <span className="icon-header">
                  <RiHome4Fill />
                </span>
                <sup>HOME</sup>
              </NavLink>
            </li>

            <li>
              <NavLink to="/bmi" className={activeLink}>
                <span className="icon-header">
                  <RiHeartPulseFill />
                </span>
                <sup>BMI</sup>
              </NavLink>
            </li>

            {isAuthenticated && isRoot && (
              <li>
                <NavLink to="/upload-video-767202115" className={activeLink}>
                  <span className="icon-header">
                    <RiFolderUploadFill />
                  </span>
                  <sup>UPLOAD</sup>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to={
                  isAuthenticated && isRoot
                    ? "/video-final-boss-202115-767"
                    : "/movies"
                }
                className={activeLink}
              >
                <span className="icon-header">
                  <RiVidiconFill />
                </span>
                <sup>CINEMA</sup>
              </NavLink>
            </li>

            {isAuthenticated && isRoot && (
              <li>
                <NavLink to="/admin" className={activeLink}>
                  <span className="icon-header">
                    <RiDashboardFill />
                  </span>
                  <sup>DASHBOARD</sup>
                </NavLink>
              </li>
            )}

            {isAuthenticated ? (
              <li onClick={handleLogout}>
                <NavLink to="*">
                  <span className="icon-header">
                    <RiUserSharedFill />
                  </span>
                  <sup>LOGOUT</sup>
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/sigin" className={activeLink}>
                  <span className="icon-header">
                    <RiUserReceivedFill />
                  </span>
                  <sup>LOGIN</sup>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
