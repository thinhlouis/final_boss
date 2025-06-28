import React from "react";

const DailyForecast = ({ data, getIconUrl }) => {
  return (
    <div className="daily-forecast">
      <h3>Dự báo 7 ngày</h3>
      <div className="daily-list">
        {data.map((item, index) => (
          <div key={index} className="daily-item">
            <span className="day">{item.day}</span>
            <img
              src={getIconUrl(item.icon)}
              alt="daily icon"
              className="daily-icon"
            />
            <span className="daily-description">{item.description}</span>
            <span className="daily-temp">
              {Math.round(item.minTemp)}°/{Math.round(item.maxTemp)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
