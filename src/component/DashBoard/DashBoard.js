import "./DashBoard.css";
import AuthContext from "../../context/AuthContext/AuthContext";
import SecurityDashBoard from "./SecurityDashBoard";
import { objRouter } from "./ObjRouter";
import NavSidebar from "./NavSidebar";

import React from "react";
import { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

export default function DashBoard({ setFullPage }) {
  const { auth, loading } = useContext(AuthContext);
  const { user } = auth;

  const { pathname } = useLocation();

  const { systems, entertainment } = objRouter;

  const isRoot = user?.role === "super_root";

  if (loading)
    return (
      <div style={{ height: "60vh", marginTop: "5rem" }}>
        <PropagateLoader color="#657e1f" />
      </div>
    );

  if (!isRoot) return <Navigate to="/404" replace state={{ from: pathname }} />;

  return (
    <SecurityDashBoard>
      <div className="admin-layout-container">
        <aside className="admin-sidebar">
          <NavSidebar data={systems} title="Systems" />
          <NavSidebar data={entertainment} title="Entertainment" />
        </aside>
        <main className="admin-content">
          {/* Đây là vị trí "placeholder" mà các component con sẽ được render vào */}
          <Outlet context={user?.fullname} />
        </main>
      </div>
    </SecurityDashBoard>
  );
}
