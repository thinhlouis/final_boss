import React from "react";

const CurrentWeather = ({ data, getIconUrl }) => {
  const currentDate = new Date(data.dt * 1000);
  const options = { weekday: "long", month: "short", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("vi-VN", options);

  return (
    <div className="current-weather">
      <div className="current-main">
        <div className="date">{formattedDate}</div>
        <img
          src={getIconUrl(data.weather[0].icon)}
          alt="weather icon"
          className="main-icon"
        />
        <div className="temperature">{Math.round(data.main.temp)}°</div>
        <div className="description">{data.weather[0].description}</div>
      </div>
      <div className="weather-details">
        <div className="detail-item">
          <span className="icon">💨</span>
          <span>{data.wind.speed} km/h</span>
          <span className="label">Wind</span>
        </div>
        <div className="detail-item">
          <span className="icon">🌧️</span>
          <span>{data.clouds.all}%</span>{" "}
          {/* OpenWeather doesn't directly provide pop for current, using clouds as an approximation or you can derive from forecast */}
          <span className="label">Chance of rain</span>
        </div>
        <div className="detail-item">
          <span className="icon">🕛</span>
          <span>{data.main.pressure} mbar</span>
          <span className="label">Pressure</span>
        </div>
        <div className="detail-item">
          <span className="icon">💧</span>
          <span>{data.main.humidity}%</span>
          <span className="label">Humidity</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
