import axiosInstance from "./axiosInstance";

const quotesAPI = {
  quotes: () => axiosInstance.get("/quotes/all-quote"),
  addNew: (value) => axiosInstance.post("/quotes/add-quotes", value),
  delete: (quoteid) =>
    axiosInstance.delete(`/quotes/delete-quote?quoteid=${quoteid}`),
};

export default quotesAPI;
