import React, { useMemo } from "react";

const LotteryTable = ({ data }) => {
  // Tạo mảng các số từ 00 đến 14
  const nums = useMemo(
    () => Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, "0")),
    []
  );

  // Xử lý dữ liệu để tối ưu hiệu năng
  const processedData = useMemo(() => {
    return data?.slice(0, data?.length).map((item) => {
      // Chuyển đổi định dạng ngày từ DD/MM/YYYY sang DD/MM
      const dateParts = item.turnNum.split("/");
      const date = `${dateParts[0]}/${dateParts[1]}`;

      // Xử lý chuỗi detail để lấy tất cả các số
      let allNumbers = [];
      try {
        const detailArray = JSON.parse(item.detail);
        detailArray.forEach((str) => {
          const numbers = str.split(",").map((num) => num.trim());
          allNumbers = [...allNumbers, ...numbers];
        });
      } catch (e) {
        console.error("Error parsing detail:", e);
      }

      // Lấy 2 số cuối của mỗi số trong detail
      const lastTwoDigits = allNumbers.map((num) => {
        return num.length >= 2 ? num.slice(-2) : num.padStart(2, "0");
      });

      return {
        date,
        lastTwoDigits,
      };
    });
  }, [data]);

  // Hàm đếm số lần xuất hiện của 2 số cuối
  const countOccurrences = (dateData, num) => {
    return dateData.lastTwoDigits.filter((digit) => digit === num).length;
  };

  return (
    <div className="table-container">
      <table id="customers">
        <thead>
          <tr id="date-station">
            <th>NUM</th>
            {processedData?.map((item, idx) => (
              <th key={idx}>
                <span>{item.date}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nums.map((num) => (
            <tr key={num}>
              <td style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{num}</td>
              {processedData?.map((item, idx) => {
                const count = countOccurrences(item, num);

                return (
                  <td key={idx} className={count > 1 ? "bold-color" : ""}>
                    {count > 0 ? `x${count > 1 ? count : ""}` : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LotteryTable;
