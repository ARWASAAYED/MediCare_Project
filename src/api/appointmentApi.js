// src/api/appointmentApi.js
import apiClient from "./apiClient";

export const appointmentApi = {
  getAll: async () => {
    const res = await apiClient.get("/appointments");
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/appointments/${id}`);
    return res.data;
  },

  // json-server filter query: ?patientId=xxx
  getByPatientId: async (patientId) => {
    const res = await apiClient.get(`/appointments?patientId=${patientId}`);
    return res.data;
  },

  // json-server filter query: ?doctorId=xxx
  getByDoctorId: async (doctorId) => {
    const res = await apiClient.get(`/appointments?doctorId=${doctorId}`);
    return res.data;
  },

  checkAvailability: async (doctorId, date) => {
    const res = await apiClient.get(`/appointments?doctorId=${doctorId}`);
    return res.data.filter((apt) => {
      const aptDate = new Date(apt.date).toDateString();
      const checkDate = new Date(date).toDateString();
      return aptDate === checkDate;
    });
  },

  create: async (data) => {
    const res = await apiClient.post("/appointments", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/appointments/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/appointments/${id}`);
  },
};
