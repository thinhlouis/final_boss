import "./Movies.css";
import PaginationControls from "../PaginationControls/PaginationControls";
import MoviesContext from "../../context/MovieContext/MoviesContext";
import logo_movie from "../../assets/logo-movie.png";
import TableMovie from "./TableMovie";
import SelectComponent from "./SelectComponent";
import RenderButtonMovie from "./RenderButtonMovie";
import ScrollContext from "../../context/ScrollContex/ScrollContex";
import AuthContext from "../../context/AuthContext/AuthContext";

import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  RiSearchLine,
  RiMovie2AiLine,
  RiHome4Fill,
  RiCloseFill,
} from "react-icons/ri";
import axios from "axios";
import { throttle } from "lodash";

export default function Movies() {
  const [contries, setCountries] = useState([]);
  const [categorys, setCatagorys] = useState([]);
  const [descriptionMovie, setDescriptionMovie] = useState("");
  const [fetchLoading, setfetchLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [indexMovie, setIndexMovie] = useState(0);
  const [searchValue, setSearchValue] = useState({
    keyword: "",
    category: "",
    country: "",
    year: "",
    lang: "",
  });

  const { keyword, category, country, year, lang } = searchValue;

  const {
    datas,
    loading,
    handlePageClick,
    currentMaxPagesToShow,
    defaultPage,
    totalPages,
    totalItems,
    updateToday,
    searchByDetailMovies,
    debouncedSearch,
    lists,
    setLists,
    isSearching,
    setKeywordRef,
  } = useContext(MoviesContext);

  const { movies, domain_img } = datas;

  const { setModal } = useContext(ScrollContext);
  const {
    auth: { isAuthenticated },
  } = useContext(AuthContext);

  const imageRef = useRef(null);

  const handleSelectedList = useCallback(
    (slug, name) => {
      setLists({
        slug: slug,
        name: name,
      });
      setSearchValue({
        keyword: "",
        category: "",
        country: "",
        year: "",
        lang: "",
      });
      isSearching.current = false; // reset search state
      setKeywordRef("");
      setShowPopup(true);
    },
    [setLists, setKeywordRef, isSearching]
  );

  const handleScroll = throttle(() => {
    // Kiểm tra vị trí cuộn: nếu cuộn xuống quá 100px thì hiển thị nút
    if (!isAuthenticated && window.pageYOffset > 300) {
      setShowPopup(false);
    }
  }, 1000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!showModal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [showModal, setModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (imageRef.current && !imageRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setShowModal]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [countriesResponse, categorysResponse] = await Promise.all([
          axios.get("https://phimapi.com/quoc-gia"),
          axios.get("https://phimapi.com/the-loai"),
        ]);
        setCountries(countriesResponse.data);
        setCatagorys(categorysResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingAll(false);
      }
    };
    fetchAll();
    handleSelectedList("phim-moi-cap-nhat-v3", "MỚI CẬP NHẬT");
  }, [handleSelectedList]);

  const yearList = Array.from({ length: 56 }, (_, i) => {
    const year = new Date().getFullYear();
    return {
      slug: (year - i).toString(),
      name: (year - i).toString(),
    };
  });

  const handleSearchDetailMovies = async () => {
    await searchByDetailMovies(lang, category, country, year);
  };

  const handleSearchAllMovies = async (e) => {
    e.preventDefault();
    const keyword = e.target.value;

    if (!keyword) {
      setSearchValue((prev) => ({ ...prev, keyword: "" }));
      isSearching.current = false;
      setKeywordRef("");
      return;
    }

    setSearchValue((prev) => ({ ...prev, keyword: e.target.value }));

    await debouncedSearch(keyword);
  };

  const handlePreviewPoster = async (index, slug) => {
    try {
      const result = await axios.get(`https://phimapi.com/phim/${slug}`);
      const {
        movie: { content },
      } = result.data;
      setDescriptionMovie(content);
      setIndexMovie(index);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setfetchLoading(false);
    }
  };

  return (
    <div className="movies">
      <div
        className="root_flex_row"
        style={{ justifyContent: "space-between", backgroundColor: "#f5f5f4" }}
      >
        <div className="search-movie-keyword">
          <p title="Tao là trùm cuối">
            <img src={logo_movie} alt="logo-movie" />
          </p>
          <div className="search-box root_flex_row flex_start">
            <button type="button" className="btn-search-movie" disabled>
              <RiSearchLine />
            </button>
            <input
              type="text"
              aria-label="Tìm phim"
              placeholder="Nhập tên phim..."
              value={keyword}
              onChange={handleSearchAllMovies}
            />
          </div>
        </div>
        <RenderButtonMovie onClick={handleSelectedList} />
      </div>
      {!loading && (
        <>
          {lists.slug === "phim-moi-cap-nhat-v3" && (
            <div className="header-category-movie root_flex_row flex_start gap_2">
              <div className="root_flex_column item_start gap_05 item-header-movie">
                <span>Cập nhật hôm nay</span>
                <span className="root_flex_row" style={{ gap: "5px" }}>
                  <b className="root_flex_row gap_025">
                    <RiMovie2AiLine /> {updateToday}
                  </b>
                  <small> (phim)</small>
                </span>
              </div>
              <div className="root_flex_column item_start gap_05 item-header-movie">
                <span>Tổng số phim</span>
                <span className="root_flex_row" style={{ gap: "5px" }}>
                  <b className="root_flex_row gap_025">
                    <RiMovie2AiLine /> {totalItems}
                  </b>
                  <small> (phim)</small>
                </span>
              </div>
            </div>
          )}
          {lists.slug !== "phim-moi-cap-nhat-v3" && (
            <ul className="root_flex_row flex_start gap_05 nav-movie-header">
              <li
                onClick={() =>
                  handleSelectedList("phim-moi-cap-nhat-v3", "MỚI CẬP NHẬT")
                }
              >
                <Link to="." className="root_flex_row gap_025">
                  <RiHome4Fill />
                  trang chủ
                </Link>
              </li>
              <li>
                <Link to=".">{lists.name}</Link>
              </li>
            </ul>
          )}
          {!loadingAll && lists.slug !== "phim-moi-cap-nhat-v3" && (
            <div className="search-movie-selected root_flex_row flex_start gap_1">
              <select
                value={lang}
                onChange={(e) =>
                  setSearchValue((prev) => ({ ...prev, lang: e.target.value }))
                }
              >
                <option value="">Toàn bộ ngôn ngữ</option>
                <option value="vietsub">Phim VietSub</option>
                <option value="thuyet-minh">Phim Thuyết Minh</option>
                <option value="long-tieng">Phim Lồng Tiếng</option>
              </select>

              <SelectComponent
                data={categorys}
                value={category}
                onChange={(e) =>
                  setSearchValue((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                defaultName="Toàn bộ thể loại"
              />
              <SelectComponent
                data={contries}
                value={country}
                onChange={(e) =>
                  setSearchValue((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                defaultName="Toàn bộ quốc gia"
              />
              <SelectComponent
                data={yearList}
                value={year}
                onChange={(e) =>
                  setSearchValue((prev) => ({ ...prev, year: e.target.value }))
                }
                defaultName="Toàn bộ năm"
              />
              <button
                className="btn-search-movie root_flex_row gap_025"
                onClick={handleSearchDetailMovies}
              >
                Tìm kiếm <RiSearchLine />
              </button>
            </div>
          )}

          {movies?.length > 0 ? (
            <>
              <table className="list_movie">
                <thead>
                  <tr>
                    <th className="super-content">TÊN</th>
                    <th className="short-content small">NĂM</th>
                    <th className="medium-content small">TÌNH TRẠNG</th>
                    <th className="long-content medium small">TMDB</th>
                    <th className="medium-content small">ĐỊNH DẠNG</th>
                    <th className="medium-content small">QUỐC GIA</th>
                    <th className="long-content medium small">NGÀY CẬP NHẬT</th>
                  </tr>
                </thead>
                <tbody>
                  <TableMovie
                    movies={movies}
                    url={domain_img}
                    preview={handlePreviewPoster}
                  />
                </tbody>
              </table>
              <div className="footer-movie root_flex_row">
                <div className="footer-update">
                  <p>
                    Trang <b style={{ color: "#75921e" }}>{defaultPage}</b>/
                    <b>{totalPages}</b> | Tổng <b>{totalItems}</b> kết quả
                  </p>
                </div>
                <PaginationControls
                  totalPages={totalPages}
                  currentPage={defaultPage}
                  totalItems={totalItems}
                  onPageChange={handlePageClick}
                  maxPagesToShow={currentMaxPagesToShow}
                />
              </div>
            </>
          ) : (
            <div className="not-item root_flex_column gap_05">
              <div className="content-not-item root_flex_column gap_05">
                <p>Không tìm thấy phim nào trùng khớp với yêu cầu của bạn.</p>
                <p>Vui lòng thử lại với thể loại khác hoặc danh mục khác.</p>
              </div>
            </div>
          )}
        </>
      )}
      {!fetchLoading && showModal && (
        <div id="myModal-movie" className="modal-movie">
          <h2 className="modal-movie-name">{movies[indexMovie]?.name}</h2>
          <div className="modal-movie-poster">
            <p className="modal-movie-content">
              <img
                ref={imageRef}
                src={`https://phimapi.com/image.php?url=${movies[indexMovie]?.poster_url}`}
                srcSet={`https://phimapi.com/image.php?url=${movies[indexMovie]?.poster_url}`}
                loading="lazy"
                decoding="async"
                alt="poster"
              />
            </p>
            <p className="modal-movie-des">
              <span>{descriptionMovie}</span>
            </p>
          </div>
        </div>
      )}
      {!isAuthenticated && showPopup && (
        <div className="popup-warning">
          <div className="warning-box">
            <button
              className="close-popup"
              onClick={() => setShowPopup(false)}
              title="close popup"
            >
              <RiCloseFill />
            </button>
            <div className="popup-content">
              <h1>Bạn chưa login</h1>
              <p>
                Bạn hiền ơi! nếu bạn là <b>VIP</b> thì bạn cần phải{" "}
                <Link to="/sign-in">LOGIN</Link> để xem được các tập phim{" "}
                <b>VIP</b> bạn nhé.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
