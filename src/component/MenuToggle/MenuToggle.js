import "./MenuToggle.css";
import AuthContext from "../../context/AuthContext/AuthContext";
import ScrollContext from "../../context/ScrollContex/ScrollContex";

import { useContext } from "react";
import {
  RiProfileFill,
  RiUserSharedFill,
  RiFileEditFill,
  RiHome4Fill,
  RiVidiconFill,
  RiUserReceivedFill,
  RiHeartPulseFill,
  RiDashboardFill,
} from "react-icons/ri";
import { Link } from "react-router-dom";

const MenuToggle = ({ isAuthenticated, isRoot }) => {
  const { handleLogout } = useContext(AuthContext);
  const { openMenu, animation } = useContext(ScrollContext);

  return (
    <>
      {openMenu && (
        <nav
          className={
            animation
              ? "menu_open container-toggle"
              : "menu_close container-toggle"
          }
        >
          <ul className="menu-toggle toggle-mobile">
            {isAuthenticated && isRoot && (
              <li>
                <Link to="/admin">
                  ADMIN <RiDashboardFill />
                </Link>
              </li>
            )}

            <li>
              <Link to="/">
                HOME <RiHome4Fill />
              </Link>
            </li>

            <li>
              <Link to="/bmi">
                CHECK BMI <RiHeartPulseFill />
              </Link>
            </li>

            <li>
              <Link to={"/ksc/movies"}>
                CINEMA <RiVidiconFill />
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/profile">
                  Profile
                  <RiProfileFill />
                </Link>
              </li>
            )}

            {isAuthenticated ? (
              <li onClick={handleLogout}>
                <Link to="#">
                  LOGOUT <RiUserSharedFill />
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/sigin">
                  LOGIN <RiUserReceivedFill />
                </Link>
              </li>
            )}
          </ul>

          <ul className="menu-toggle toggle-destop">
            <li>
              <Link to="/profile">
                User Profile
                <RiProfileFill />
              </Link>
            </li>
            <li>
              <Link to="/profile/edit-profile">
                Edit Profile
                <RiFileEditFill />
              </Link>
            </li>
            <li onClick={handleLogout}>
              <Link to="#">
                LOGOUT <RiUserSharedFill />
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default MenuToggle;
