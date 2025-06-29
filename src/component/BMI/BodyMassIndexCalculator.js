import "./BodyMassIndexCalculator.css";
import BMI_Index_1 from "../../assets/bmi/bmi_1.png";
import BMI_Index_2 from "../../assets/bmi/bmi_2.png";
import BMI_Index_3 from "../../assets/bmi/bmi_3.png";
import BMI_Index_4 from "../../assets/bmi/bmi_4.png";
import BMI_Index_5 from "../../assets/bmi/bmi_5.png";

import React from "react";
import { useState, useRef, useEffect } from "react";

export default function BodyMassIndexCalculator() {
  const [yourBMI, setYourBMI] = useState(0);

  const [yourAge, setYourAge] = useState(0);
  const [yourBirth, setYourBirth] = useState(0);
  const [yourWeight, setYourWeight] = useState(0);
  const [yourHeight, setYourHeight] = useState(0);
  const [yourGender, setYourGender] = useState("");

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
    const age = calculateAge(yourBirth);

    const resultBMI = Number(yourWeight) / Number((yourHeight / 100) ** 2);

    setYourAge(age);
    setYourBMI(resultBMI);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="bmi_calculator_container">
      <h1>BMI CALCULATOR FINAL BOSS</h1>
      <div className="bmi_calculator_box">
        <div className="bmi_calculator">
          <div className="bmi_calculator_item bmi_left">
            <label htmlFor="birth">
              <span>Day of birth</span>
              <input
                ref={inputRef}
                type="date"
                id="birth"
                value={yourBirth}
                onChange={(e) => setYourBirth(e.target.value)}
                tabIndex="1"
              />
            </label>
            <label htmlFor="weight">
              <span>Weight (kg) </span>
              <input
                type="number"
                value={yourWeight}
                onChange={(e) => {
                  setYourWeight(e.target.valueAsNumber);
                }}
                onFocus={(e) => e.target.select()}
                id="weight"
                tabIndex="3"
              />
            </label>
          </div>
          <div className="bmi_calculator_item bmi_right">
            <label htmlFor="height">
              <span>Height (cm)</span>
              <input
                type="number"
                value={yourHeight}
                onChange={(e) => {
                  setYourHeight(e.target.valueAsNumber);
                }}
                onFocus={(e) => e.target.select()}
                id="height"
                tabIndex="2"
              />
            </label>
            <label className="gender">
              <span>Gender</span>
              <p className="select-gender">
                <span>Male</span>
                <input
                  type="radio"
                  value="Chàng trai"
                  onChange={(e) => setYourGender(e.target.value)}
                  name="gender"
                  id="male"
                  tabIndex="4"
                />
                <span>Female</span>
                <input
                  type="radio"
                  value="Cô gái"
                  onChange={(e) => setYourGender(e.target.value)}
                  name="gender"
                  id="female"
                  tabIndex="5"
                />
              </p>
            </label>
          </div>
        </div>
        <button className="result_bmi" onClick={resultCalculateBMI}>
          XEM KẾT QUẢ
        </button>
      </div>
      {yourBMI && (
        <div className="result_container">
          <img src={resultImageBMI(yourBMI)} alt={`index-bmi-${yourBMI}`} />
          <p>
            Xin chào {yourGender} {yourAge} tuổi
          </p>
          <h2>Chỉ số BMI của bạn là {Number(yourBMI).toFixed(1)}</h2>
        </div>
      )}
    </div>
  );
}
