import React, { useState } from "react";
import HLSVideoPlayer from "./HLSVideoPlayer";
import hlsLinks from "./VideoData";
import "./VideoPlaylist.css";

const VideoPlaylistStream = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Video Playlist</h1>

      {/* Nút yêu cầu tương tác trước khi phát (cho iOS) */}
      {!userInteracted && (
        <button
          onClick={() => setUserInteracted(true)}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Nhấn để phát video
        </button>
      )}

      {/* Player */}
      {userInteracted && (
        <>
          <HLSVideoPlayer
            url={hlsLinks[currentVideoIndex].url}
            playing={playing}
            onEnded={handleNext}
          />
          <h3>{hlsLinks[currentVideoIndex].name}</h3>
        </>
      )}

      {/* Điều khiển playlist */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentVideoIndex === 0}
          style={{ padding: "8px 16px" }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentVideoIndex === hlsLinks.length - 1}
          style={{ padding: "8px 16px" }}
        >
          Next
        </button>
      </div>

      {/* Danh sách video */}

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
