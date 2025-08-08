import "./Cinemas.css";
import formatDurationVideo from "../../utils/formatDurationVideo";
import { useActive } from "../../hook/useActive";

import { useCallback, useRef, useState } from "react";
import { RiForward10Fill, RiReplay10Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";

function HoverVideo({ className, src, poster, name, tag }) {
  const [showControls, setShowControls] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(false);
  const videoRef = useRef(null);

  // ✅ Hover preview logic
  const onMouseEnter = useCallback(async () => {
    const videoRefObject = videoRef.current;
    if (!videoRefObject) return;

    setShowControls(true);

    clearTimeout(videoRefObject._playTimeoutId);
    clearTimeout(videoRefObject._pauseTimeoutId);

    videoRefObject._playTimeoutId = setTimeout(async () => {
      if (!videoRefObject._isTryingToPlay && videoRefObject.paused) {
        videoRefObject._isTryingToPlay = true;

        const canPlayPromise = new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            videoRefObject.removeEventListener("canplay", handleCanPlay);
            videoRefObject.removeEventListener("error", handleError); // Xóa cả trình lắng nghe lỗi
            resolve();
          };
          const handleError = (e) => {
            videoRefObject.removeEventListener("canplay", handleCanPlay);
            videoRefObject.removeEventListener("error", handleError);
            reject(new Error(`Lỗi tải video: ${e.message}`));
          };

          videoRefObject.addEventListener("canplay", handleCanPlay);
          videoRefObject.addEventListener("error", handleError); // Lắng nghe lỗi trong quá trình tải

          // Nếu video đã ở trạng thái canplay (ví dụ: đã hover qua trước đó)
          if (videoRefObject.readyState >= 3) {
            // HTMLMediaElement.HAVE_FUTURE_DATA
            handleCanPlay();
          }
        });
        try {
          await canPlayPromise;
          await videoRefObject.play();
        } catch (err) {
          console.warn(`Lỗi khi phát video trên hover:`, err);
        } finally {
          videoRefObject._isTryingToPlay = false;
        }
      }
    }, 800);
  }, []);

  const onMouseLeave = useCallback(() => {
    const videoRefObject = videoRef.current;
    if (!videoRefObject) return;

    setShowControls(false);

    clearTimeout(videoRefObject._playTimeoutId);
    clearTimeout(videoRefObject._pauseTimeoutId);

    videoRefObject._pauseTimeoutId = setTimeout(() => {
      if (!videoRefObject.paused) {
        videoRefObject.pause();
      }
      videoRefObject.currentTime = 1;
    }, 500); // Cho nó dừng nhẹ, không quá đột ngột
  }, []);

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

  const handleVideoLoad = useCallback(() => {
    setLoadedVideos(true);
  }, []);

  useActive(2000, () => setShowControls(false));

  return (
    <div
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={() => setShowControls(true)}
      onTouchStart={onMouseEnter}
      onTouchEnd={onMouseLeave}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        poster={poster}
        onLoadedMetadata={handleVideoLoad}
        className={loadedVideos ? "opacity-100" : "opacity-0"}
      >
        <source src={src} type="video/mp4" />
      </video>
      {loadedVideos && (
        <div className="box-name-duration">
          {name && <p className="name-video-vip">{name}</p>}

          <span className="jav-duration duration-video">
            {formatDurationVideo(videoRef?.current?.duration)}
          </span>
        </div>
      )}

      {loadedVideos && showControls && (
        <div className="controls-forward-backward root_flex_row">
          <button
            type="button"
            className="root_flex_row"
            onClick={handleRewind}
          >
            <RiReplay10Fill />
          </button>
          <button
            type="button"
            className="root_flex_row"
            onClick={handleForward}
          >
            <RiForward10Fill />
          </button>
        </div>
      )}

      {tag && tag === "hot" && (
        <span className="hot-label">
          <small>H</small>
          <small>O</small>
          <small>T</small>
        </span>
      )}
      {!loadedVideos && (
        <div className="box-loader root_flex_column">
          <p>
            <ClipLoader color="#1f290a" />
          </p>
          <small className="text_loading">Đang tải video...</small>
        </div>
      )}
    </div>
  );
}

export default HoverVideo;
