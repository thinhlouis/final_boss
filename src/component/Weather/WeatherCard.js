import "./Weather.css";
import CurrentWeather from "./CurrentWeather";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import PollutionAir from "./PollutionAir";

import CITIES from "../../mock/citys";

import React, { useState, useEffect } from "react";

const API_KEY = "b65904355fca4c1d91119dd6f36aed85"; // Thay thế bằng API Key của bạn

function WeatherCard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityID, setCityID] = useState(1587923);
  const [cityLon, setCityLon] = useState(106.816673);
  const [cityLat, setCityLat] = useState(10.95);

  useEffect(() => {
    const findCity = CITIES.find((city) => city.id === Number(cityID));

    if (findCity) return;
    setCityLat(findCity?.lat);
    setCityLon(findCity?.lon);
  }, [cityID]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Lấy dữ liệu thời tiết hiện tại và dự báo 5 ngày / 3 giờ
        const currentWeatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${API_KEY}&units=metric&lang=vi`
        );
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${API_KEY}&units=metric&lang=vi`
        );
        const pollutionResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric&lang=vi`
        );

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
          throw new Error("Không thể tải dữ liệu thời tiết.");
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();
        const pollutionData = await pollutionResponse.json();

        // Xử lý dữ liệu để phù hợp với giao diện
        const processedHourlyData = forecastData.list
          .slice(0, 4)
          .map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: Math.round(item.main.temp),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          }));

        // Lấy dự báo hàng ngày (mỗi ngày một mục)
        const dailyForecasts = {};
        forecastData.list.forEach((item) => {
          const dayKey = new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          });

          if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = {
              day: dayKey,
              minTemp: item.main.temp_min,
              maxTemp: item.main.temp_max,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              chanceOfRain: item.pop * 100, // Precipitation probability
            };
          } else {
            dailyForecasts[dayKey].minTemp = Math.min(
              dailyForecasts[dayKey].minTemp,
              item.main.temp_min
            );
            dailyForecasts[dayKey].maxTemp = Math.max(
              dailyForecasts[dayKey].maxTemp,
              item.main.temp_max
            );
            dailyForecasts[dayKey].description = item.weather[0].description; // Có thể chọn mô tả của thời điểm chính trong ngày
            dailyForecasts[dayKey].icon = item.weather[0].icon;
            dailyForecasts[dayKey].chanceOfRain = Math.max(
              dailyForecasts[dayKey].chanceOfRain,
              item.pop * 100
            );
          }
        });

        const processedDailyData = Object.values(dailyForecasts).slice(0, 7); // Lấy 7 ngày

        setWeatherData({
          current: currentWeatherData,
          pollution: pollutionData,
          hourly: processedHourlyData,
          daily: processedDailyData,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cityID, cityLat, cityLon]);

  if (loading) {
    return (
      <div className="weather-app-container">Đang tải dữ liệu thời tiết...</div>
    );
  }

  if (error) {
    return <div className="weather-app-container error">Lỗi: {error}</div>;
  }

  if (!weatherData) {
    return null; // Hoặc hiển thị thông báo rỗng
  }

  // Hàm để chuyển đổi mã icon thành URL
  const getIconUrl = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <>
      <div className="weather-app-container">
        <div className="weather-card">
          <div className="weather-content content-left">
            <div className="header-weather header-small">
              <p>Select City</p>
              <select
                value={cityID}
                onChange={(e) => setCityID(e.target.value)}
              >
                {CITIES.map((city, index) => (
                  <option key={index} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <CurrentWeather
              data={weatherData.current}
              getIconUrl={getIconUrl}
            />
            <HourlyForecast data={weatherData.hourly} getIconUrl={getIconUrl} />
          </div>
          <div className="weather-content content-right">
            <div className="header-weather header-full">
              <p>Select City</p>
              <select
                value={cityID}
                onChange={(e) => setCityID(e.target.value)}
              >
                {CITIES.map((city, index) => (
                  <option key={index} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <PollutionAir data={weatherData.pollution} />
            <DailyForecast data={weatherData.daily} getIconUrl={getIconUrl} />
          </div>
        </div>
      </div>
    </>
  );
}

export default WeatherCard;
