const formattedDate = (isoTime) => {
  const date = new Date(isoTime);

  const formatted = date
    .toLocaleString("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
    })
    .replace(" ", " ");

  return formatted;
};

export default formattedDate;
