import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 10000,
});

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
      error.message =
        "Cannot connect to the JSON server. Please run: npm run server";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
