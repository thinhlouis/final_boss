import React, { useState, useEffect } from "react";

const images = [
  "../../../hero_bg/wallpapers.webp", // Thay đổi đường dẫn đến ảnh của bạn
  "../../../hero_bg/wallpapers-1.webp",
  "../../../hero_bg/wallpapers-2.webp",
  "../../../hero_bg/wallpapers-3.webp",
  "../../../hero_bg/wallpapers-4.webp",
];

const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalTime = 10000; // 10 giây (10000 miligiây)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalTime);

    // Dọn dẹp timer khi component unmount để tránh rò rỉ bộ nhớ
    return () => clearInterval(timer);
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component mount

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <img
          key={index} // Key duy nhất cho mỗi phần tử trong danh sách
          src={image}
          alt={`Slider ${index + 1}`}
          className={`slider-image ${
            index === currentImageIndex ? "active" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default ImageSlider;
