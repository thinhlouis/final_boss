import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import Hls from "hls.js";
import { isIOS, isSafari } from "react-device-detect";

const HLSVideoPlayer = ({ url, playing, onEnded }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [useNativeHLS, setUseNativeHLS] = useState(false);

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
        if (playing) videoRef.current?.play();
      });

      return () => {
        hls.destroy();
      };
    }
  }, [url, useNativeHLS, playing]);

  return (
    <div style={{ width: "100%", height: "auto" }}>
      {/* Dùng ReactPlayer cho trình duyệt hỗ trợ tốt */}
      {!useNativeHLS && (
        <ReactPlayer
          ref={videoRef}
          url={url}
          playing={playing}
          controls
          width="100%"
          height="auto"
          playsinline
          onEnded={onEnded}
          config={{
            file: {
              forceHLS: true,
              hlsOptions: {}, // Tùy chọn HLS.js nếu cần
            },
          }}
        />
      )}

      {/* Dùng thẻ <video> native cho Safari/iOS */}
      {useNativeHLS && (
        <video
          ref={videoRef}
          src={url}
          controls
          playsInline
          autoPlay={playing}
          onEnded={onEnded}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
};

export default HLSVideoPlayer;
