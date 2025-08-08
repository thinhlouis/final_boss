import React from "react";

const PollutionAir = ({ data, getIconUrl }) => {
  const pollutionIndex = data?.list[0]?.main?.aqi || 0;

  const LIST_INDEX = {
    1: { air: "Tốt", img: "/icon/1.png" },
    2: { air: "Khá", img: "/icon/2.png" },
    3: { air: "Trung Bình", img: "/icon/3.png" },
    4: { air: "Kém", img: "/icon/4.png" },
    5: { air: "Rất kém", img: "/icon/5.png" },
    6: { air: "Tồi tệ", img: "/icon/6.png" },
  };
  const airIndexLevels = [
    {
      name: "Good",
      percentage: 16.7,
    }, // Cấp độ 1: Xanh lá
    {
      name: "Moderate",
      percentage: 33.4,
    }, // Cấp độ 2: Vàng
    {
      name: "Unhealthy for Sensitive Groups",
      percentage: 50,
    }, // Cấp độ 3: Cam
    {
      name: "Unhealthy",
      percentage: 66.8,
    }, // Cấp độ 4: Đỏ
    {
      name: "Very Unhealthy",
      percentage: 83.5,
    }, // Cấp độ 5: Tím
    {
      name: "Hazardous",
      percentage: 100,
    }, // Cấp độ 5: Tím
  ];
  return (
    <div className="hourly-forecast">
      <h3>Chất lượng không khí</h3>
      <div className="hourly-list pollution-flex">
        <div className="air-pollution-container">
          <div
            className={`air-pollution-bar air-pollution-bar-${pollutionIndex}`}
            id="airPollutionBar"
            style={{
              width: `${airIndexLevels[pollutionIndex - 1].percentage}%`,
            }}
          >
            <span className="name-pollution">
              {airIndexLevels[pollutionIndex - 1].name}
            </span>
          </div>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}${LIST_INDEX[pollutionIndex].img}`}
          alt={LIST_INDEX[pollutionIndex].air}
        />
      </div>
    </div>
  );
};

export default PollutionAir;
