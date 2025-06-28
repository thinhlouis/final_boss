import "./Movies.css";
import MoviesContext from "../../context/MoviesContext";
import formattedDate from "../../utils/formattedDate";

import React from "react";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Movies() {
  const [selectCountry, setSelectCountry] = useState("");
  const [countrys, setCountrys] = useState([]);

  const {
    movies,
    currentPage,
    totalPages,
    loading,
    handlePageClick,
    searchMovies,
  } = useContext(MoviesContext);

  const today = formattedDate(new Date()).split(" ");

  useEffect(() => {
    //trả về mảng country duy nhất
    const uniqueItems = movies.reduce((acc, item) => {
      if (!acc.some((i) => i.country[0].slug === item.country[0].slug)) {
        acc.push(item);
      }
      return acc;
    }, []);

    setCountrys(uniqueItems);
  }, [movies]);

  return (
    <div className="movies">
      <div className="search-movie">
        <p className="search">Find movies by country</p>
        <select
          value={selectCountry}
          onChange={(e) => setSelectCountry(e.target.value)}
        >
          <option value="">Tất cả quốc gia</option>
          {countrys.map((m) => (
            <option key={m._id} value={m.country[0].slug}>
              {m.country[0].name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => searchMovies(selectCountry)}
          className="btn-search-movie"
        >
          Search Movie
        </button>
      </div>
      {!loading && (
        <>
          <table className="list_movie">
            <thead>
              <tr>
                <th>TÊN</th>
                <th className="small">NĂM</th>
                <th className="small">TÌNH TRẠNG</th>
                <th className="small">TMDB</th>
                <th className="small">ĐỊNH DẠNG</th>
                <th className="small">QUỐC GIA</th>
                <th className="small">NGÀY CẬP NHẬT</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m._id}>
                  <td className="info-movie">
                    <span className="poster-movie">
                      <img
                        src={`https://phimimg.com/${m?.thumb_url}`}
                        alt={m.name}
                        style={{ width: "50px" }}
                      ></img>
                    </span>
                    <span className="name-origin_name">
                      <Link to={`/movies/${m.slug}`}>{m.name}</Link>
                      <sub>({m.origin_name})</sub>
                    </span>
                  </td>
                  <td className="small">{m.year}</td>
                  <td className="small">
                    <span className="episode-movie">{m.episode_current}</span>
                  </td>
                  <td className="tmdb small">{`${m.tmdb.type}-${m.tmdb.id}`}</td>
                  <td className="small">{m.type === "tvshows" && "TV Show"}</td>
                  <td className="small">{m.country[0].name}</td>
                  <td
                    className="small"
                    style={
                      formattedDate(m.modified.time).includes(today[0])
                        ? { color: "#dc3545" }
                        : {}
                    }
                  >
                    {formattedDate(m.modified.time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="control-button">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                className="button-page"
                key={i + 1}
                onClick={() => handlePageClick(i + 1)}
                style={{
                  backgroundColor: i + 1 === currentPage ? "#657e1f" : "#ccc",
                  color: i + 1 === currentPage ? "#fff" : "#000",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
