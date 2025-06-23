import "./Home.css";
import gallerys from "../../mock/gallerys";
import settingSlider from "./settingSlider";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);

  const getRandomQuote = (quotes) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      await axios
        .get(`${process.env.REACT_APP_UIR_API_QUOTE}`)
        .then((response) => {
          setQuotes(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchQuotes();
  }, []);

  const updateQuote = useCallback(() => {
    setCurrentQuote(getRandomQuote(quotes));
  }, [quotes]);

  useEffect(() => {
    // Đặt câu quote ban đầu khi component mount
    updateQuote();

    // Thiết lập interval để cập nhật quote mỗi 5 giây
    const intervalId = setInterval(updateQuote, 10000); // 10000 ms = 10 giây

    // Hàm dọn dẹp (cleanup function) của useEffect
    // Sẽ chạy khi component unmount hoặc khi dependencies thay đổi
    return () => {
      clearInterval(intervalId); // Dọn dẹp interval để tránh memory leaks
    };
  }, [updateQuote]);

  return (
    <div className="home-container">
      <div className="image-slider-container">
        <Slider {...settingSlider}>
          {gallerys.map((gallery, index) => (
            <div
              key={index}
              style={{ width: "100%", margin: "0 auto" }}
              className="Numeber"
            >
              <img src={gallery} alt="img" />
            </div>
          ))}
        </Slider>
      </div>
      <div className="quote_container">
        {!currentQuote ? (
          <p className="quote-text">Đang tải quote...</p>
        ) : (
          <q className="quote-text">{currentQuote.quote}</q>
        )}
      </div>
    </div>
  );
}

export default Home;
