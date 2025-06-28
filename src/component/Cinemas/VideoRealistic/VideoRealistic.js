import "./VideoRealistic.css";
import videoAPI from "../../../apis/videoAPI";

import React, { useState, useRef, useEffect } from "react";
import { AiFillBackward, AiFillForward } from "react-icons/ai";
import { PulseLoader } from "react-spinners";

const KEY = process.env.REACT_APP_API_KEY;

const VideoRealistic = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const videoRef = useRef(null);

  const limit = 10;

  useEffect(() => {
    const fetchVideoRealistic = async () => {
      setLoading(true);
      try {
        const response = await videoAPI.videoReal(KEY, defaultPage, limit);
        const { currentPage, totalPages, videos } = response.data;

        setVideos(videos); // Cập nhật danh sách video của trang hiện tại
        setDefaultPage(currentPage);
        setTotalPages(totalPages);

        // *** THAY ĐỔI QUAN TRỌNG Ở ĐÂY ***
        // Chỉ đặt currentPlayingVideo nếu nó chưa được thiết lập (lần đầu tiên component mount)
        if (!currentPlayingVideo && videos.length > 0) {
          setCurrentPlayingVideo(videos[0]); // Đặt video đầu tiên của trang đầu tiên làm video ban đầu
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoRealistic();
  }, [defaultPage, currentPlayingVideo]); // Thêm currentPlayingVideo vào dependency array

  const handlePlay = (id) => {
    const videoToPlay = videos.find((video) => video.id === id);
    if (videoToPlay && videoToPlay.id !== currentPlayingVideo?.id) {
      // Chỉ thay đổi nếu là video khác
      setCurrentPlayingVideo(videoToPlay); // Đặt đối tượng video mới
      if (videoRef.current) {
        videoRef.current.load(); // Buộc tải lại video mới
      }
    }
  };

  const handlePageClick = (page) => {
    if (page !== defaultPage) {
      setDefaultPage(page);
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 100,
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
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      {!autoPlay && (
        <button className="play-video" onClick={() => setAutoPlay(true)}>
          Nhấn để phát video
        </button>
      )}
      <div className="container-video-realistic">
        <div className="container-item-real">
          <div className="video-realistic-item">
            {autoPlay && (
              <>
                <video
                  ref={videoRef}
                  controls
                  autoPlay={autoPlay}
                  loop
                  muted
                  playsInline
                >
                  <source
                    src={currentPlayingVideo?.videoUrl}
                    type="video/mp4"
                  />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
                <div className="video-controls-overlay">
                  <button onClick={handleRewind}>
                    <AiFillBackward />
                  </button>
                  <button onClick={handleForward}>
                    <AiFillForward />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {autoPlay && (
          <div className="item-btn-realistic-small">
            <span className="broder"></span>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageClick(i + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: i + 1 === defaultPage ? "#465716" : "#eee",
                  color: i + 1 === defaultPage ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "40%",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading-file">
            <PulseLoader color="#657e1f" size={15} />
          </div>
        ) : (
          <div className="realistic-container-item items-video-real">
            {/* Danh sách phát */}
            {autoPlay && (
              <>
                <div className="playlist_video_realistic">
                  {videos.map((video) => (
                    <div className="item-video-realistic" key={video.id}>
                      <img
                        src={video.thumbUrl}
                        onClick={() => handlePlay(video.id)}
                        alt="thumb"
                      />
                      <p className="fileName-realistic">{video.fileName}</p>
                    </div>
                  ))}
                </div>
                <div className="item-btn-realistic-full">
                  <span className="broder"></span>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageClick(i + 1)}
                      style={{
                        margin: "0 5px",
                        padding: "5px 10px",
                        backgroundColor:
                          i + 1 === defaultPage ? "#465716" : "#eee",
                        color: i + 1 === defaultPage ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "40%",
                        cursor: "pointer",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {isVisible && (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
};

export default VideoRealistic;
