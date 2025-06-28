import "./Cinemas.css";
import VideoRealistic from "./VideoRealistic/VideoRealistic";
import VideoPlaylistStream from "./VideoPlaylist/VideoPlaylist";
import Movies from "../Movies/Movies";

import React from "react";
import { useState } from "react";

export default function Cinemas() {
  const [cinemas, setCinemas] = useState("");

  return (
    <div className="cinemas-container">
      <h1>Cinemas Of Final Boss</h1>
      <nav>
        <ul>
          <li onClick={() => setCinemas("jav")}>
            <p className={cinemas === "jav" ? "active-category" : ""}>JAV</p>
          </li>
          <li onClick={() => setCinemas("real")}>
            <p className={cinemas === "real" ? "active-category" : ""}>REAL</p>
          </li>
          <li onClick={() => setCinemas("mov")}>
            <p className={cinemas === "mov" ? "active-category" : ""}>MOV</p>
          </li>
        </ul>
      </nav>
      {cinemas === "jav" && <VideoPlaylistStream />}
      {cinemas === "real" && <VideoRealistic />}
      {cinemas === "mov" && <Movies />}
    </div>
  );
}
