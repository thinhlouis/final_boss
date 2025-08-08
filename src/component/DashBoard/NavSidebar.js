import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";

export default function NavSidebar({ data, title }) {
  const [openNav, setOpenNav] = useState(false);

  const activeLink = ({ isActive }) => (isActive ? "active-box" : "");
  return (
    <nav>
      <h4 onClick={() => setOpenNav(!openNav)}>
        <span>{title}</span>
        <b>
          <RiArrowDownSFill />
        </b>
      </h4>
      <ul className={openNav ? "nav-list-open" : "nav-list-close"}>
        {data?.map((r) => (
          <li key={r.id}>
            <NavLink to={r.route} className={activeLink}>
              {r.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
