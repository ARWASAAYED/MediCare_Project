import apiClient from "./apiClient";

export const doctorApi = {
  getAll: async () => {
    const res = await apiClient.get("/doctors");
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/doctors/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post("/doctors", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/doctors/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/doctors/${id}`);
  },
};
