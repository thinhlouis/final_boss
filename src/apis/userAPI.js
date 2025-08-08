import axiosInstance from "./axiosInstance";

const userAPI = {
  status: () => axiosInstance.get("/user/status"),
  change: (value) => axiosInstance.post("/user/chage-active", value),
  vipMember: (value) => axiosInstance.get(`/user/vip-member/${value}`),
  requestReset: (value) => axiosInstance.post(`/user/request-reset`, value),
  verifyReset: (token) =>
    axiosInstance.get(`/user/verify-reset?token=${token}`),
  confirmReset: (value) => axiosInstance.post(`/user/confirm-reset`, value),
  update: (value) => axiosInstance.put(`/user/update`, value),
};

export default userAPI;
