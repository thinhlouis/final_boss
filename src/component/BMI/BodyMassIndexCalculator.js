import "./BodyMassIndexCalculator.css";
import BMI1 from "../../assets/bmi/bmi_1.png";
import BMI2 from "../../assets/bmi/bmi_2.png";
import BMI3 from "../../assets/bmi/bmi_3.png";
import BMI4 from "../../assets/bmi/bmi_4.png";
import BMI5 from "../../assets/bmi/bmi_5.png";

import React from "react";
import { useState, useRef, useEffect } from "react";

export default function BodyMassIndexCalculator() {
  const [bmi, setBmi] = useState(null);
  const [age, setAge] = useState(null);
  const [img, setImg] = useState(null);
  const [birth, setBirth] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [gender, setGender] = useState("");

  const inputRef = useRef(null);

  const objBMI = {
    1: BMI1,
    2: BMI2,
    3: BMI3,
    4: BMI4,
    5: BMI5,
  };

  async function calculateAge(value) {
    if (!value) return;

    const birthDate = new Date(value); // Chuyển đổi thành đối tượng Date
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

  async function imgBMI(bmi) {
    if (bmi <= 18.5) {
      return 1;
    }
    if (bmi > 18.5 && bmi <= 22.9) {
      return 2;
    }
    if (bmi > 22.9 && bmi <= 24.9) {
      return 3;
    }
    if (bmi > 24.9 && bmi <= 29.9) {
      return 4;
    }
    return 5;
  }

  const resultCalculateBMI = async () => {
    const age = await calculateAge(birth);
    const BMI = Number(weight) / Number((height / 100) ** 2);

    const img = await imgBMI(BMI);
    setAge(age);
    setBmi(BMI);
    setImg(img);
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
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </label>
            <label htmlFor="weight">
              <span>Weight (kg) </span>
              <input
                type="number"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                onFocus={(e) => e.target.select()}
                id="weight"
              />
            </label>
          </div>
          <div className="bmi_calculator_item bmi_right">
            <label htmlFor="height">
              <span>Height (cm)</span>
              <input
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                }}
                onFocus={(e) => e.target.select()}
                id="height"
              />
            </label>
            <label htmlFor="gender" className="gender">
              <span>Gender</span>
              <p className="select-gender">
                <span>Male</span>
                <input
                  type="radio"
                  value="Chàng trai"
                  onChange={(e) => setGender(e.target.value)}
                  name="gender"
                  id="male"
                />
                <span>Female</span>
                <input
                  type="radio"
                  value="Cô gái"
                  onChange={(e) => setGender(e.target.value)}
                  name="gender"
                  id="female"
                />
              </p>
            </label>
          </div>
        </div>
        <button className="result_bmi" onClick={resultCalculateBMI}>
          XEM KẾT QUẢ
        </button>
      </div>
      {bmi && age && (
        <div className="result_container">
          <img src={objBMI[img]} alt={`index-bmi-${bmi}`} />
          <p>
            Xin chào {gender} {age} tuổi
          </p>
          <h2>Chỉ số BMI của bạn là {bmi.toFixed(1)}</h2>
        </div>
      )}
    </div>
  );
}
