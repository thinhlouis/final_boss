const hiddenText = (text) => {
  for (let i = 0; i < text.length; i++) {
    text = text.replace(text[i], "*");
  }
  return text;
};

export default hiddenText;
