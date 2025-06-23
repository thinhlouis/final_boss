import "./Cinemas.css";
import VideoRealistic from "./VideoRealistic/VideoRealistic";
import VideoPlaylistStream from "./VideoPlaylist/VideoPlaylist";

import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Cinemas() {
  const [cinemas, setCinemas] = useState("");

  return (
    <div className="cinemas-container">
      <h1>Cinemas Of Final Boss</h1>
      <nav>
        <ul>
          <li onClick={() => setCinemas("jav")}>
            <NavLink
              to="#"
              className={cinemas === "jav" ? "active-category" : ""}
            >
              JAV
            </NavLink>
          </li>
          <li onClick={() => setCinemas("real")}>
            <NavLink
              to="##"
              className={cinemas === "real" ? "active-category" : ""}
            >
              REAL
            </NavLink>
          </li>
        </ul>
      </nav>
      {cinemas === "jav" && <VideoPlaylistStream />}
      {cinemas === "real" && <VideoRealistic />}
    </div>
  );
}
