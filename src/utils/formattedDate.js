const formattedDate = (isoTime) => {
  const date = new Date(isoTime);

  const formatted = date
    .toLocaleString({
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(" ", " ");

  return formatted;
};

export default formattedDate;
