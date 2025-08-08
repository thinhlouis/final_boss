import "./VideoRealistic.css";
import videoAPI from "../../../apis/videoAPI";
import { useActive } from "../../../hook/useActive";
import splitLink from "../../../utils/spiltLink";
import HoverVideo from "../HoverVideo";
import ScrollContext from "../../../context/ScrollContex/ScrollContex";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";

import {
  ImRedo,
  ImUndo,
  ImPlay3,
  ImPause2,
  ImEye,
  ImEyeBlocked,
} from "react-icons/im";
import { CgClose, CgPlayTrackPrev, CgPlayTrackNext } from "react-icons/cg";
import { PulseLoader } from "react-spinners";

const KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_UIR_STREAM_API;
const CHAR = process.env.REACT_APP_CHARACTER_SPILIT;

const VideoRealistic = ({ scrollToTop }) => {
  const [allVideosByPage, setAllVideosByPage] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // currentPlayingVideo sẽ được cập nhật bởi useEffect dựa trên currentVideoIndex
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Thay thế autoPlay bằng isPlaying để quản lý trạng thái play/pause
  const [showAllVideo, setShowAllVideo] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { setModal } = useContext(ScrollContext);

  const videoRef = useRef(null); // Ref cho video chính
  const modalRef = useRef(null);
  const timeoutCloseRef = useRef(null);

  const videoHoverRef = useRef([]); // Ref cho các video nhỏ trong danh sách
  const divCurrentRef = useRef([]);

  const limit = 12;

  // Cập nhật mảng ref cho các video nhỏ khi danh sách videos thay đổi
  useEffect(() => {
    videoHoverRef.current = videos.map(
      (_, i) => videoHoverRef.current[i] || React.createRef()
    );
    divCurrentRef.current = videos.map(
      (_, i) => divCurrentRef.current[i] || React.createRef()
    );
  }, [videos]);

  useEffect(() => {
    if (!openModal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [openModal, setModal]);

  // Effect để fetch video API
  useEffect(() => {
    const fetchVideoRealistic = async () => {
      if (allVideosByPage[defaultPage]) {
        // Kiểm tra nếu đã có dữ liệu cho trang này
        setVideos(allVideosByPage[defaultPage]);
        return;
      }
      setLoading(true);
      try {
        const response = await videoAPI.videoReal(KEY, defaultPage, limit);
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

        // Cập nhật danh sách video của trang hiện tại
        setDefaultPage(currentPage);
        setTotalPages(totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoRealistic();
  }, [defaultPage, allVideosByPage, currentPlayingVideo]); // Thêm currentPlayingVideo vào dependency array

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModal(false);
        setIsPlaying(false);
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
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      // Kiểm tra trong danh sách videos của trang hiện tại
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setCurrentPlayingVideo(videos[prevIndex]);
      setIsPlaying(true);
    }
  };

  // Xử lý khi chọn video từ danh sách (thumbnails)
  const handleSelectVideo = useCallback(
    (index) => {
      setCurrentPlayingVideo(videos[index]);
      setCurrentVideoIndex(index); // Cập nhật video mới
      setOpenModal(true);
      setIsPlaying(false);
    },
    [videos]
  );

  // Xử lý play/pause bằng nút
  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) {
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Lỗi khi play bằng nút:", error);
      }
    }
  }, [isPlaying]);

  // ... (Các hàm handlePageClick, handleRewind, handleForward, handleMouseEnter/Leave của controls)

  const handlePageClick = useCallback(
    (page) => {
      if (page !== defaultPage) {
        setDefaultPage(page);
      }
    },
    [defaultPage]
  );

  const handleRewind = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  }, []);

  const handleForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  }, []);

  const handleMouseEnterControls = () => {
    setShowControls(true);
  };

  const handleMouseLeaveControls = () => {
    setShowControls(false);
  };

  const onTouchStart = () => {
    setShowClose((prve) => !prve);
  };

  const onTouchEnd = () => {
    if (timeoutCloseRef.current) {
      clearTimeout(timeoutCloseRef.current);
    }
    timeoutCloseRef.current = setTimeout(() => {
      setShowClose(false);
    }, 4000);
  };

  useActive(3000, handleMouseLeaveControls);

  return (
    <>
      <div className="container-video-realistic">
        {!showAllVideo && (
          <button className="play-video" onClick={() => setShowAllVideo(true)}>
            starts watching
          </button>
        )}
        {openModal && (
          <div className="video-realistic-item">
            {showAllVideo && (
              <div className="video-responsive-container root_flex_row">
                {/* Đảm bảo currentPlayingVideo tồn tại trước khi render thẻ video */}
                {currentPlayingVideo && (
                  <>
                    <div
                      ref={modalRef}
                      className="current-video"
                      onMouseEnter={handleMouseEnterControls}
                      onMouseOut={handleMouseLeaveControls}
                      onMouseMove={handleMouseEnterControls}
                    >
                      <video
                        key={currentPlayingVideo.videoUrl}
                        ref={videoRef}
                        controls
                        autoPlay={isPlaying} // Luôn bật autoPlay, dùng isPlaying state để kiểm soát
                        preload="auto"
                        loop={false}
                        muted // Quan trọng cho autoplay trên di động
                        playsInline
                        poster={currentPlayingVideo?.thumbUrl}
                        onMouseEnter={handleMouseEnterControls}
                        onMouseOut={handleMouseLeaveControls}
                        onMouseMove={handleMouseEnterControls}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                      >
                        <source
                          src={`${URL}/video-real/${splitLink(
                            currentPlayingVideo?.videoUrl,
                            CHAR
                          )}?key=${KEY}`}
                          type="video/mp4"
                        />
                        <source
                          src={`${
                            currentPlayingVideo?.videoUrl
                          }?seed=${Math.random()}`}
                          type="video/quicktime"
                        />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                      {showClose && (
                        <div className="controls_bottom_real root_flex_row">
                          <button
                            className="prev-modal-real root_flex_row"
                            onClick={handlePrev}
                            disabled={currentVideoIndex === 0}
                          >
                            <CgPlayTrackPrev />
                          </button>
                          <button
                            className="close-modal-real root_flex_row"
                            onClick={() => setOpenModal(false)}
                          >
                            <CgClose />
                          </button>
                          <button
                            className="next-modal-real root_flex_row"
                            onClick={handleNext}
                            disabled={currentVideoIndex === videos?.length - 1}
                          >
                            <CgPlayTrackNext />
                          </button>
                        </div>
                      )}

                      {showControls && (
                        <div className="video-controls-overlay">
                          <div
                            className="controls-overlay-item"
                            style={{ position: "relative" }}
                            onClick={handleRewind}
                          >
                            <button>
                              <ImUndo />
                            </button>
                            <sup className="back-10s">10</sup>
                          </div>
                          <div className="play-pause-controls">
                            <button onClick={handlePlayPause}>
                              {isPlaying ? <ImPause2 /> : <ImPlay3 />}
                            </button>
                          </div>
                          <div
                            className="controls-overlay-item"
                            style={{ position: "relative" }}
                            onClick={handleForward}
                          >
                            <button>
                              <ImRedo />
                            </button>
                            <sup className="next-10s">10</sup>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {showAllVideo && (
          <>
            <div className="item-btn-realistic-small">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageClick(i + 1)}
                  className="button-total-pages"
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
          </>
        )}

        {loading ? (
          <div className="loading-file">
            <PulseLoader color="#657e1f" size={15} />
          </div>
        ) : (
          <div className="realistic-container-item items-video-real">
            {/* Danh sách phát */}
            {showAllVideo && (
              <>
                <div className="playlist_video_realistic">
                  {videos.map((video, index) => (
                    <div
                      className={
                        showContent
                          ? "item-video-realistic show-content"
                          : "item-video-realistic hide-content"
                      }
                      key={video.id}
                      onDoubleClick={() => handleSelectVideo(index)}
                    >
                      <HoverVideo
                        src={`${URL}/video-real/${splitLink(
                          video.videoUrl,
                          CHAR
                        )}?key=${KEY}`}
                        poster={video.thumbUrl}
                        className="fix-content"
                      />
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
    </>
  );
};

export default VideoRealistic;
