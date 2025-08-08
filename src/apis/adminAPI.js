import axiosInstance from "./axiosInstance";

const adminAPI = {
  update: (values) => axiosInstance.put("/admin/update", values),
  search: (keyword) => axiosInstance.get(`/admin/search?keyword=${keyword}`),
};

export default adminAPI;
