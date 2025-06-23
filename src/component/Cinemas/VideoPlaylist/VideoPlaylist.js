import React, { useState, useContext, useEffect } from "react";

import "./VideoPlaylist.css";
import HLSVideoPlayer from "./HLSVideoPlayer";
import hot from "../../../assets/hot-icon.png";
import videoAPI from "../../../apis/videoAPI";

import AuthContext from "../../../context/AuthContext";

const KEY = process.env.REACT_APP_API_KEY;

const VideoPlaylistStream = () => {
  const [allVideosByPage, setAllVideosByPage] = useState({});
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const limit = 20;

  const { auth } = useContext(AuthContext);
  const { user } = auth;

  // useEffect(() => {
  //   const role = user.role;
  //   const fetchVideos = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await videoAPI.videos(KEY, defaultPage, limit);

  //       const { currentPage, totalPages, videos } = response.data;

  //       if (role !== "super_root") return;
  //       setVideos(videos);
  //       setDefaultPage(currentPage);
  //       setTotalPages(totalPages);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchVideos();
  // }, [user.role, defaultPage]);

  useEffect(() => {
    const role = user.role;
    const fetchVideos = async () => {
      if (allVideosByPage[defaultPage]) {
        // Kiểm tra nếu đã có dữ liệu cho trang này
        setVideos(allVideosByPage[defaultPage]);
        return;
      }

      if (role !== "super_root") return;

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
  }, [user.role, defaultPage, allVideosByPage, currentPlayingVideo]); // Thêm allVideosByPage vào dependency array

  const scrollToTop = () => {
    window.scrollTo({
      top: 100,
      behavior: "smooth", // Để cuộn mượt mà
    });
  };

  const scrollToTopFixid = () => {
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

  // const handleNext = () => {
  //   if (currentVideoIndex < hlsLinks.length - 1) {
  //     setCurrentVideoIndex(currentVideoIndex + 1);
  //     setPlaying(true);
  //   }
  // };

  // const handlePrev = () => {
  //   if (currentVideoIndex > 0) {
  //     setCurrentVideoIndex(currentVideoIndex - 1);
  //     setPlaying(true);
  //   }
  // };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      // Kiểm tra trong danh sách videos của trang hiện tại
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setCurrentPlayingVideo(videos[nextIndex]); // Cập nhật video đang phát
      setPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      // Kiểm tra trong danh sách videos của trang hiện tại
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setCurrentPlayingVideo(videos[prevIndex]); // Cập nhật video đang phát
      setPlaying(true);
    }
  };

  const handleSelectVideo = (index) => {
    setCurrentPlayingVideo(videos[index]);
    // Đảm bảo rằng video được chọn là từ danh sách hiện tại của trang
    setCurrentVideoIndex(index);
    setPlaying(true);
    scrollToTop();
  };

  const handlePageClick = (page) => {
    if (page !== defaultPage) {
      setDefaultPage(page);
    }
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
            url={currentPlayingVideo.url}
            playing={playing}
            onEnded={handleNext}
          />
          <h3>{currentPlayingVideo.name}</h3>
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
          disabled={currentVideoIndex === videos?.length - 1}
          style={{ padding: "8px 16px" }}
          className="btn-next"
        >
          Next
        </button>
      </div>
      {userInteracted && (
        <div
          style={{
            marginTop: "20px",
            paddingTop: "10px",
            borderTop: "2px solid #c1c1c1",
          }}
          className="page_mobile"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageClick(i + 1)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                backgroundColor: i + 1 === defaultPage ? "#657e1f" : "#ccc",
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
      )}

      {/* Danh sách video */}

      {loading ? (
        <div className="container_list">
          <p>Đang tải videos...</p>
        </div>
      ) : (
        userInteracted && (
          <div className="container_list">
            {videos?.map((video, index) => (
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
        )
      )}
      {userInteracted && (
        <div
          style={{
            marginTop: "20px",
            paddingTop: "10px",
            borderTop: "2px solid #c1c1c1",
          }}
          className="page_full"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageClick(i + 1)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                backgroundColor: i + 1 === defaultPage ? "#657e1f" : "#ccc",
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
      )}

      {isVisible && (
        <button className="scroll-to-top-button" onClick={scrollToTopFixid}>
          ↑
        </button>
      )}
    </div>
  );
};

export default VideoPlaylistStream;
