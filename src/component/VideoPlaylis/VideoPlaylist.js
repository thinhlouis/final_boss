import React, { useState } from "react";
import ReactPlayer from "react-player";

import hlsLinks from "./VideoData";
import "./VideoPlaylist.css";

const VideoPlaylistStream = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const handleNext = () => {
    if (currentVideoIndex < hlsLinks.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setPlaying(true);
    }
  };

  const handleSelectVideo = (index) => {
    setCurrentVideoIndex(index);
    setPlaying(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Video Playlist</h1>

      {/* Player */}
      <div style={{ marginBottom: "20px", marginLeft: "20px" }}>
        <ReactPlayer
          url={hlsLinks[currentVideoIndex].url}
          controls
          playing={playing}
          width="80%"
          height="auto"
          onEnded={handleNext}
          config={{
            file: {
              forceHLS: true, // Bắt buộc sử dụng HLS
            },
          }}
        />
        <h3>{hlsLinks[currentVideoIndex].name}</h3>
      </div>

      {/* Playlist */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handlePrev} disabled={currentVideoIndex === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentVideoIndex === hlsLinks.length - 1}
        >
          Next
        </button>
      </div>

      <div className="container_list">
        {hlsLinks.map((video, index) => (
          <div key={video.id} className="container_list_item">
            <p>{video.name}</p>
            <img
              src={video.thumbnail}
              alt={video.name}
              onClick={() => handleSelectVideo(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlaylistStream;
