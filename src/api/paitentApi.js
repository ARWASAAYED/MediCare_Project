import apiClient from "./apiClient";

export const patientApi = {
  getAll: async () => {
    const res = await apiClient.get("/patients");
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/patients/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post("/patients", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/patients/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    await apiClient.delete(`/patients/${id}`);
  },
};
