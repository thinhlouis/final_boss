import axiosInstance from "./axiosInstance";

const authAPI = {
  login: (values) => axiosInstance.post("/auth/sig-in", values),
  register: (values) => axiosInstance.post("/auth/sig-up", values),
  info: () => axiosInstance.get("/auth/me"),
  verify: () => axiosInstance.get("/auth/verify"),
};

export default authAPI;
