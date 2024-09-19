const createRequest = async (url, options = {}) => {
  return await fetch(url, options);
};

export default createRequest;
