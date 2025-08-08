import axiosInstance from "./axiosInstance";

const videoAPI = {
  videos: (key, page, limit) =>
    axiosInstance.get(
      `/videos/fetch-video?key=${key}&page=${page}&limit=${limit}`
    ),
  videoReal: (key, page, limit) =>
    axiosInstance.get(
      `/videos/fetch-video-real?key=${key}&page=${page}&limit=${limit}`
    ),
};

export default videoAPI;
