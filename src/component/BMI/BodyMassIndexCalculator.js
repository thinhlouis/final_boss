import "./BodyMassIndexCalculator.css";
import BMI_Index_1 from "../../assets/bmi/bmi_1.png";
import BMI_Index_2 from "../../assets/bmi/bmi_2.png";
import BMI_Index_3 from "../../assets/bmi/bmi_3.png";
import BMI_Index_4 from "../../assets/bmi/bmi_4.png";
import BMI_Index_5 from "../../assets/bmi/bmi_5.png";

import React from "react";
import { useState, useRef, useEffect } from "react";

export default function BodyMassIndexCalculator() {
  const [yourBMI, setYourBMI] = useState(null);
  const [yourAge, setYourAge] = useState(0);
  const [yourWeight, setYourWeight] = useState("");
  const [yourHeight, setYourHeight] = useState("");
  const [yourGender, setYourGender] = useState("Chàng trai");
  const [dayOfBirth, setDayOfBirth] = useState("");
  const [monthOfBirth, setMonthOfBirth] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [noti, setNoti] = useState("");

  const inputRef = useRef(null);

  const objBMI = {
    index_1: BMI_Index_1,
    index_2: BMI_Index_2,
    index_3: BMI_Index_3,
    index_4: BMI_Index_4,
    index_5: BMI_Index_5,
  };

  function calculateAge(value) {
    if (!value) return;

    const birthDate = new Date(value);

    const today = new Date(); // Ngày hiện tại

    let age = today.getFullYear() - birthDate.getFullYear(); // Tuổi sơ bộ

    const monthDifference = today.getMonth() - birthDate.getMonth(); // So sánh tháng

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const resultImageBMI = (bmi_index) => {
    if (bmi_index <= 18.5) {
      return objBMI.index_1;
    }
    if (bmi_index > 18.5 && bmi_index <= 22.9) {
      return objBMI.index_2;
    }
    if (bmi_index > 22.9 && bmi_index <= 24.9) {
      return objBMI.index_3;
    }
    if (bmi_index > 24.9 && bmi_index <= 29.9) {
      return objBMI.index_4;
    }
    return objBMI.index_5;
  };

  const resultCalculateBMI = () => {
    setNoti("");

    if (!yourHeight || !yourWeight) {
      setNoti(`Bớt bấm linh tinh đi!`);
      return;
    }

    let age;
    const birthDay = `${yearOfBirth}-${monthOfBirth}-${dayOfBirth}`;

    if (birthDay === "--") {
      age = "không có";
      setNoti(` Xin chào ${yourGender} ${age} tuổi`);
    } else {
      age = calculateAge(birthDay);
      setNoti(` Xin chào ${yourGender} ${age} tuổi`);
    }

    const resultBMI = Number(yourWeight) / Number((yourHeight / 100) ** 2);

    setYourAge(age);
    setYourBMI(resultBMI);
  };

  console.log(noti);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="bmi_calculator_container">
      <h1 style={{ margin: "2rem 0" }}>BMI CALCULATOR FINAL BOSS</h1>
      <div className="bmi_calculator_box">
        <div className="bmi_calculator_item">
          <div className="birth-day-box">
            <label htmlFor="day-of-birth">
              <span>Day</span>
              <input
                ref={inputRef}
                type="text"
                value={dayOfBirth}
                className="day-of-birth"
                placeholder="dd"
                id="day-of-birth"
                onChange={(e) =>
                  setDayOfBirth(e.target.value.replace(/\D/g, ""))
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label htmlFor="month-of-birth">
              <span>Month</span>
              <input
                type="text"
                value={monthOfBirth}
                className="month-of-birth"
                placeholder="mm"
                id="month-of-birth"
                onChange={(e) =>
                  setMonthOfBirth(e.target.value.replace(/\D/g, ""))
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label htmlFor="year-of-birth">
              <span>Year</span>
              <input
                type="text"
                value={yearOfBirth}
                className="year-of-birth"
                placeholder="yyyy"
                id="year-of-birth"
                onChange={(e) =>
                  setYearOfBirth(e.target.value.replace(/\D/g, ""))
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
          </div>
          <label className="gender">
            <span>Gender</span>
            <p className="select-gender">
              <span>Male</span>
              <input
                type="radio"
                value="Chàng trai"
                checked={yourGender === "Chàng trai"}
                onChange={(e) => setYourGender(e.target.value)}
                name="gender"
                id="male"
                tabIndex="4"
              />
              <span>Female</span>
              <input
                type="radio"
                value="Cô gái"
                checked={yourGender === "Cô gái"}
                onChange={(e) => setYourGender(e.target.value)}
                name="gender"
                id="female"
                tabIndex="5"
              />
            </p>
          </label>
          <label htmlFor="height">
            <span>Height (cm)</span>
            <input
              type="number"
              value={yourHeight}
              onChange={(e) => setYourHeight(e.target.value)}
              onFocus={(e) => e.target.select()}
              id="height"
              tabIndex="2"
            />
          </label>
          <label htmlFor="weight">
            <span>Weight (kg) </span>
            <input
              type="number"
              value={yourWeight}
              onChange={(e) => setYourWeight(e.target.value)}
              onFocus={(e) => e.target.select()}
              id="weight"
              tabIndex="3"
            />
          </label>
        </div>

        <div className="bmi_calculator_button">
          <button
            type="button"
            className="result_bmi"
            onClick={resultCalculateBMI}
          >
            XEM KẾT QUẢ
          </button>
        </div>
      </div>
      {!yourBMI && noti && (
        <p style={{ margin: "10px 0", color: "red" }}>{noti} 😈</p>
      )}
      {yourBMI && (
        <div className="result_container">
          <img src={resultImageBMI(yourBMI)} alt={`index-bmi-${yourBMI}`} />
          {yourAge && <p>{noti}</p>}
          <h2>Chỉ số BMI của bạn là {Number(yourBMI).toFixed(1)}</h2>
        </div>
      )}
    </div>
  );
}
