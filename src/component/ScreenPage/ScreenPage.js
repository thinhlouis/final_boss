import "./ScreenPage.css";

import React from "react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function ScreenPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const subpath = pathname.replace("/ksc", "") && pathname.replace("/ksc/", "");

  useEffect(() => {
    if (!subpath) {
      return navigate("*");
    }
  }, [navigate, subpath]);

  return <Outlet />;
}
