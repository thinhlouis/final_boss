import axiosInstance from "./axiosInstance";

const authAPI = {
  login: (values) => axiosInstance.post("/auth/sig-in", values),
  register: (values) => axiosInstance.post("/auth/sig-up", values),
  info: () => axiosInstance.get("/auth/me"),
  verifyToken: () => axiosInstance.get("/auth/verify-token"),
  verifyCode: (code) => axiosInstance.post("/auth/verify-code", code),
};

export default authAPI;
