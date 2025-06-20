import React, { useState, useContext, useEffect } from "react";

import HLSVideoPlayer from "./HLSVideoPlayer";
import hlsLinks from "./VideoData";
import "./VideoPlaylist.css";

import hot from "../../assets/hot-icon.png";

import AuthContext from "../../context/AuthContext";

const VideoPlaylistStream = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { auth } = useContext(AuthContext);
  const { videos } = auth;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Để cuộn mượt mà
    });
  };

  // Hàm xử lý sự kiện cuộn
  const handleScroll = () => {
    // Kiểm tra vị trí cuộn: nếu cuộn xuống quá 100px thì hiển thị nút
    if (window.pageYOffset > 250) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
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

  // Sử dụng useEffect để thêm và xóa lắng nghe sự kiện cuộn
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component mount

  return (
    <div className="video-playlist-container">
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
          <div
            key={video.id}
            className="container_list_item"
            onClick={() => handleSelectVideo(index)}
          >
            <img src={video.thumbnail} alt={video.name} />
            <p>{video.name}</p>
            {video.tag === "hot" && (
              <img src={hot} alt="Hot" className="icon-hot" />
            )}
          </div>
        ))}
      </div>
      {isVisible && (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default VideoPlaylistStream;
