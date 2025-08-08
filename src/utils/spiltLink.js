const splitLink = (link, char) => {
  let split = link.split(char);
  return split[1];
};

export default splitLink;
