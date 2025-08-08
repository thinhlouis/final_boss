import React, { useState, useEffect, useRef } from "react";
import { ImEye, ImEyeBlocked, ImBackward2, ImForward3 } from "react-icons/im";

import "./VideoPlaylist.css";
import videoAPI from "../../../apis/videoAPI";
import splitLink from "../../../utils/spiltLink";

import HoverVideo from "../HoverVideo";

const KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_UIR_STREAM_API;
const CHAR = process.env.REACT_APP_CHARACTER_SPILIT;

const VideoPlaylistStream = ({ scrollToTop }) => {
  const [allVideosByPage, setAllVideosByPage] = useState({});
  const [videos, setVideos] = useState([]);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const videoRef = useRef(null);
  const modalRef = useRef(null);

  const limit = 20;

  useEffect(() => {
    const fetchVideos = async () => {
      if (allVideosByPage[defaultPage]) {
        // Kiểm tra nếu đã có dữ liệu cho trang này
        setVideos(allVideosByPage[defaultPage]);
        return;
      }

      setLoading(true);
      try {
        const response = await videoAPI.videos(KEY, defaultPage, limit);
        const {
          currentPage,
          totalPages,
          videos: fetchedVideos,
        } = response.data;

        setAllVideosByPage((prev) => ({
          ...prev,
          [currentPage]: fetchedVideos,
        }));
        setVideos(fetchedVideos); // Cập nhật danh sách video hiển thị

        if (!currentPlayingVideo || defaultPage === 1) {
          // Hoặc logic bạn muốn cho video ban đầu
          setCurrentPlayingVideo(fetchedVideos[0]);
          setCurrentVideoIndex(0); // Đảm bảo chỉ mục cũng khớp
        }

        setDefaultPage(currentPage);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [defaultPage, allVideosByPage, currentPlayingVideo]); // Thêm allVideosByPage vào dependency array

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModal(false);
        setPlaying(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      // Kiểm tra trong danh sách videos của trang hiện tại
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setCurrentPlayingVideo(videos[nextIndex]);
      setPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      // Kiểm tra trong danh sách videos của trang hiện tại
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setCurrentPlayingVideo(videos[prevIndex]);
      setPlaying(true);
    }
  };

  const handleSelectVideo = (index) => {
    setCurrentPlayingVideo(videos[index]);
    setCurrentVideoIndex(index);
    setOpenModal(true);
    setPlaying(false);
    scrollToTop();
  };

  const handlePageClick = (page) => {
    if (page !== defaultPage) {
      setDefaultPage(page);
    }
    scrollToTop();
  };

  return (
    <div className="video-playlist-container">
      {openModal && (
        <div className="view_current_video">
          {currentPlayingVideo && (
            <div
              ref={modalRef}
              className="root_flex_column"
              style={{ width: "fit-content", margin: "5rem auto" }}
            >
              <video
                key={currentPlayingVideo.url}
                ref={videoRef}
                controls
                muted
                loop={false}
                playsInline
                preload="auto"
                autoPlay={playing}
                onEnded={handleNext}
                poster={currentPlayingVideo.thumbnail}
              >
                <source
                  src={`${URL}/video-jav/${splitLink(
                    currentPlayingVideo?.url,
                    CHAR
                  )}?key=${KEY}`}
                  type="video/mp4"
                />
              </video>
              <h3 style={{ color: "#fff" }}>{currentPlayingVideo.name}</h3>
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  margin: "20px 0",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handlePrev}
                  disabled={currentVideoIndex === 0}
                  className="btn-next-prev"
                >
                  <ImBackward2 />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentVideoIndex === videos?.length - 1}
                  className="btn-next-prev"
                >
                  <ImForward3 />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="container_list">
          <p>Đang tải videos...</p>
        </div>
      ) : (
        <>
          {/* Điều khiển playlist */}

          <button
            className="show-content-nsfw"
            onClick={() => setShowContent((prve) => !prve)}
          >
            {showContent ? (
              <>
                <ImEye />
                <small>Hide NSFW</small>
              </>
            ) : (
              <>
                <ImEyeBlocked />
                <small>Show NSFW</small>
              </>
            )}
          </button>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "10px",
              borderTop: "2px solid #c1c1c1",
            }}
            className="page_mobile root_flex_row"
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageClick(i + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: i + 1 === defaultPage ? "#B5D249" : "#ccc",
                  color: i + 1 === defaultPage ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="container_list_jav">
            {videos?.map((video, index) => (
              <div
                key={index}
                className={
                  showContent
                    ? "container_list_item show-content"
                    : "container_list_item hide-content"
                }
                onDoubleClick={() => handleSelectVideo(index)}
              >
                <HoverVideo
                  className="item-content-jav"
                  src={`${URL}/video-jav/${splitLink(
                    video.url,
                    CHAR
                  )}?key=${KEY}`}
                  name={video.name}
                  tag={video.tag}
                  poster={video.thumbnail}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "20px",
          paddingTop: "10px",
          borderTop: "2px solid #c1c1c1",
        }}
        className="page_full root_flex_row"
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: i + 1 === defaultPage ? "#B5D249" : "#ccc",
              color: i + 1 === defaultPage ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoPlaylistStream;
