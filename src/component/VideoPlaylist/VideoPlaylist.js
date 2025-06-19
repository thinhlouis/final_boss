import React, { useState, useContext } from "react";

import HLSVideoPlayer from "./HLSVideoPlayer";
import hlsLinks from "./VideoData";
import "./VideoPlaylist.css";

import AuthContext from "../../context/AuthContext";

const VideoPlaylistStream = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const { auth } = useContext(AuthContext);
  const { videos } = auth;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Để cuộn mượt mà
    });
  };

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
    scrollToTop();
  };

  return (
    <div
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
      className="video-playlist-container"
    >
      <h1>Video Playlist Of Final Boss</h1>

      {/* Nút yêu cầu tương tác trước khi phát (cho iOS) */}
      {!userInteracted && (
        <button
          className="btn-interact"
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
            url={videos[currentVideoIndex].url}
            playing={playing}
            onEnded={handleNext}
          />
          <h3>{videos[currentVideoIndex].name}</h3>
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
          className="btn-prev"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentVideoIndex === videos.length - 1}
          style={{ padding: "8px 16px" }}
          className="btn-next"
        >
          Next
        </button>
      </div>

      {/* Danh sách video */}

      <div className="container_list">
        {videos.map((video, index) => (
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
