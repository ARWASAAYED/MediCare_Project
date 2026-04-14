import apiClient from "./apiClient";

export const serviceApi = {
  getAll: async () => {
    const response = await apiClient.get("/services");
    return response.data;
  },
};
