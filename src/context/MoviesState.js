import { useState, useEffect, useCallback, useMemo } from "react";

import axios from "axios";

import MoviesContext from "./MoviesContext";

const MoviesState = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 20;

  const uri = process.env.REACT_APP_UIR_KPHIM_API;
  const uri_search = process.env.REACT_APP_UIR_SEARCH_KPHIM_API;

  const scrollToTop = () => {
    window.scrollTo({
      top: 100,
      behavior: "smooth", // Để cuộn mượt mà
    });
  };

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(
        `${uri}?limit=${limit}&page=${currentPage}`
      );

      setMovies(response?.data?.data?.items);
      setCurrentPage(response?.data?.data?.params?.pagination?.currentPage);
      setTotalPages(response?.data?.data?.params?.pagination?.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, uri]);

  const searchMovies = useCallback(
    async (values) => {
      try {
        const response = await axios.get(
          `${uri_search}?limit=${limit}&page=${currentPage}&keyword=${values}`
        );

        setMovies(response?.data?.data?.items);
        setCurrentPage(response?.data?.data?.params?.pagination?.currentPage);
        setTotalPages(response?.data?.data?.params?.pagination?.totalPages);
      } catch (error) {
        setError(error.data.msg);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, uri_search]
  );
  // function debounce
  const debounceSearchMovie = useCallback((callback, delay) => {
    let timeout;
    return (searchValue) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback(searchValue);
      }, delay);
    };
  }, []);

  const handleResultDebounce = debounceSearchMovie(searchMovies, 3000);

  const handlePageClick = useCallback(
    (page) => {
      if (page !== currentPage) {
        setCurrentPage(page);
      }
      scrollToTop();
    },
    [currentPage]
  );

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const contextValue = useMemo(
    () => ({
      movies,
      currentPage,
      totalPages,
      handlePageClick,
      loading,
      searchMovies,
      error,
      handleResultDebounce,
    }),
    [
      movies,
      currentPage,
      totalPages,
      handlePageClick,
      loading,
      searchMovies,
      error,
      handleResultDebounce,
    ]
  );

  return (
    <MoviesContext.Provider value={contextValue}>
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesState;
