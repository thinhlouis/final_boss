import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_UIR_ROOT_API,
  timeout: 600000, // over 5 minutes stop calling
});

axiosInstance.interceptors.request.use((config) => {
  // Get accessToken from local storage
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    config.headers["x-access-token"] = accessToken;
  }

  return config;
});

export default axiosInstance;
