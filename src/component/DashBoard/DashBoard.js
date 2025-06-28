import "./DashBoard.css";

import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DashBoard() {
  return (
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
  );
}
