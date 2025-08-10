import "./Header.css";
import userAPI from "../../apis/userAPI";
import AuthContext from "../../context/AuthContext/AuthContext";
import ScrollContext from "../../context/ScrollContex/ScrollContex";
import ActiveContext from "../../context/ActiveContext/ActiveContext";
import MenuToggle from "../MenuToggle/MenuToggle";
import { useWindowSize } from "../../hook/useWindowSize";
import banner_header from "../../assets/banner.png";

import { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  RiHome4Fill,
  RiVidiconFill,
  RiUserReceivedFill,
  RiHeartPulseFill,
  RiDashboardFill,
  RiAccountCircleFill,
  RiMenuLine,
  RiLockFill,
  RiLockUnlockFill,
  RiRefund2Fill,
} from "react-icons/ri";

export default function Header() {
  const [lockSreen, setLockSreen] = useState(false);
  const { auth, loading } = useContext(AuthContext);
  const { isScrolled, setOpenMenu, setAnimation, handleOpenMenu, modal } =
    useContext(ScrollContext);

  const { showModal, setShowModal } = useContext(ActiveContext);

  const isAuthenticated = auth.isAuthenticated;
  const isRoot = auth?.user?.role === "super_root";

  const { width } = useWindowSize();

  const menuRef = useRef(null);
  const menuMobileRef = useRef(null);
  const timeRef = useRef(null);

  const activeLink = ({ isActive }) =>
    lockSreen
      ? "unactive disabled-link"
      : isActive
      ? "unactive active-item"
      : "unactive";

  const pageActive = () => {
    let isPage;
    if (window.location.pathname.includes("/player/")) {
      isPage = { display: "none" };
    }
    return isPage;
  };

  const isPageActive = pageActive();

  const classHeaderScroll = isScrolled
    ? "Header scrolled-up"
    : "Header scrolled-down";

  const classHeaderOpenModal = modal ? "hidden-header" : "unhidden-header";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAnimation(false);
        timeRef.current = setTimeout(() => {
          setOpenMenu(false);
        }, 800);
      }
      if (menuMobileRef.current && !menuMobileRef.current.contains(e.target)) {
        setAnimation(false);
        timeRef.current = setTimeout(() => {
          setOpenMenu(false);
        }, 800);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setOpenMenu, setAnimation]);

  useEffect(() => {
    if (!showModal) {
      setLockSreen(false);
      return;
    }
    setLockSreen(true);
  }, [showModal]);

  const handleClick = (e) => {
    if (lockSreen) {
      e.preventDefault(); // Ngăn chặn chuyển hướng
    }
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Ê..ê làm gì đó? Nhập code đi!",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  };

  const handleLockScreen = () => {
    if (showModal) return;
    Swal.fire({
      width: "18rem",
      title: "Do you want to lock screen?",
      showCancelButton: true,
      confirmButtonText: "Lock",
      cancelButtonText: `Don't lock`,
      customClass: {
        title: "title-lock",
        confirmButton: "btn-success-lock",
        cancelButton: "btn-danger-lock",
      },
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await userAPI.change({ isActive: false });
        setLockSreen((prve) => !prve);
        setShowModal(true);
      }
    });
  };

  return (
    <div
      className={`${classHeaderScroll} ${classHeaderOpenModal}`}
      style={isPageActive ? isPageActive : {}}
    >
      <div className="root_flex_column banner_app" title="KSC88.NET">
        <NavLink to="/" className={lockSreen ? "disabled-link" : ""}>
          <img
            src={banner_header}
            alt="Banner"
            width={"210px"}
            style={{ marginTop: "0.5rem" }}
          />
          <small>cái tên nói lên tất cả</small>
        </NavLink>
      </div>
      {!loading && (
        <nav className="Header__nav">
          {width > 768 ? (
            <ul className="Header__nav-list">
              {isAuthenticated && (
                <li
                  onClick={!lockSreen ? handleLockScreen : handleClick}
                  title={lockSreen ? "Màn hình tạm khóa" : "Khóa màn hình"}
                >
                  <Link className={`unactive ${lockSreen && "lock-screen"}`}>
                    <span className="icon-header">
                      {lockSreen ? <RiLockFill /> : <RiLockUnlockFill />}
                    </span>
                    <sup className="root_flex_row gap_025">
                      {lockSreen ? "SCREEN" : "LOCK"}
                    </sup>
                  </Link>
                </li>
              )}

              <li>
                <NavLink
                  to="/"
                  className={activeLink}
                  onClick={lockSreen && handleClick}
                >
                  <span className="icon-header">
                    <RiHome4Fill />
                  </span>
                  <sup>HOME</sup>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/loto"
                  className={activeLink}
                  onClick={lockSreen && handleClick}
                >
                  <span className="icon-header">
                    <RiRefund2Fill />
                  </span>
                  <sup>LOTO</sup>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/bmi"
                  className={activeLink}
                  onClick={lockSreen && handleClick}
                >
                  <span className="icon-header">
                    <RiHeartPulseFill />
                  </span>
                  <sup>BMI</sup>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={"/ksc/movies"}
                  className={activeLink}
                  onClick={lockSreen && handleClick}
                >
                  <span className="icon-header">
                    <RiVidiconFill />
                  </span>
                  <sup>CINEMA</sup>
                </NavLink>
              </li>

              {isAuthenticated && isRoot && (
                <li>
                  <NavLink
                    to="/admin"
                    className={activeLink}
                    onClick={lockSreen && handleClick}
                  >
                    <span className="icon-header">
                      <RiDashboardFill />
                    </span>
                    <sup>ADMIN</sup>
                  </NavLink>
                </li>
              )}

              {isAuthenticated ? (
                <li
                  ref={menuRef}
                  onClick={lockSreen ? handleClick : handleOpenMenu}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Link
                    className={
                      lockSreen
                        ? "unactive disabled-link"
                        : window.location.href.includes("/profile")
                        ? "unactive active-item"
                        : "unactive"
                    }
                    onClick={lockSreen && handleClick}
                  >
                    <span className="icon-header">
                      <RiAccountCircleFill />
                    </span>
                    <sup>ACCOUNT</sup>
                  </Link>

                  <MenuToggle
                    isAuthenticated={isAuthenticated}
                    isRoot={isRoot}
                  />
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
          ) : (
            <ul className="Header__nav-list nav-list-mobile">
              <li
                ref={menuMobileRef}
                onClick={handleOpenMenu}
                style={{
                  cursor: "pointer",
                }}
              >
                <NavLink className={activeLink}>
                  <span className="icon-header">
                    <RiMenuLine />
                  </span>
                  <sup>MENU</sup>
                </NavLink>
                <MenuToggle isAuthenticated={isAuthenticated} isRoot={isRoot} />
              </li>
            </ul>
          )}
        </nav>
      )}
    </div>
  );
}
