import axiosInstance from "./axiosInstance";

const activeAPI = {
  status: () => axiosInstance.get("/active/status"),
  change: (value) => axiosInstance.post("/active/chage-active", value),
};

export default activeAPI;
