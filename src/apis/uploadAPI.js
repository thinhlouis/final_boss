import axiosInstance from "./axiosInstance";

const uploadAPI = {
  jav: (values) => axiosInstance.post(`upload/videos-jav`, values),
  real: (values, type) =>
    axiosInstance.post(`upload/videos-real`, values, type),
};

export default uploadAPI;
