import React from "react";

import { Link } from "react-router-dom";

import { RiFlashlightFill, RiTimeFill } from "react-icons/ri";

import formattedDate from "../../utils/formattedDate";

export default function TableMovie({ movies, url, preview }) {
  const renders = movies.map((movie, index) => {
    const {
      _id,
      slug,
      name,
      origin_name,
      poster_url,
      year,
      episode_current,
      tmdb: { type: typetmdb, id },
      type,
      country: [info],
      modified: { time },
    } = movie;

    const thumbnail = url ? `${url}/${poster_url}` : poster_url;
    const today = formattedDate(new Date()).split(" ")[1];

    return (
      <tr key={_id}>
        <td className="info-movie super-content">
          <div className="content-info-movie">
            <span className="poster-movie">
              <img
                srcSet={`https://phimapi.com/image.php?url=${thumbnail}`}
                decoding="async"
                data-nimg="responsive"
                loading="lazy"
                src={`https://phimapi.com/image.php?url=${thumbnail}`}
                alt={name}
                title={name}
                onClick={() => preview(index, slug)}
              />
            </span>
            <span className="name-origin_name">
              <Link to={`/ksc/movies/${slug}`}>{name}</Link>
              <small>({origin_name})</small>
              <div className="root_flex_row gap_05">
                <small className="type-movie-small">
                  {type === "tvshows" && "TV Show"}
                  {type === "series" && "Phim Bộ"}
                  {type === "single" && "Phim Lẻ"}
                  {type === "hoathinh" && "Hoạt Hình"}
                </small>
                <sub
                  className={`root_flex_row ${
                    episode_current?.includes("Hoàn Tất")
                      ? "episode-movie-end"
                      : episode_current === "Full"
                      ? "episode-movie-full"
                      : "episode-movie"
                  }`}
                >
                  {episode_current.includes("Hoàn Tất") ||
                  episode_current === "Full" ? (
                    <RiFlashlightFill />
                  ) : (
                    <RiTimeFill />
                  )}
                  {episode_current}
                </sub>
              </div>
            </span>
          </div>
        </td>
        <td className="small short-content">{year}</td>
        <td className="small medium-content">
          <span
            className={`root_flex_row ${
              episode_current?.includes("Hoàn Tất")
                ? "episode-movie-end"
                : episode_current === "Full"
                ? "episode-movie-full"
                : "episode-movie"
            }`}
          >
            {episode_current.includes("Hoàn Tất") ||
            episode_current === "Full" ? (
              <RiFlashlightFill />
            ) : (
              <RiTimeFill />
            )}
            {episode_current}
          </span>
        </td>
        <td className="tmdb medium small long-content">
          <span>
            <img
              alt="TMDb"
              srcSet="https://kkphim.vip/assets/img/tmdb.svg"
              src="https://kkphim.vip/assets/img/tmdb.svg"
              decoding="async"
              data-nimg="fixed"
              width="22"
            />
            {typetmdb && id ? (
              <a
                href={`https://www.themoviedb.org/${typetmdb}/${id}?language=vi`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {`${typetmdb}-${id}`}
              </a>
            ) : (
              <small>N/A</small>
            )}
          </span>
        </td>
        <td className="small medium-content">
          {type === "tvshows" && "TV Show"}
          {type === "series" && "Phim Bộ"}
          {type === "single" && "Phim Lẻ"}
          {type === "hoathinh" && "Hoạt Hình"}
        </td>
        <td className="small medium-content">{info?.name}</td>
        <td
          className={`medium small long-content ${
            formattedDate(time).includes(today) ? "new-update" : ""
          }`}
        >
          {formattedDate(time)}
        </td>
      </tr>
    );
  });
  return renders;
}
