import "./PlayMovie.css";
import HLSMoviePlayer from "./HLSMoviePlayer";
import not_found from "../../assets/video-not-found.png";
import thumb_video from "../../assets/thum-video-full.jpg";

import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FadeLoader } from "react-spinners";

export default function PlayMovie() {
  const [urlMovie, setUrlMovie] = useState("");
  const [notification, setNotification] = useState(null);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [thumbnail, setThumbnail] = useState(thumb_video);

  const { slug_name, slug_eps } = useParams();

  useEffect(() => {
    const channel = new BroadcastChannel("player-channel");

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Gửi tín hiệu cho các tab khác
        channel.postMessage("PLAYER_CLOSED");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      channel.close();
    };
  }, []);

  useEffect(() => {
    const fetchCurrentMovie = async () => {
      try {
        const response = await axios.get(
          `https://phimapi.com/phim/${slug_name}`
        );
        if (!response) {
        }
        const serverData = response.data.episodes[0]?.server_data;
        const thumb_url = response.data?.movie?.thumb_url;
        const url = serverData.find((item) => item.slug === slug_eps);

        if (!url) {
          setNotification(
            "Không tìm thấy tập phim hoặc đã có lỗi xãy ra, vui lòng thử lại sau!"
          );
          return;
        }

        setUrlMovie(url.link_m3u8);
        setThumbnail(thumb_url);
      } catch (error) {
        console.error(error);
        setNotification(error);
      } finally {
        setLoadingCurrent(false);
      }
    };
    fetchCurrentMovie();
  }, [slug_eps, slug_name]);

  return (
    <div className="playing-movie">
      {loadingCurrent ? (
        <div className="playing-movie-loading_current">
          <FadeLoader color="#ef4444" />
          <p style={{ marginBottom: "10px", color: "#ef4444" }}>
            Đang tải đợi xíu...
          </p>
        </div>
      ) : (
        <>
          {notification ? (
            <div>
              <p style={{ color: "#F81101" }}>{notification}</p>
              <img src={not_found} alt="video-not-fond" />
            </div>
          ) : (
            <div className="player-movie">
              {<HLSMoviePlayer url={urlMovie} thumb_video={thumbnail} />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
