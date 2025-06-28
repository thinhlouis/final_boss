import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
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

const HLSMoviePlayer = ({ url, thumb_video }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const timeoutRef = useRef(null);
  const [useNativeHLS, setUseNativeHLS] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [styleControl, setStyleControl] = useState(false);

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

  useEffect(() => {
    // Khi component unmount, dọn dẹp
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setIsMuted(false);

      timeoutRef.current = setTimeout(() => {
        setStyleControl(true);
      }, 5000);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleOntouchStart = () => {
    setStyleControl(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleOntouchEnd = () => {
    timeoutRef.current = setTimeout(() => {
      setStyleControl(true);
    }, 5000);
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

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.webkitEnterFullscreen?.();
    }
    if (videoRef.current.webkitEnterFullscreen) {
      setStyleControl(true);
      setIsPlaying(false);
    }
  };

  return (
    <div className="hls-movie">
      {/* Dùng ReactPlayer cho trình duyệt hỗ trợ tốt */}
      {!useNativeHLS && (
        <ReactPlayer
          ref={videoRef}
          url={url}
          playing={isPlaying}
          muted={isMuted}
          light={thumb_video}
          controls={true}
          width="100%"
          height="100%"
          style={{ margin: "0 auto" }}
          pip={true}
          config={{
            file: {
              forceHLS: true,
              attributes: {
                preload: "auto",
                playsInline: true, // Quan trọng cho iOS để chơi inline trước khi full màn hình
              },
            },
          }}
        />
      )}

      {/* Dùng thẻ <video> native cho Safari/iOS */}
      {useNativeHLS && (
        <video
          ref={videoRef}
          src={url}
          controls={false}
          playsInline={true}
          autoPlay={isPlaying}
          muted={isMuted}
          poster={thumb_video}
          style={{ width: "100%", height: "100%", aspectRatio: "9/16" }}
          onTouchStart={handleOntouchStart}
          onTouchEnd={handleOntouchEnd}
        />
      )}

      <div
        className="custom-control"
        style={styleControl ? { display: "none" } : { display: "block" }}
      >
        <div className="control-center">
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
        <div className="control-bottom">
          <button className="button_muted" onClick={handleMute}>
            {isMuted ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
          </button>
          <button className="button_full-screen" onClick={handleFullscreen}>
            <RiFullscreenFill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HLSMoviePlayer;
