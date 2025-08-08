import React, { useState, useEffect, useRef } from "react";

import Hls from "hls.js";
import { isIOS, isSafari } from "react-device-detect";
import {
  RiReplay10Fill,
  RiForward10Fill,
  RiPlayLargeFill,
  RiFullscreenFill,
  RiVolumeMuteFill,
  RiVolumeUpFill,
} from "react-icons/ri";
import { FaPause } from "react-icons/fa6";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

const HLSMoviePlayer = ({ url, poster }) => {
  const videoRef = useRef(null);
  const videoMobileRef = useRef(null);
  const hlsRef = useRef(null);

  const [useNativeHLS, setUseNativeHLS] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Kiểm tra trình duyệt có hỗ trợ HLS native không (Safari/iOS)
  useEffect(() => {
    const video = document.createElement("video");
    const canPlayNativeHLS = video.canPlayType("application/vnd.apple.mpegurl");
    setUseNativeHLS(isIOS || isSafari || !!canPlayNativeHLS);
  }, []);

  // Xử lý HLS.js nếu không dùng native HLS
  useEffect(() => {
    if (!useNativeHLS && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play();
      });

      return () => {
        hls.destroy();
      };
    }
  }, [url, useNativeHLS]);

  const handlePlayPause = () => {
    if (videoMobileRef.current) {
      if (isPlaying) {
        // Nếu đang play, thì pause
        videoMobileRef.current.pause();
      } else {
        // Nếu đang pause, thì play
        videoMobileRef.current.play();
        setIsMuted(false);
      }
      setIsPlaying(!isPlaying); // Cập nhật state
    }
  };

  const handleMute = () => {
    if (videoMobileRef.current) {
      videoMobileRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoMobileRef.current) {
      videoMobileRef.current.webkitEnterFullscreen?.();
    }
    if (videoMobileRef.current.webkitEnterFullscreen) {
      setIsPlaying(false);
    }
  };

  const handleRewind = () => {
    if (videoMobileRef.current) {
      videoMobileRef.current.currentTime -= 10; // Tua lùi 10 giây
    }
  };

  const handleForward = () => {
    if (videoMobileRef.current) {
      videoMobileRef.current.currentTime += 10; // Tua tiến 10 giây
    }
  };

  return (
    <div className="hls-movie root_flex_row">
      {/* Dùng ReactPlayer cho trình duyệt hỗ trợ tốt */}
      {!useNativeHLS && (
        <MediaController
          style={{
            position: "fixed",
            width: "100%",
            height: "100vh",
            aspectRatio: "16/9",
          }}
        >
          <video // <-- Sử dụng thẻ <video> HTML gốc ở đây
            slot="media" // <-- Quan trọng: Gắn slot "media"
            ref={videoRef}
            src={url} // Nguồn sẽ được Hls.js quản lý
            playsInline={false}
            muted={isMuted} // Trạng thái mute ban đầu
            poster={poster}
            controls={false}
            // Không dùng autoplay ở đây để MediaController quản lý
            // onPlay, onPause, onVolumeChange, ... để đồng bộ state nếu cần
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(e) => setIsMuted(e.target.muted)}
            style={{ margin: "0 auto", "--controls": "none" }}
          />
          <MediaControlBar>
            <MediaPlayButton style={{ padding: "0 5px" }} />
            <MediaSeekBackwardButton
              seekOffset={10}
              style={{ padding: "0 5px" }}
            />
            <MediaSeekForwardButton
              seekOffset={10}
              style={{ padding: "0 5px" }}
            />
            <MediaTimeRange style={{ padding: "0 5px" }} />
            <MediaTimeDisplay showDuration style={{ padding: "0 5px" }} />
            <MediaMuteButton style={{ padding: "0 5px" }} />
            <MediaVolumeRange style={{ padding: "0 5px" }} />
            <MediaPlaybackRateButton style={{ padding: "0 5px" }} />
            <MediaFullscreenButton style={{ padding: "0 5px" }} />
          </MediaControlBar>
        </MediaController>
      )}

      {/* Dùng thẻ <video> native cho Safari/iOS */}
      {useNativeHLS && (
        <div className="video-native-box">
          <video
            ref={videoMobileRef}
            controls={false}
            playsInline={true}
            autoPlay={isPlaying}
            muted={isMuted}
            poster={poster}
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: "16/9",
              objectFit: "contain",
            }}
          >
            <source src={url} type="application/vnd.apple.mpegurl" />
          </video>
          <>
            <div className="custom-control">
              <button className="button_replay" onClick={handleRewind}>
                <RiReplay10Fill />
              </button>
              <button className="button_play-pause" onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <RiPlayLargeFill />}
              </button>
              <button className="button_forward" onClick={handleForward}>
                <RiForward10Fill />
              </button>
            </div>
            <div className="custom-control-end root_flex_row">
              <button className="button_forward" onClick={handleMute}>
                {isMuted ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
              </button>

              <button className="button_forward" onClick={handleFullscreen}>
                <RiFullscreenFill />
              </button>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default HLSMoviePlayer;
