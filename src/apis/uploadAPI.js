import axiosInstance from "./axiosInstance";

const uploadAPI = {
  jav: (values) => axiosInstance.post(`/upload/videos-jav`, values),
  real: (values) => axiosInstance.post(`/upload/videos-real`, values),
  image: (values) => axiosInstance.post(`/upload/picture-real`, values),
  avatar: (values, type) => axiosInstance.post(`/upload/avatar`, values, type),
  sign_jav: (values) => axiosInstance.post(`/upload/sign-url-jav`, values),
  sign_real: (values, type) =>
    axiosInstance.post(`/upload/sign-url-real`, values, type),
  sign_image: (values, type) =>
    axiosInstance.post(`/upload/sign-image`, values, type),
};

export default uploadAPI;
