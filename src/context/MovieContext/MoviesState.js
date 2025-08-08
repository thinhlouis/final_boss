import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import axios from "axios";

import MoviesContext from "./MoviesContext";
import useDebounce from "../../utils/useDebounce";

const MoviesState = ({ children }) => {
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [updateToday, setUpdateToday] = useState(0);
  const [currentMaxPagesToShow, setCurrentMaxPagesToShow] = useState(5);
  const [lists, setLists] = useState({
    slug: "phim-moi-cap-nhat-v3",
    name: "MỚI CẬP NHẬT",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datas, setDatas] = useState({
    allMovieByPage: {},
    movies: [],
    domain_img: "",
  });

  const [keywordRef, setKeywordRef] = useState("");
  const filtersRef = useRef({ lang: "", category: "", country: "", year: "" });
  const isSearching = useRef(false);

  const limit = 20;

  const uri = process.env.REACT_APP_UIR_KPHIM_API;
  const uri_new = "https://phimapi.com/danh-sach";
  const uri_search = "https://phimapi.com/v1/api/tim-kiem";

  const scrollToTop = () => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const fetchUpdateToday = useCallback(async () => {
    try {
      const response = await axios.get(
        `${uri_new}/${lists.slug}?limit=${limit}&page=${defaultPage}`
      );

      const {
        data: {
          items,
          pagination: { currentPage, totalPages, totalItems, updateToday },
        },
      } = response;

      setDatas({ movies: items, domain_img: null });
      setDefaultPage(currentPage);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
      setUpdateToday(updateToday);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [defaultPage, lists.slug]);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(
        `${uri}/${lists.slug}?limit=${limit}&page=${defaultPage}`
      );

      const {
        data: {
          data: {
            items,
            APP_DOMAIN_CDN_IMAGE,
            params: {
              pagination: { currentPage, totalPages, totalItems },
            },
          },
        },
      } = response;

      setDatas({ movies: items, domain_img: APP_DOMAIN_CDN_IMAGE });
      setDefaultPage(currentPage);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [defaultPage, lists.slug, uri]);

  const searchAllMovies = async (keyword, page = 1) => {
    try {
      isSearching.current = true;
      setKeywordRef(keyword);

      const response = await axios.get(
        `${uri_search}?keyword=${keyword}&page=${page}&limit=${limit}`
      );

      const {
        data: {
          data: {
            items,
            APP_DOMAIN_CDN_IMAGE,
            params: {
              pagination: { currentPage, totalPages, totalItems },
            },
          },
        },
      } = response;

      setDatas({ movies: items, domain_img: APP_DOMAIN_CDN_IMAGE });
      setDefaultPage(currentPage);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
    } catch (error) {
      setError(error?.response?.data?.msg || "Lỗi tìm kiếm phim");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce((keyword) => {
    setDefaultPage(1);
    searchAllMovies(keyword, 1);
  }, 1000);

  const searchByDetailMovies = useCallback(
    async (lang, category, country, year, page = 1) => {
      if (lists.slug === "phim-moi-cap-nhat-v3") return;
      try {
        isSearching.current = true;
        filtersRef.current = { lang, category, country, year };

        const response = await axios.get(
          `${uri}/${lists.slug}?page=${page}&sort_lang=${lang}&category=${category}&country=${country}&year=${year}&limit=${limit}`
        );

        const {
          data: {
            data: {
              items,
              APP_DOMAIN_CDN_IMAGE,
              params: {
                pagination: { currentPage, totalPages, totalItems },
              },
            },
          },
        } = response;

        setDatas({ movies: items, domain_img: APP_DOMAIN_CDN_IMAGE });
        setDefaultPage(currentPage);
        setTotalPages(totalPages);
        setTotalItems(totalItems);
      } catch (error) {
        setError(error?.response?.data?.msg || "Lỗi tìm kiếm chi tiết phim");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [lists.slug, uri]
  );

  const handlePageClick = useCallback(
    (page) => {
      if (page !== defaultPage) {
        setDefaultPage(page);
      }
      if (page >= 5) {
        setCurrentMaxPagesToShow(9);
      } else {
        setCurrentMaxPagesToShow(5);
      }
      scrollToTop();
    },
    [defaultPage]
  );

  useEffect(() => {
    if (isSearching.current) {
      if (keywordRef) {
        searchAllMovies(keywordRef, defaultPage);
      } else {
        const { lang, category, country, year } = filtersRef.current;
        searchByDetailMovies(lang, category, country, year, defaultPage);
      }
    } else if (lists.slug === "phim-moi-cap-nhat-v3") {
      fetchUpdateToday();
    } else {
      fetchMovies();
    }
  }, [
    defaultPage,
    lists.slug,
    fetchMovies,
    fetchUpdateToday,
    searchByDetailMovies,
    keywordRef,
  ]);

  const contextValue = useMemo(
    () => ({
      datas,
      defaultPage,
      totalPages,
      totalItems,
      updateToday,
      handlePageClick,
      currentMaxPagesToShow,
      loading,
      debouncedSearch,
      searchByDetailMovies: (lang, category, country, year) => {
        setDefaultPage(1);
        searchByDetailMovies(lang, category, country, year, 1);
      },
      lists,
      setLists,
      error,
      isSearching,
      setKeywordRef,
    }),
    [
      datas,
      defaultPage,
      totalPages,
      totalItems,
      updateToday,
      handlePageClick,
      currentMaxPagesToShow,
      searchByDetailMovies,
      loading,
      debouncedSearch,
      lists,
      setLists,
      error,
    ]
  );

  return (
    <MoviesContext.Provider value={contextValue}>
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesState;
