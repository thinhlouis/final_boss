import "./MovieDetail.css";
import MoviesContext from "../../context/MovieContext/MoviesContext";
import CustomDetails from "./CustomDetails/CustomDetails";
import video_not_found from "../../assets/video-not-found.png";

import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import axios from "axios";
import { BarLoader } from "react-spinners";

export default function MovieDetail() {
  const [movie, setMovie] = useState({});
  const [episodes, setEpisodes] = useState({});
  const [notification, setNotification] = useState(null);
  const [category, setCatagory] = useState([]);
  const [actor, setActor] = useState("");
  const [loading, setLoading] = useState(true);

  const { movies } = useContext(MoviesContext);
  const { slug_movie } = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://phimapi.com/phim/${slug_movie}`
        );

        if (!response.data.status) {
          setNotification(response.data.msg);
          return;
        }
        const isMovie = response.data.movie;
        const isEpisodes = response.data.episodes[0];
        const actor = isMovie?.actor.join(", ") || "Chưa cập nhật";
        const categorys = isMovie?.category.map((c) => c.name);

        setMovie(isMovie);
        setEpisodes(isEpisodes);
        setActor(actor);
        setCatagory(categorys);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movies, slug_movie]);

  const openPlayer = (params, name, eps) => {
    const url = window.location.origin;
    window.open(
      `${url}/player/${name}/${eps}`,
      "_blank",
      "noopener,noreferrer"
    );
    localStorage.setItem("url", params);
  };

  const {
    slug,
    origin_name,
    name,
    episode_current,
    episode_total,
    time,
    year,
    quality,
    lang,
    director,
    country,
    poster_url,
    content,
  } = movie;

  const { server_name, server_data } = episodes;

  return (
    <div className="movie-detail-container">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "5px",
            height: "50vh",
          }}
        >
          <p>Đang loading movie...</p>
          <BarLoader color="#657e1f" height={5} width={150} />
        </div>
      ) : (
        <>
          {notification ? (
            <div>
              <p style={{ color: "#F81101", marginBottom: "1rem" }}>
                {notification} <Link to="/movies">Quay lại</Link>
              </p>

              <img
                src={video_not_found}
                alt="movie-not-found"
                style={{ width: "500px" }}
              />
            </div>
          ) : (
            <div>
              <nav className="nav-header-movie">
                <ul>
                  <li className="home">
                    <Link to="/movies" title="Back movies page">
                      <AiFillHome />
                    </Link>
                  </li>
                  <li className="link-movie">
                    <Link to="#" title={slug}>
                      {name}
                      <span> - {origin_name}</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="movie-detail-box">
                <div className="movie-detail-box_item item-border">
                  <div className="movie-box-item-img">
                    <img src={poster_url} alt={slug} />
                  </div>
                  <div className="movie-box-item-detail">
                    <h2 className="header-movie">
                      <p className="header-movie-name">{name}</p>
                      <p className="header-movie-origin-name">{origin_name}</p>
                    </h2>
                    <p className="detail-of-movie">
                      <span className="span-detail">Tình trạng</span>
                      <span className="span-info">{episode_current}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Số tập</span>
                      <span className="span-info">{episode_total}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Thời lượng</span>
                      <span className="span-info">{time}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Năm phát hành </span>
                      <span className="span-info">{year}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Chất lượng</span>
                      <span className="span-info">{quality}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Ngôn ngữ</span>
                      <span className="span-info">{lang}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Đạo diễn</span>
                      <span className="span-info">{director[0]}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Diễn viên</span>
                      <span className="span-info">{actor}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Thể loại</span>
                      <span className="span-info">{category.join(",")}</span>
                    </p>
                    <p className="detail-of-movie">
                      <span className="span-detail">Quốc gia</span>
                      <span className="span-info">{country[0]?.name}</span>
                    </p>
                  </div>
                </div>
                <div className="movie-detail-box_item">
                  <CustomDetails title="Nội dung Movie">
                    <p>{content}</p>
                  </CustomDetails>
                </div>
                <div className="movie-detail-box_item">
                  <CustomDetails title="Xem Movie">
                    {episodes && (
                      <>
                        <div className="title-name-sever">
                          <span>SERVER:</span>
                          <span style={{ color: "#ff5d09" }}>
                            {server_name}
                          </span>
                        </div>
                        <div className="item-episode">
                          {server_data.map((ep, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                openPlayer(ep.link_m3u8, slug, ep.slug)
                              }
                              title={`Xem ${ep.name}`}
                            >
                              {ep.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </CustomDetails>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
