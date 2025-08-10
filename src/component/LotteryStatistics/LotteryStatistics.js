import "./LotteryStatistics.css";
import LotteryTable from "./LotteryTable ";
import LOTO from "../../mock/infoLoto";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const { stationLoto, defaultLoto } = LOTO;
const today = new Date().getDay();
const loto = defaultLoto[today]?.slug;

export default function LotteryStatistics() {
  const [data, setData] = useState([]);
  const [station, setStation] = useState(loto);
  const [timeLoto, setTimeLoto] = useState("7");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!station || !timeLoto) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `https://xoso188.net/api/front/open/lottery/history/list/${timeLoto}/${station}`
        );

        setData(response?.data?.t);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [station, timeLoto]);

  if (loading) {
    return (
      <div>
        <p>Đang tải....</p>
      </div>
    );
  }

  return (
    <div className="container-loto">
      <div className="head-select root_flex_row flex_start gap_1">
        <div className="select_lottery_date">
          <select
            id="select_lottery_date"
            value={timeLoto}
            onChange={(e) => setTimeLoto(e.target.value)}
          >
            <option value="" disabled hidden>
              Chọn số kỳ xổ số
            </option>
            <option value="3">3 Kỳ</option>
            <option value="7">7 Kỳ</option>
            <option value="10">10 Kỳ</option>
            <option value="15">15 Kỳ</option>
            <option value="30">30 Kỳ</option>
          </select>
        </div>
        <div className="select_lottery_station">
          <select
            id="select_lottery_station"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          >
            <option value="" disabled hidden>
              Chọn đài xổ số
            </option>
            {stationLoto
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="root_flex_column item_start gap_1">
        <h1 className="title-loto">{`${data?.name}`}</h1>
        <LotteryTable data={data?.issueList} />
      </div>
    </div>
  );
}
