import axiosInstance from "./axiosInstance";

const authAPI = {
  login: (values) => axiosInstance.post("/auth/sig-in", values),
  register: (values) => axiosInstance.post("/auth/sig-up", values),
  info: () => axiosInstance.get("/auth/me"),
  verifyToken: () => axiosInstance.get("/auth/verify-token"),
  verifyCode: (code) => axiosInstance.post("/auth/verify-code", code),
  update: (values) => axiosInstance.put("/auth/update", values),
  search: (keyword) => axiosInstance.get(`/auth/search?keyword=${keyword}`),
  requestReset: (value) => axiosInstance.post(`/auth/request-reset`, value),
  verifyReset: (token) =>
    axiosInstance.get(`/auth/verify-reset?token=${token}`),
  confirmReset: (value) => axiosInstance.post(`/auth/confirm-reset`, value),
};

export default authAPI;
