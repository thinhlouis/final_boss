const displayText = (text, hide) => {
  if (!text) return;
  if (text.length > 30) {
    return `${text.slice(0, Number(hide))}...${text.slice(
      -8,
      text.length + 1
    )}`;
  } else {
    return text;
  }
};

export default displayText;
