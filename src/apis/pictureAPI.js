import axiosInstance from "./axiosInstance";

const pictureAPI = {
  pictures: (key, page, limit) =>
    axiosInstance.get(
      `/pictures/images?key=${key}&page=${page}&limit=${limit}`
    ),
};

export default pictureAPI;
