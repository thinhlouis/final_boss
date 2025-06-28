import axiosInstance from "./axiosInstance";

const authAPI = {
  login: (values) => axiosInstance.post("/auth/sig-in", values),
  register: (values) => axiosInstance.post("/auth/sig-up", values),
  info: () => axiosInstance.get("/auth/me"),
  verify: () => axiosInstance.get("/auth/verify"),
  update: (values) => axiosInstance.put("/auth/update", values),
  search: (keyword) => axiosInstance.get(`/auth/search?keyword=${keyword}`),
};

export default authAPI;
