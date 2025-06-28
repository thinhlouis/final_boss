import React from "react";

const HourlyForecast = ({ data, getIconUrl }) => {
  return (
    <div className="hourly-forecast">
      <h3>Dự báo theo giờ</h3>
      <div className="hourly-list">
        {data.map((item, index) => (
          <div key={index} className="hourly-item">
            <div className="time">{item.time}</div>
            <img
              src={getIconUrl(item.icon)}
              alt="hourly icon"
              className="hourly-icon"
            />
            <div className="temp">{item.temp}°</div>
            <div className="hourly-description">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
