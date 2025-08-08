import "./Home.css";
import gallerys from "../../mock/gallerys";
import settingSlider from "./settingSlider";
import WeatherCard from "../Weather/WeatherCard";
import Quote from "./component/Quote";
import AuthContext from "../../context/AuthContext/AuthContext";
import quotesAPI from "../../apis/quotesAPI";
import ImageSlider from "./ImageSlider";

import React, { useState, useEffect, useCallback, useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [quotes, setQuotes] = useState({});

  const [avtAuthor, setAvtAuthor] = useState({});
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth, loading: loadingAuth } = useContext(AuthContext);

  const isRoot = auth?.user?.role === "super_root";

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await quotesAPI.quotes();
        const result = response?.data.find((data) => {
          return {
            data: data?.quotes,
            avatar: data?.avatar,
          };
        });

        setQuotes(result?.quotes);
        setAvtAuthor(result?.avatar);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  // const { avatar, quotes } = datas;

  const getRandomQuote = (quote) => {
    if (!quote) return;
    const randomIndex = Math.floor(Math.random() * quote.length);
    return quote[randomIndex];
  };

  const updateQuote = useCallback(() => {
    setCurrentQuote(getRandomQuote(quotes));
  }, [quotes]);

  useEffect(() => {
    // Đặt câu quote ban đầu khi component mount
    updateQuote();

    // Thiết lập interval để cập nhật quote mỗi 5 giây
    const intervalId = setInterval(updateQuote, 15000); // 10000 ms = 10 giây

    // Hàm dọn dẹp (cleanup function) của useEffect
    // Sẽ chạy khi component unmount hoặc khi dependencies thay đổi
    return () => {
      clearInterval(intervalId); // Dọn dẹp interval để tránh memory leaks
    };
  }, [updateQuote]);

  return (
    <div className="home-container">
      {currentQuote && (
        <div className="quote-small">
          <Quote
            quote={currentQuote.text}
            avatar={avtAuthor[currentQuote?.author]}
            author={currentQuote.author}
          />
        </div>
      )}
      {!loadingAuth && isRoot ? (
        <div className="image-slider-container">
          <Slider {...settingSlider}>
            {gallerys.map((gallery, index) => (
              <div
                key={index}
                style={{ width: "100%", margin: "0 auto" }}
                className="Numeber"
              >
                <img src={gallery} alt="img" loading="eager" />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="container-hero">
          <ImageSlider />
          <div className="content-hero">
            <h1>Khi tất cả đã nhạt phai!</h1>
            <p>
              Dù ai đúng ai sai, thì người sai chắc chắn là người không đúng.
            </p>
            <small>copyright © by Trùm Cuối ✌🏻</small>
          </div>
        </div>
      )}

      {!loading && currentQuote && (
        <div className="quote-full">
          <Quote
            quote={currentQuote.text}
            avatar={avtAuthor[currentQuote?.author]}
            author={currentQuote.author}
          />
        </div>
      )}
      <WeatherCard />
    </div>
  );
}

export default Home;
