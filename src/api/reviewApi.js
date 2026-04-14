import apiClient from "./apiClient";

export const reviewApi = {
  create: async (data) => {
    const res = await apiClient.post("/reviews", data);
    return res.data;
  },
  getByDoctorId: async (doctorId) => {
    const res = await apiClient.get(`/reviews?doctorId=${doctorId}`);
    return res.data;
  },
  getByPatientId: async (patientId) => {
    const res = await apiClient.get(`/reviews?patientId=${patientId}`);
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get("/reviews");
    return res.data;
  },
};
