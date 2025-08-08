import "./PaginationControls.css";

import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow = 5, // Mặc định hiển thị 5 nút
}) => {
  const pageButtons = [];

  // Nút "Previous"
  pageButtons.push(
    <button
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="pagination-button-left root_flex_row"
    >
      <RiArrowLeftLine />
    </button>
  );

  // Logic để tạo các nút số trang
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Điều chỉnh nếu ở gần cuối
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`pagination-button root_flex_row ${
          i === currentPage ? "active" : ""
        }`}
      >
        {i}
      </button>
    );
  }

  // Nút "Next"
  pageButtons.push(
    <button
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="pagination-button-right root_flex_row"
    >
      <RiArrowRightLine />
    </button>
  );

  return <div className="pagination-container">{pageButtons}</div>;
};

export default PaginationControls;
